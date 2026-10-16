/**
 * Client-Side Privacy-Conscious Analytics Service
 * Handles visitor identification, deduplication against React StrictMode,
 * heartbeat updates, and stats fetching.
 */

// Generate a random RFC4122 v4 UUID
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Get or initialize persistent anonymous visitor ID
export function getVisitorId() {
  const STORAGE_KEY = 'hb_portfolio_vid';
  let vid = '';
  try {
    vid = localStorage.getItem(STORAGE_KEY);
    if (!vid) {
      vid = generateUUID();
      localStorage.setItem(STORAGE_KEY, vid);
    }
  } catch {
    vid = generateUUID();
  }
  return vid;
}

// Get or initialize current browser session ID
export function getSessionId() {
  const SESSION_KEY = 'hb_portfolio_sid';
  let sid = '';
  try {
    sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = generateUUID();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
  } catch {
    sid = generateUUID();
  }
  return sid;
}

// In-memory guard to prevent duplicate calls in React StrictMode and quick re-renders
let lastTrackedPath = null;
let lastTrackedTime = 0;
const DEDUPLICATION_INTERVAL_MS = 15000; // 15 seconds

/**
 * Record a page visit event.
 * Enforces deduplication to guard against React.StrictMode remounts & accidental re-renders.
 */
export async function trackPageView(pagePath = window.location.pathname + window.location.hash) {
  const now = Date.now();

  // Deduplicate if same path was recorded very recently
  if (lastTrackedPath === pagePath && now - lastTrackedTime < DEDUPLICATION_INTERVAL_MS) {
    return null;
  }

  lastTrackedPath = pagePath;
  lastTrackedTime = now;

  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  const referrer = document.referrer || '';

  try {
    const response = await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitorId,
        sessionId,
        pagePath,
        referrer,
        isHeartbeat: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    // Graceful silent fallback for client
    console.debug('Analytics track ping:', err.message);
    return null;
  }
}

/**
 * Send periodic heartbeat to keep the session marked as "Active Visitor"
 */
export async function sendHeartbeat(pagePath = window.location.pathname + window.location.hash) {
  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  try {
    const response = await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitorId,
        sessionId,
        pagePath,
        isHeartbeat: true,
      }),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.debug('Heartbeat ping:', err.message);
  }
  return null;
}

/**
 * Fetch latest public aggregate statistics for the footer counter
 */
export async function fetchLiveStats() {
  try {
    const response = await fetch('/api/stats', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.debug('Stats fetch ping:', err.message);
    return null;
  }
}

/**
 * Voluntarily identify visitor (Section 5)
 */
export async function submitConsentedContact({ name, email, message }) {
  const visitorId = getVisitorId();

  const response = await fetch('/api/identify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      visitorId,
      name,
      email,
      message,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit contact');
  }

  return data;
}
