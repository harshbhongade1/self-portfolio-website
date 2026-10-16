// Local in-memory store for development telemetry when Supabase cloud is not yet connected
class LocalTelemetryStore {
  constructor() {
    this.visitors = new Map();
    this.pageViews = [];
    this.activeSessions = new Map();
    this.contacts = [];
    this.idCounter = 1;

    // Seed some realistic initial demo data so the dashboard charts and tables are immediately alive
    this._seedInitialData();
  }

  _seedInitialData() {
    const pages = ['/', '/#projects', '/#skills', '/#about', '/#contact', '/#certificates'];
    const referrers = ['Direct', 'github.com', 'linkedin.com', 'sitnagpur.ac.in', 'Direct'];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const oss = ['Windows', 'macOS', 'Android', 'iOS', 'Linux'];
    const devices = ['Desktop', 'Desktop', 'Mobile', 'Mobile', 'Tablet'];
    const locations = [
      { country: 'India', city: 'Nagpur' },
      { country: 'India', city: 'Mumbai' },
      { country: 'India', city: 'Pune' },
      { country: 'United States', city: 'San Jose' },
      { country: 'Germany', city: 'Berlin' },
    ];

    const now = Date.now();
    for (let i = 24; i >= 1; i--) {
      const vid = `vid_hb_${1000 + i}`;
      const time = new Date(now - i * 3600 * 1000 * 3.5).toISOString();
      const dev = devices[i % devices.length];
      const browser = browsers[i % browsers.length];
      const os = oss[i % oss.length];
      const loc = locations[i % locations.length];
      const page = pages[i % pages.length];
      const ref = referrers[i % referrers.length];

      this.visitors.set(vid, {
        visitor_id: vid,
        visit_count: (i % 3) + 1,
        browser,
        os,
        device: dev,
        country: loc.country,
        city: loc.city,
        referrer_domain: ref,
        first_seen_at: time,
        last_seen_at: time,
      });

      this.pageViews.push({
        id: this.idCounter++,
        visitor_id: vid,
        session_id: `sid_${i}`,
        page_path: page,
        referrer: ref,
        created_at: time,
      });
    }

    // Add active session
    this.activeSessions.set('sid_current', {
      session_id: 'sid_current',
      visitor_id: 'vid_current',
      page_path: '/',
      last_active_at: new Date().toISOString(),
    });
  }

  recordVisit({ visitorId, sessionId, pagePath, referrerDomain, browser, os, device, country, city, isHeartbeat }) {
    const now = new Date().toISOString();

    // Active session
    this.activeSessions.set(sessionId, {
      session_id: sessionId,
      visitor_id: visitorId,
      page_path: pagePath,
      last_active_at: now,
    });

    if (isHeartbeat) {
      return this.getStats();
    }

    // Check duplicate in last 15s
    const fifteenSecAgo = Date.now() - 15000;
    const isDup = this.pageViews.some(
      (pv) => pv.visitor_id === visitorId && pv.page_path === pagePath && new Date(pv.created_at).getTime() > fifteenSecAgo
    );

    if (!isDup) {
      const existing = this.visitors.get(visitorId);
      if (existing) {
        existing.visit_count = (existing.visit_count || 1) + 1;
        existing.last_seen_at = now;
      } else {
        this.visitors.set(visitorId, {
          visitor_id: visitorId,
          visit_count: 1,
          browser,
          os,
          device,
          country,
          city,
          referrer_domain: referrerDomain,
          first_seen_at: now,
          last_seen_at: now,
        });
      }

      this.pageViews.push({
        id: this.idCounter++,
        visitor_id: visitorId,
        session_id: sessionId,
        page_path: pagePath,
        referrer: referrerDomain,
        created_at: now,
      });
    }

    return this.getStats();
  }

  getStats() {
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    let activeCount = 0;
    for (const s of this.activeSessions.values()) {
      if (new Date(s.last_active_at).getTime() > fiveMinAgo) {
        activeCount++;
      }
    }

    return {
      totalVisits: this.pageViews.length,
      uniqueVisitors: this.visitors.size,
      activeVisitors: Math.max(1, activeCount),
    };
  }

