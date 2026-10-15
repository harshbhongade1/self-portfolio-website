import React from 'react';
import { GraduationCap, Cpu, FolderGit2, Sparkles, Target, Compass, BookOpen, Heart } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

const highlightIcons = {
  GraduationCap: GraduationCap,
  Cpu: Cpu,
  FolderGit2: FolderGit2,
  Sparkles: Sparkles,
};

export default function About() {
  const { personal } = portfolioData;

  return (
    <section id="about" className="section" style={{ background: 'rgba(14, 20, 34, 0.35)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} />
            <span>Introduction</span>
          </div>
          <h2 className="section-title">
            About <span>Me</span>
          </h2>
          <p className="section-subtitle">
            A snapshot of my academic journey, passion for software engineering, and continuous drive to learn.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2.5rem',
            alignItems: 'stretch',
          }}
          className="about-grid"
        >
          {/* Main Narrative Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  marginBottom: '1.25rem',
                  color: '#38bdf8',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <BookOpen size={18} />
                <span>My Story & Aspirations</span>
              </div>

              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: '1.8',
                  color: '#cbd5e1',
                  marginBottom: '1.5rem',
                }}
              >
                {personal.about}
              </p>

              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.75',
                  color: 'var(--text-secondary)',
                  marginBottom: '1.75rem',
                }}
              >
                Whether it's experimenting with computer vision models using OpenCV and lightweight CNNs, or architecting responsive web tools with modern JavaScript, I enjoy the creative and analytical balance of programming. I thrive in hands-on environments where I can build and iterate on solutions that address practical needs.
              </p>
            </div>

            {/* Career Objective Box */}
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.4rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#c084fc',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                }}
              >
                <Target size={16} />
                <span>Internship & Career Objective</span>
              </div>
              <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
                {personal.careerObjective}
              </p>
            </div>
          </div>

          {/* Highlights Grid */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {personal.highlights.map((item, idx) => {
              const IconComp = highlightIcons[item.icon] || Sparkles;
              return (
                <div
                  key={idx}
                  className="glass-card"
                  style={{
                    padding: '1.25rem 1.4rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
