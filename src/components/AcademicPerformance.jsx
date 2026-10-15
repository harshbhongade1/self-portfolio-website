import React from 'react';
import { Award, Clock, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function AcademicPerformance() {
  const { academicPerformance } = portfolioData;

  return (
    <section id="academics" className="section" style={{ background: 'rgba(14, 20, 34, 0.45)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Award size={14} />
            <span>Curriculum & Credentials</span>
          </div>
          <h2 className="section-title">
            Academic <span>Records</span>
          </h2>
          <p className="section-subtitle">
            Formal institutional enrollments and academic standing. Numerical metrics are strictly verified without fabrication.
          </p>
        </div>

        {/* Notice Banner */}
        <div
          style={{
            maxWidth: '850px',
            margin: '0 auto 2.5rem auto',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}
        >
          <Clock size={20} style={{ color: '#38bdf8', flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            <strong style={{ color: '#fff' }}>Transparency Note:</strong> {academicPerformance.statusNote}
          </p>
        </div>

        {/* Academic Records Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {academicPerformance.records.map((rec, index) => (
            <div
              key={index}
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
                  <span className="badge badge-blue">
                    <BookOpen size={12} />
                    <span>Academic Stage {index + 1}</span>
                  </span>

                  <span
                    className={`badge ${rec.badge?.includes('CGPA') ? 'badge-emerald' : 'badge-purple'}`}
                    style={{ fontWeight: 700, fontSize: '0.85rem' }}
                  >
                    {rec.badge || rec.status}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '0.4rem',
                  }}
                >
                  {rec.title}
                </h3>

                <div
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.25rem',
                  }}
                >
                  {rec.institution}
                </div>
              </div>

              {/* Status footer */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                }}
              >
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>{rec.scoreNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
