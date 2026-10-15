import React from 'react';
import { Bot, Laptop, Users, Calendar, Activity, CheckCircle2, ArrowRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

const iconMap = {
  Bot: Bot,
  Laptop: Laptop,
  Users: Users,
};

export default function Contributions() {
  const { contributions } = portfolioData;

  return (
    <section id="activities" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Activity size={14} />
            <span>Co-Curricular & Leadership</span>
          </div>
          <h2 className="section-title">
            Student <span>Activities</span>
          </h2>
          <p className="section-subtitle">
            Active involvement in student clubs, technical seminars, and engineering collaborations at Symbiosis Institute of Technology.
          </p>
        </div>

        {/* Contributions Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.75rem',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {contributions.map((act) => {
            const IconComp = iconMap[act.icon] || Activity;
            return (
              <div
                key={act.id}
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
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={22} />
                    </div>

                    <span className="badge badge-emerald">
                      <CheckCircle2 size={12} />
                      <span>{act.status}</span>
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#a78bfa',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'block',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {act.category}
                  </span>

                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {act.title}
                  </h3>

                  <div
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#60a5fa',
                      marginBottom: '0.85rem',
                    }}
                  >
                    {act.organization}
                  </div>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    {act.description}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Confirmed campus participation
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
