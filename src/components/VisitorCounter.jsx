import React, { useState, useEffect } from 'react';
import { Eye, Users, Activity, ShieldCheck, RefreshCw } from 'lucide-react';
import { fetchLiveStats } from '../services/analytics';

export default function VisitorCounter({ onOpenPrivacy, onNavigateAdmin }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStats = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    const data = await fetchLiveStats();
    if (data && data.stats) {
      setStats({
        ...data.stats,
        configured: data.configured !== false,
      });
    } else {
      setStats({ configured: false, totalVisits: 0, uniqueVisitors: 0, activeVisitors: 0 });
    }
    setLoading(false);
    if (isManual) {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    loadStats();

    // Listen for immediate real-time updates from page tracking & heartbeats
    const handleUpdated = (e) => {
      if (e.detail) {
        setStats({
          ...e.detail,
          configured: true,
        });
        setLoading(false);
      }
    };
    window.addEventListener('hb_stats_updated', handleUpdated);

    // Auto-update every 15 seconds without full page reload
    const interval = setInterval(() => {
      loadStats();
    }, 15000);

    return () => {
      window.removeEventListener('hb_stats_updated', handleUpdated);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="visitor-counter-container"
      style={{
        background: 'linear-gradient(135deg, rgba(14, 20, 34, 0.85), rgba(22, 31, 54, 0.65))',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginTop: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glowing ambient line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, #06b6d4, transparent)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
        }}
      >
        {/* Left: Counter title & live active badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Activity size={20} className={isRefreshing ? 'spin-animation' : ''} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '0.02em',
                }}
              >
                Portfolio Live Traffic
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#34d399',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 8px #10b981',
                  }}
                />
                Live
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time telemetry • Verified database metrics
            </p>
          </div>
        </div>

        {/* Center: Metric Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Total Visits */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Eye size={16} style={{ color: '#8b5cf6' }} />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Views
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                {loading ? '...' : (stats?.totalVisits ?? 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Unique Visitors */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Users size={16} style={{ color: '#3b82f6' }} />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Unique Visitors
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                {loading ? '...' : (stats?.uniqueVisitors ?? 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Active Now */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <Activity size={16} style={{ color: '#10b981' }} />
            <div>
              <div style={{ fontSize: '0.68rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Now
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                {loading ? '...' : (stats?.activeVisitors ?? 1)}
              </div>
            </div>
          </div>

          {/* Refresh Action */}
          <button
            onClick={() => loadStats(true)}
            title="Refresh visitor counts"
            aria-label="Refresh visitor counts"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin-animation' : ''} />
          </button>
        </div>

        {/* Right: Quick actions for Privacy & Admin access */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onOpenPrivacy}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
              e.currentTarget.style.color = '#38bdf8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <ShieldCheck size={13} />
            <span>Privacy</span>
          </button>

          <button
            onClick={onNavigateAdmin}
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#c4b5fd',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#8b5cf6';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
              e.currentTarget.style.color = '#c4b5fd';
            }}
          >
            Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
}
