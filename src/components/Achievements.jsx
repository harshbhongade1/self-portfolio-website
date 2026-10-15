import React from 'react';
import { Trophy, Star, Sparkles, Plus, Edit3, ShieldAlert } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Achievements() {
  const { achievements } = portfolioData;

  return (
    <section id="achievements" className="section" style={{ background: 'rgba(14, 20, 34, 0.35)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Trophy size={14} />
            <span>Honors & Milestones</span>
          </div>
          <h2 className="section-title">
            Achievements & <span>Recognition</span>
          </h2>
          <p className="section-subtitle">
            Curated record of academic accomplishments and competitive milestones. Maintained with strict factual integrity.
          </p>
        </div>

        {/* Achievements Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          {achievements.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      color: '#fbbf24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trophy size={20} />
                  </div>

                  <span className="badge badge-amber">{item.tag}</span>
                </div>

                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '0.35rem',
                  }}
                >
                  {item.title}
                </h3>

                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#60a5fa',
                    fontWeight: 600,
                    marginBottom: '0.85rem',
                  }}
                >
                  {item.organization}
                </div>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </p>
              </div>

              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                }}
              >
                <Sparkles size={13} style={{ color: '#38bdf8' }} />
                <span>Verified academic engagement</span>
              </div>
            </div>
          ))}

          {/* Add Future Achievement Card */}
          <div
            className="glass-card"
            style={{
              borderStyle: 'dashed',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '2rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.015)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Edit3 size={20} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
              Add Competition or Hackathon Wins
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '260px', marginBottom: '0.75rem' }}>
              Easily append verified hackathon awards or coding contest ranks in <code style={{ color: '#38bdf8' }}>portfolioData.js</code>.
            </p>
            <span className="badge badge-gray">Ready For Future Wins</span>
          </div>
        </div>
      </div>
    </section>
  );
}
