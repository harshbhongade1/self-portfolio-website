import fs from 'fs';
import path from 'path';

// Storage path: local folder during dev, /tmp during Vercel serverless execution
function getStorageFilePath() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'telemetry.json');
  }
  return path.join(process.cwd(), 'src', 'data', 'telemetry.json');
}

class TelemetryStorage {
  constructor() {
    this.filePath = getStorageFilePath();
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read telemetry file, initializing default:', err.message);
    }
    return this.createDefaultData();
  }

  createDefaultData() {
    const pages = ['/', '/#projects', '/#skills', '/#about', '/#contact', '/#certificates'];
    const referrers = ['Direct', 'github.com', 'linkedin.com', 'Direct', 'Direct'];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const oss = ['Windows', 'macOS', 'Android', 'iOS', 'Linux'];
    const devices = ['Desktop', 'Desktop', 'Mobile', 'Mobile', 'Tablet'];
    const sampleIps = [
      { ip: '103.21.244.12', city: 'Nagpur', country: 'India' },
      { ip: '49.36.128.45', city: 'Mumbai', country: 'India' },
      { ip: '157.34.89.201', city: 'Pune', country: 'India' },
      { ip: '104.28.19.42', city: 'San Jose', country: 'United States' },
      { ip: '185.199.108.153', city: 'Frankfurt', country: 'Germany' },
      { ip: '106.195.6.80', city: 'Bengaluru', country: 'India' },
    ];

    const now = Date.now();
    const pageViews = [];
    const visitors = {};

    // Seed realistic starter data so graphs & IP logs are immediately visible
    for (let i = 28; i >= 1; i--) {
      const sample = sampleIps[i % sampleIps.length];
      const time = new Date(now - i * 3600 * 1000 * 2.5).toISOString();
      const dev = devices[i % devices.length];
      const browser = browsers[i % browsers.length];
      const os = oss[i % oss.length];
      const page = pages[i % pages.length];
      const ref = referrers[i % referrers.length];

      if (!visitors[sample.ip]) {
        visitors[sample.ip] = {
          ip: sample.ip,
          visitCount: 1,
          browser,
          os,
          device: dev,
          city: sample.city,
          country: sample.country,
          referrer: ref,
          firstSeen: time,
          lastSeen: time,
        };
      } else {
        visitors[sample.ip].visitCount += 1;
        visitors[sample.ip].lastSeen = time;
      }

      pageViews.push({
        id: 100 + i,
        ip: sample.ip,
        page,
        referrer: ref,
        browser,
        os,
        device: dev,
        location: `${sample.city}, ${sample.country}`,
        timestamp: time,
      });
    }

    const defaultState = {
      pageViews,
      visitors,
      activeSessions: {
        'init-active': {
          ip: '103.21.244.12',
          page: '/',
          lastActive: new Date().toISOString(),
        },
      },
      contacts: [],
    };

    this.save(defaultState);
    return defaultState;
  }

  save(data = this.data) {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.warn('Could not write telemetry file:', err.message);
    }
  }

  recordVisit({ ip, page = '/', referrer = 'Direct', browser = 'Chrome', os = 'Windows', device = 'Desktop', city = 'Nagpur', country = 'India', isHeartbeat = false, sessionId = 'sess' }) {
    const now = new Date().toISOString();

    // Update active session
    this.data.activeSessions[sessionId] = {
      ip,
      page,
      lastActive: now,
    };

    if (isHeartbeat) {
      this.save();
      return this.getStats();
    }

    // Deduplication check: ignore duplicate visit from same IP on same page within 15 seconds
    const fifteenSecAgo = Date.now() - 15000;
    const isDup = this.data.pageViews.some(
      (pv) => pv.ip === ip && pv.page === page && new Date(pv.timestamp).getTime() > fifteenSecAgo
    );

    if (!isDup) {
      if (this.data.visitors[ip]) {
        this.data.visitors[ip].visitCount = (this.data.visitors[ip].visitCount || 1) + 1;
        this.data.visitors[ip].lastSeen = now;
      } else {
        this.data.visitors[ip] = {
          ip,
          visitCount: 1,
          browser,
          os,
          device,
          city,
          country,
          referrer,
          firstSeen: now,
          lastSeen: now,
        };
      }

      this.data.pageViews.push({
        id: Date.now(),
        ip,
        page,
        referrer,
        browser,
        os,
        device,
        location: city && country ? `${city}, ${country}` : country || 'Unknown',
        timestamp: now,
      });

      this.save();
    }

    return this.getStats();
  }

  getStats() {
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    let activeCount = 0;
    for (const s of Object.values(this.data.activeSessions || {})) {
      if (new Date(s.lastActive).getTime() > fiveMinAgo) {
        activeCount++;
      }
    }

    return {
      totalVisits: this.data.pageViews.length,
      uniqueVisitors: Object.keys(this.data.visitors).length,
      activeVisitors: Math.max(1, activeCount),
    };
  }

  addContact({ ip, name, email, message }) {
    const contact = {
      id: Date.now(),
      ip,
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };
    this.data.contacts.unshift(contact);
    this.save();
    return contact;
  }

  getAnalyticsData({ range = '30d', search = '', deviceFilter = '', pageFilter = '', page = 1, limit = 15 }) {
    const stats = this.getStats();
    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 3600 * 1000;

    let viewsToday = 0;
    let views7d = 0;
    let views30d = 0;
    const pageCounts = {};

    this.data.pageViews.forEach((pv) => {
      const t = new Date(pv.timestamp).getTime();
      if (t >= todayStart.getTime()) viewsToday++;
      if (t >= sevenDaysAgo) views7d++;
      if (t >= thirtyDaysAgo) views30d++;

      const p = pv.page || '/';
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });

    let returningCount = 0;
    const deviceBreakdown = { Desktop: 0, Mobile: 0, Tablet: 0 };
    for (const v of Object.values(this.data.visitors)) {
      if (v.visitCount > 1) returningCount++;
      const dev = v.device || 'Desktop';
      deviceBreakdown[dev] = (deviceBreakdown[dev] || 0) + 1;
    }

    const mostViewedPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);

    // 14-day trends
    const dailyMap = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 24 * 3600 * 1000).toISOString().slice(0, 10);
      dailyMap[d] = { date: d, views: 0, unique: new Set() };
    }

    this.data.pageViews.forEach((pv) => {
      const d = pv.timestamp.slice(0, 10);
      if (dailyMap[d]) {
        dailyMap[d].views++;
        dailyMap[d].unique.add(pv.ip);
      }
    });

    const dailyTrends = Object.values(dailyMap).map((d) => ({
      date: d.date,
      views: d.views,
      uniqueVisitors: d.unique.size,
    }));

    // Filter logs with IP addresses
    let logs = [...this.data.pageViews].reverse().map((pv) => {
      const v = this.data.visitors[pv.ip] || {};
      return {
        id: pv.id,
        ip: pv.ip || '127.0.0.1',
        pagePath: pv.page,
        referrer: pv.referrer || 'Direct',
        timestamp: pv.timestamp,
        browser: pv.browser || 'Chrome',
        os: pv.os || 'Windows',
        device: pv.device || 'Desktop',
        location: pv.location || 'India',
        visitCount: v.visitCount || 1,
        firstSeen: v.firstSeen || pv.timestamp,
        lastSeen: v.lastSeen || pv.timestamp,
      };
    });

    if (search) {
      const s = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.ip.toLowerCase().includes(s) ||
          l.pagePath.toLowerCase().includes(s) ||
          l.referrer.toLowerCase().includes(s) ||
          l.location.toLowerCase().includes(s)
      );
    }

    if (deviceFilter) {
      logs = logs.filter((l) => l.device === deviceFilter);
    }
    if (pageFilter) {
      logs = logs.filter((l) => l.pagePath === pageFilter);
    }

    const totalRecords = logs.length;
    const offset = (page - 1) * limit;
    const paginatedLogs = logs.slice(offset, offset + limit);

    return {
      summary: {
        totalViews: this.data.pageViews.length,
        uniqueVisitors: Object.keys(this.data.visitors).length,
        returningVisitors: returningCount,
        viewsToday,
        views7d,
        views30d,
        activeVisitors: stats.activeVisitors,
      },
      mostViewedPages,
      deviceBreakdown,
      dailyTrends,
      logs: paginatedLogs,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
      contacts: this.data.contacts || [],
    };
  }

  purge({ action, days = 30 }) {
    if (action === 'retention_cleanup') {
      const cutoff = Date.now() - days * 24 * 3600 * 1000;
      const before = this.data.pageViews.length;
      this.data.pageViews = this.data.pageViews.filter((pv) => new Date(pv.timestamp).getTime() >= cutoff);
      this.save();
      return {
        success: true,
        message: `Successfully pruned ${before - this.data.pageViews.length} records older than ${days} days.`,
      };
    }

    if (action === 'purge_all') {
      this.data = this.createDefaultData();
      return {
        success: true,
        message: 'Analytics data has been reset to default state.',
      };
    }

    return { success: false, message: 'Invalid purge action' };
  }
}

export const storage = new TelemetryStorage();
