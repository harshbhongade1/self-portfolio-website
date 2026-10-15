import React from 'react';
import { GraduationCap, School, BookMarked, CheckCircle2, Clock } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Education() {
  const { education } = portfolioData;

  return (
    <section id="education" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <GraduationCap size={14} />
            <span>Academic Background</span>
          </div>
          <h2 className="section-title">
            Education <span>Timeline</span>
          </h2>
          <p className="section-subtitle">
            Formal educational milestones leading up to my ongoing degree at Symbiosis Institute of Technology.
          </p>
        </div>

        {/* Timeline wrapper */}
        <div
          style={{
            maxWidth: '850px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Vertical connecting line */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '25px',
              bottom: '25px',
              left: '24px',
              width: '2px',
              background: 'linear-gradient(to bottom, #8b5cf6, #3b82f6, rgba(255, 255, 255, 0.1))',
              zIndex: 0,
            }}
            className="timeline-line"
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {education.map((item, index) => {
              const isCurrent = item.status === 'In Progress';
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr',
                    gap: '1.5rem',
                    alignItems: 'flex-start',
                  }}
                  className="timeline-item"
                >
                  {/* Timeline icon node */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: isCurrent
                        ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
                        : 'rgba(30, 41, 59, 0.9)',
                      border: isCurrent
                        ? '3px solid #090d16'
                        : '2px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: isCurrent
                        ? '0 0 20px rgba(139, 92, 246, 0.5)'
                        : '0 4px 10px rgba(0,0,0,0.4)',
                    }}
                  >
                    {index === 0 ? (
                      <GraduationCap size={22} />
                    ) : index === 1 ? (
                      <School size={20} />
                    ) : (
                      <BookMarked size={20} />
                    )}
                  </div>

                  {/* Timeline Content Card */}
                  <div className="glass-card" style={{ padding: '1.65rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.65rem',
                      }}
                    >
                      <span className={isCurrent ? 'badge badge-emerald' : 'badge badge-blue'}>
                        {isCurrent ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                        <span>{item.status}</span>
                      </span>

                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {item.period}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {item.degree}
                    </h3>

                    <div
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 600,
                        color: '#60a5fa',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {item.institution}
                    </div>

                    {item.university && (
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--text-muted)',
                          marginBottom: '0.85rem',
                        }}
                      >
                        {item.university}
                      </div>
                    )}

                    <p
                      style={{
                        fontSize: '0.92rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '1rem',
                      }}
                    >
                      {item.description}
                    </p>

                    {item.highlights && (
                      <div
                        style={{
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem',
                        }}
                      >
                        {item.highlights.map((h, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.84rem',
                              color: '#cbd5e1',
                            }}
                          >
                            <span style={{ color: '#8b5cf6', fontSize: '1rem' }}>•</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