  addContact({ visitorId, name, email, message }) {
    const contact = {
      id: this.idCounter++,
      visitor_id: visitorId,
      name,
      email,
      message,
      created_at: new Date().toISOString(),
    };
    this.contacts.unshift(contact);
    return contact;
  }

  getAnalyticsData({ range, search, deviceFilter, pageFilter, page = 1, limit = 15 }) {
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

    this.pageViews.forEach((pv) => {
      const t = new Date(pv.created_at).getTime();
      if (t >= todayStart.getTime()) viewsToday++;
      if (t >= sevenDaysAgo) views7d++;
      if (t >= thirtyDaysAgo) views30d++;

      const p = pv.page_path || '/';
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });

    let returningCount = 0;
    const deviceBreakdown = { Desktop: 0, Mobile: 0, Tablet: 0, Other: 0 };
    for (const v of this.visitors.values()) {
      if (v.visit_count > 1) returningCount++;
      const dev = v.device || 'Other';
      deviceBreakdown[dev] = (deviceBreakdown[dev] || 0) + 1;
    }

    const mostViewedPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);

    // Daily trends for last 14 days
    const dailyTrendsMap = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 24 * 3600 * 1000).toISOString().slice(0, 10);
      dailyTrendsMap[d] = { date: d, views: 0, unique: new Set() };
    }
    this.pageViews.forEach((pv) => {
      const d = pv.created_at.slice(0, 10);
      if (dailyTrendsMap[d]) {
        dailyTrendsMap[d].views++;
        dailyTrendsMap[d].unique.add(pv.visitor_id);
      }
    });

    const dailyTrends = Object.values(dailyTrendsMap).map((d) => ({
      date: d.date,
      views: d.views,
      uniqueVisitors: d.unique.size,
    }));

    // Filter logs
    let filtered = [...this.pageViews].reverse().map((pv) => {
      const v = this.visitors.get(pv.visitor_id) || {};
      const rawVid = pv.visitor_id || 'unknown';
      const maskedVid = rawVid.length > 10 ? `${rawVid.slice(0, 6)}...${rawVid.slice(-4)}` : rawVid;

      return {
        id: pv.id,
        visitorId: rawVid,
        maskedVisitorId: maskedVid,
        pagePath: pv.page_path,
        referrer: pv.referrer || 'Direct',
        timestamp: pv.created_at,
        browser: v.browser || 'Chrome',
        os: v.os || 'Windows',
        device: v.device || 'Desktop',
        location: v.country ? `${v.city || ''}, ${v.country}` : 'Unavailable',
        visitCount: v.visit_count || 1,
        firstSeen: v.first_seen_at || pv.created_at,
        lastSeen: v.last_seen_at || pv.created_at,
      };
    });

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.pagePath.toLowerCase().includes(s) ||
          l.referrer.toLowerCase().includes(s) ||
          l.visitorId.toLowerCase().includes(s)
      );
    }
    if (deviceFilter) {
      filtered = filtered.filter((l) => l.device === deviceFilter);
    }
    if (pageFilter) {
      filtered = filtered.filter((l) => l.pagePath === pageFilter);
    }

    const totalRecords = filtered.length;
    const offset = (page - 1) * limit;
    const paginatedLogs = filtered.slice(offset, offset + limit);

    return {
      summary: {
        totalViews: this.pageViews.length,
        uniqueVisitors: this.visitors.size,
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
      contacts: this.contacts,
    };
  }

  purge({ action, days = 30 }) {
    if (action === 'retention_cleanup') {
      const cutoff = Date.now() - days * 24 * 3600 * 1000;
      const initialCount = this.pageViews.length;
      this.pageViews = this.pageViews.filter((pv) => new Date(pv.created_at).getTime() >= cutoff);
      return {
        success: true,
        message: `Pruned ${initialCount - this.pageViews.length} activity records older than ${days} days.`,
      };
    } else if (action === 'purge_all') {
      this.pageViews = [];
      this.activeSessions.clear();
      this.visitors.clear();
      return {
        success: true,
        message: 'All analytics and visitor records have been successfully reset.',
      };
    }
    return { success: false, message: 'Invalid action' };
  }
}

export const localStore = new LocalTelemetryStore();
