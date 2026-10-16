import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  LogOut,
  RefreshCw,
  Eye,
  Users,
  UserCheck,
  Calendar,
  Activity,
  Layers,
  Smartphone,
  Globe,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { adminSignOut } from '../services/supabaseClient';

export default function AdminDashboard({ session, onLogout, onReturnHome }) {
  const [range, setRange] = useState('30d');
  const [search, setSearch] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');
  const [pageFilter, setPageFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(15);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Active tab: 'analytics' | 'logs' | 'contacts' | 'retention'
  const [activeTab, setActiveTab] = useState('analytics');

  // Retention purge state
  const [purgeDays, setPurgeDays] = useState(30);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeMessage, setPurgeMessage] = useState('');

  const fetchAnalytics = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const token = session?.access_token;
      if (!token) {
        throw new Error('Authentication token is missing. Please sign in again.');
      }

      const params = new URLSearchParams({
        range,
        page: String(page),
        limit: String(limit),
      });
      if (search) params.append('search', search);
      if (deviceFilter) params.append('device', deviceFilter);
      if (pageFilter) params.append('pagePath', pageFilter);

      const response = await fetch(`/api/admin/analytics?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || `HTTP ${response.status}: Failed to load analytics`);
      }

      setData(json);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err.message || 'Failed to load analytics.');
      if (err.message.includes('401') || err.message.includes('expired')) {
        setTimeout(onLogout, 2500);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session, range, page, limit, search, deviceFilter, pageFilter, onLogout]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handlePurge = async (action) => {
    if (action === 'purge_all' && !window.confirm('Are you sure you want to completely erase ALL analytics data? This action cannot be undone.')) {
      return;
    }

    setIsPurging(true);
    setPurgeMessage('');

    try {
      const token = session?.access_token;
      const res = await fetch('/api/admin/purge', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, days: purgeDays }),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || 'Purge failed');
      }

      setPurgeMessage(resJson.message);
      fetchAnalytics(true);
    } catch (err) {
      setPurgeMessage(`Error: ${err.message}`);
    } finally {
      setIsPurging(false);
    }
  };

  const summary = data?.summary || {
    totalViews: 0,
    uniqueVisitors: 0,
    returningVisitors: 0,
    viewsToday: 0,
    views7d: 0,
    views30d: 0,
    activeVisitors: 0,
  };

  const logs = data?.logs || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, totalRecords: 0 };
  const dailyTrends = data?.dailyTrends || [];
  const deviceBreakdown = data?.deviceBreakdown || { Desktop: 0, Mobile: 0, Tablet: 0 };
  const mostViewedPages = data?.mostViewedPages || [];
  const contacts = data?.contacts || [];

  const maxDailyViews = Math.max(...dailyTrends.map((d) => d.views), 1);
  const totalDevices = Math.max(Object.values(deviceBreakdown).reduce((a, b) => a + b, 0), 1);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#070a10',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Admin Header Bar */}
      <header
        style={{
          background: 'rgba(12, 17, 30, 0.95)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Identity & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 700, margin: 0, color: '#fff' }}>
                  Portfolio Analytics Console
                </h1>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    color: '#c4b5fd',
                  }}
                >
                  ADMIN
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Authenticated as: <span style={{ color: '#38bdf8' }}>{session?.user?.email || 'Administrator'}</span>
              </p>
            </div>
          </div>

          {/* Controls: Date Range, Refresh, Home, Signout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Range Selector */}
            <select
              value={range}
              onChange={(e) => {
                setRange(e.target.value);
                setPage(1);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="today" style={{ background: '#0e1422' }}>Today's Activity</option>
              <option value="7d" style={{ background: '#0e1422' }}>Last 7 Days</option>
              <option value="30d" style={{ background: '#0e1422' }}>Last 30 Days</option>
              <option value="all" style={{ background: '#0e1422' }}>All Time History</option>
            </select>

            {/* Refresh */}
            <button
              onClick={() => fetchAnalytics(true)}
              disabled={refreshing}
              title="Refresh Analytics"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <RefreshCw size={14} className={refreshing ? 'spin-animation' : ''} />
              <span>Refresh</span>
            </button>

            {/* View Portfolio Website */}
            <button
              onClick={onReturnHome}
              title="Return to Public Portfolio"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <ExternalLink size={14} />
              <span>View Site</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={async () => {
                await adminSignOut();
                onLogout();
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0.85rem auto 0 auto',
            display: 'flex',
            gap: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.04)',
            paddingTop: '0.65rem',
          }}
        >
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.35rem 0.75rem',
              fontSize: '0.88rem',
              fontWeight: activeTab === 'analytics' ? 700 : 500,
              color: activeTab === 'analytics' ? '#38bdf8' : 'var(--text-muted)',
              borderBottom: activeTab === 'analytics' ? '2px solid #38bdf8' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            Overview & Trends
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.35rem 0.75rem',
              fontSize: '0.88rem',
              fontWeight: activeTab === 'logs' ? 700 : 500,
              color: activeTab === 'logs' ? '#38bdf8' : 'var(--text-muted)',
              borderBottom: activeTab === 'logs' ? '2px solid #38bdf8' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>Activity Logs</span>
            <span
              style={{
                fontSize: '0.7rem',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '1px 6px',
                borderRadius: '999px',
              }}
            >
              {pagination.totalRecords}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.35rem 0.75rem',
              fontSize: '0.88rem',
              fontWeight: activeTab === 'contacts' ? 700 : 500,
              color: activeTab === 'contacts' ? '#38bdf8' : 'var(--text-muted)',
              borderBottom: activeTab === 'contacts' ? '2px solid #38bdf8' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <MessageSquare size={14} />
            <span>Consented Connections</span>
            <span
              style={{
                fontSize: '0.7rem',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: '1px 6px',
                borderRadius: '999px',
              }}
            >
              {contacts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('retention')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.35rem 0.75rem',
              fontSize: '0.88rem',
              fontWeight: activeTab === 'retention' ? 700 : 500,
              color: activeTab === 'retention' ? '#f59e0b' : 'var(--text-muted)',
              borderBottom: activeTab === 'retention' ? '2px solid #f59e0b' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Clock size={14} />
            <span>Retention & Pruning</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <AlertTriangle size={20} />
            <div>
              <strong>Analytics Error:</strong> {error}
            </div>
          </div>
        )}

        {/* 8 SUMMARY CARDS (Visible on all tabs or overview) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {/* 1. Total Page Views */}
          <div className="card-glass" style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(14, 20, 34, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Page Views</span>
              <div style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.15)', padding: '6px', borderRadius: '8px' }}>
                <Eye size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {loading ? '...' : summary.totalViews.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Lifetime discrete views
            </div>
          </div>

          {/* 2. Estimated Unique Visitors */}
          <div className="card-glass" style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(14, 20, 34, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Unique Visitors</span>
              <div style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', padding: '6px', borderRadius: '8px' }}>
                <Users size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {loading ? '...' : summary.uniqueVisitors.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Distinct anonymous devices
            </div>
          </div>

          {/* 3. Returning Visitors */}
          <div className="card-glass" style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(14, 20, 34, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Returning Visitors</span>
              <div style={{ color: '#06b6d4', background: 'rgba(6, 182, 212, 0.15)', padding: '6px', borderRadius: '8px' }}>
                <UserCheck size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {loading ? '...' : summary.returningVisitors.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Multiple recorded visits
            </div>
          </div>

          {/* 4. Visits Today */}
          <div className="card-glass" style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(14, 20, 34, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Visits Today</span>
              <div style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '6px', borderRadius: '8px' }}>
                <Calendar size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {loading ? '...' : summary.viewsToday.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Since 00:00 UTC
            </div>
          </div>

          {/* 5. Visits Last 7 Days */}
          <div className="card-glass" style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(14, 20, 34, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Visits Last 7 Days</span>
              <div style={{ color: '#a855f7', background: 'rgba(168, 85, 247, 0.15)', padding: '6px', borderRadius: '8px' }}>
                <Activity size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {loading ? '...' : summary.views7d.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Rolling 7-day volume
            </div>
          </div>

          {/* 6. Visits Last 30 Days */}
          <div className="card-glass" style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(14, 20, 34, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Visits Last 30 Days</span>
              <div style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '6px', borderRadius: '8px' }}>
                <Layers size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {loading ? '...' : summary.views30d.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Monthly aggregate
            </div>
          </div>

          {/* 7. Most-Viewed Page */}
          <div className="card-glass" style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(14, 20, 34, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Top Visited Path</span>
              <div style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.15)', padding: '6px', borderRadius: '8px' }}>
                <Globe size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {loading ? '...' : (mostViewedPages[0]?.path || '/')}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              {mostViewedPages[0] ? `${mostViewedPages[0].count} views recorded` : 'No page hits yet'}
            </div>
          </div>

          {/* 8. Active Visitors Now */}
          <div
            className="card-glass"
            style={{
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(14, 20, 34, 0.8))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>Currently Active</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 10px #10b981',
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              {loading ? '...' : summary.activeVisitors}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Active within last 5 minutes
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & TRENDS */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Visual Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
              {/* Daily Traffic Bar Chart */}
              <div className="card-glass" style={{ padding: '1.75rem', borderRadius: '18px', background: 'rgba(14, 20, 34, 0.75)' }}>
                <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.25rem' }}>
                  Daily Traffic Trend (Last 14 Days)
                </h3>

                {dailyTrends.length === 0 ? (
                  <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No recorded traffic data yet.
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        height: '180px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '8px',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      {dailyTrends.map((day) => {
                        const heightPct = Math.max(8, Math.round((day.views / maxDailyViews) * 100));
                        return (
                          <div
                            key={day.date}
                            style={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              height: '100%',
                              justifyContent: 'flex-end',
                            }}
                            title={`${day.date}: ${day.views} views (${day.uniqueVisitors} unique)`}
                          >
                            <div
                              style={{
                                width: '100%',
                                height: `${heightPct}%`,
                                background: 'linear-gradient(180deg, #8b5cf6 0%, #3b82f6 100%)',
                                borderRadius: '4px 4px 0 0',
                                transition: 'height 0.3s ease',
                                cursor: 'pointer',
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>{dailyTrends[0]?.date.slice(5)}</span>
                      <span>Timeline (14d)</span>
                      <span>{dailyTrends[dailyTrends.length - 1]?.date.slice(5)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Device & Browser Distribution */}
              <div className="card-glass" style={{ padding: '1.75rem', borderRadius: '18px', background: 'rgba(14, 20, 34, 0.75)' }}>
                <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.25rem' }}>
                  Device & Client Breakdown
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {['Desktop', 'Mobile', 'Tablet'].map((dev) => {
                    const count = deviceBreakdown[dev] || 0;
                    const pct = Math.round((count / totalDevices) * 100) || 0;
                    return (
                      <div key={dev}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{dev}</span>
                          <span style={{ fontWeight: 600, color: '#fff' }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: '7px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: dev === 'Desktop' ? '#38bdf8' : dev === 'Mobile' ? '#8b5cf6' : '#10b981',
                              borderRadius: '999px',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Top Referrers: <strong style={{ color: '#fff' }}>Direct, GitHub, LinkedIn</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Most Visited Pages List */}
            <div className="card-glass" style={{ padding: '1.75rem', borderRadius: '18px', background: 'rgba(14, 20, 34, 0.75)' }}>
              <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1rem' }}>
                Page Views Breakdown
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.65rem 0' }}>Page Path</th>
                      <th style={{ padding: '0.65rem 0', textAlign: 'right' }}>Hits</th>
                      <th style={{ padding: '0.65rem 0', textAlign: 'right' }}>Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mostViewedPages.slice(0, 8).map((p) => {
                      const share = Math.round((p.count / (summary.totalViews || 1)) * 100);
                      return (
                        <tr key={p.path} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                          <td style={{ padding: '0.65rem 0', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{p.path}</td>
                          <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600, color: '#fff' }}>{p.count.toLocaleString()}</td>
                          <td style={{ padding: '0.65rem 0', textAlign: 'right', color: 'var(--text-muted)' }}>{share}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED ACTIVITY LOGS */}
        {activeTab === 'logs' && (
          <div className="card-glass" style={{ padding: '1.75rem', borderRadius: '18px', background: 'rgba(14, 20, 34, 0.85)' }}>
            {/* Filter and Search Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Search */}
              <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by IP address, page, or referrer..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem 0.55rem 2.4rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <select
                  value={deviceFilter}
                  onChange={(e) => {
                    setDeviceFilter(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                >
                  <option value="" style={{ background: '#0e1422' }}>All Devices</option>
                  <option value="Desktop" style={{ background: '#0e1422' }}>Desktop</option>
                  <option value="Mobile" style={{ background: '#0e1422' }}>Mobile</option>
                  <option value="Tablet" style={{ background: '#0e1422' }}>Tablet</option>
                </select>

                <select
                  value={pageFilter}
                  onChange={(e) => {
                    setPageFilter(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                >
                  <option value="" style={{ background: '#0e1422' }}>All Pages</option>
                  {mostViewedPages.map((p) => (
                    <option key={p.path} value={p.path} style={{ background: '#0e1422' }}>
                      {p.path}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>Visitor IP Address</th>
                    <th style={{ padding: '0.75rem' }}>Timestamp</th>
                    <th style={{ padding: '0.75rem' }}>Page Path</th>
                    <th style={{ padding: '0.75rem' }}>Referrer</th>
                    <th style={{ padding: '0.75rem' }}>Device & Client</th>
                    <th style={{ padding: '0.75rem' }}>Location</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        {loading ? 'Loading visitor activity logs...' : 'No activity records found matching filters.'}
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>
                          <span
                            style={{
                              background: 'rgba(56, 189, 248, 0.1)',
                              border: '1px solid rgba(56, 189, 248, 0.25)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            {log.ip || '127.0.0.1'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {new Date(log.timestamp).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                          {log.pagePath}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                          {log.referrer}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{log.browser}</span> on {log.os}
                          <span
                            style={{
                              marginLeft: '6px',
                              fontSize: '0.7rem',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {log.device}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                          {log.location}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700, color: '#fff' }}>
                          {log.visitCount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
              }}
            >
              <div>
                Showing page {pagination.page} of {Math.max(1, pagination.totalPages)} ({pagination.totalRecords} total entries)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '0.4rem 0.75rem',
                    cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                    opacity: pagination.page <= 1 ? 0.4 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setPage((p) => (p < pagination.totalPages ? p + 1 : p))}
                  disabled={pagination.page >= pagination.totalPages}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '0.4rem 0.75rem',
                    cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                    opacity: pagination.page >= pagination.totalPages ? 0.4 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONSENTED CONTACTS (Section 5) */}
        {activeTab === 'contacts' && (
          <div className="card-glass" style={{ padding: '1.75rem', borderRadius: '18px', background: 'rgba(14, 20, 34, 0.85)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', color: '#fff', margin: 0 }}>
                Voluntary Visitor Introductions
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                Visitors who opted to introduce themselves via the "Say Hello" connect form. Stored separately from anonymous analytics.
              </p>
            </div>

            {contacts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                No voluntary connections recorded yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '0.98rem' }}>{c.name}</h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <a
                      href={`mailto:${c.email}`}
                      style={{ color: '#38bdf8', fontSize: '0.85rem', textDecoration: 'none', display: 'block', marginBottom: '0.75rem' }}
                    >
                      {c.email}
                    </a>

                    {c.message && (
                      <p
                        style={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          margin: 0,
                          lineHeight: '1.5',
                        }}
                      >
                        "{c.message}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RETENTION & PRUNING (Section 7) */}
        {activeTab === 'retention' && (
          <div className="card-glass" style={{ padding: '1.75rem', borderRadius: '18px', background: 'rgba(14, 20, 34, 0.85)', maxWidth: '720px' }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.5rem' }}>
              Data Retention & Log Maintenance
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              In accordance with privacy best practices, granular page view events and stale visitor sessions should be pruned periodically.
            </p>

            {purgeMessage && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#34d399',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  marginBottom: '1.5rem',
                }}
              >
                {purgeMessage}
              </div>
            )}

            {/* Configurable Prune */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.95rem' }}>
                Prune Aged Telemetry Logs
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Deletes discrete page views older than the selected retention window while preserving aggregate totals.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <select
                  value={purgeDays}
                  onChange={(e) => setPurgeDays(Number(e.target.value))}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                >
                  <option value={30} style={{ background: '#0e1422' }}>Older than 30 Days (Recommended)</option>
                  <option value={60} style={{ background: '#0e1422' }}>Older than 60 Days</option>
                  <option value={90} style={{ background: '#0e1422' }}>Older than 90 Days</option>
                  <option value={7} style={{ background: '#0e1422' }}>Older than 7 Days</option>
                </select>

                <button
                  onClick={() => handlePurge('retention_cleanup')}
                  disabled={isPurging}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.55rem 1.25rem' }}
                >
                  {isPurging ? 'Pruning...' : 'Execute Retention Prune'}
                </button>
              </div>
            </div>

            {/* Total Purge Danger Zone */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '12px',
                padding: '1.25rem',
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#f87171', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Trash2 size={16} />
                <span>Danger Zone: Complete Analytics Reset</span>
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Erases all recorded page views, visitor sessions, and reset counters. Use only when preparing a clean environment or resetting test telemetry.
              </p>

              <button
                onClick={() => handlePurge('purge_all')}
                disabled={isPurging}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  borderRadius: '8px',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Erase All Analytics Records
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
