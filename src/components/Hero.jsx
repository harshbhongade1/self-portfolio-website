import React from 'react';
import { ArrowDown, FileText, Send, Sparkles, MapPin, GraduationCap, Code2, Terminal } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Hero({ onOpenResume }) {
  const { personal } = portfolioData;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '105px',
        paddingBottom: '4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)',
          filter: 'blur(70px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left Column: Introductions & CTAs */}
          <div>
            {/* Status pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontSize: '0.85rem',
                color: '#38bdf8',
                marginBottom: '1.5rem',
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 10px #10b981',
                  display: 'inline-block',
                }}
              />
              <span>Undergraduate • Symbiosis Institute of Technology</span>
            </div>

            {/* Headline & Name */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                marginBottom: '1rem',
              }}
            >
              Hi, I'm{' '}
              <span className="text-gradient" style={{ display: 'inline-block' }}>
                {personal.name}
              </span>
            </h1>

            {/* Core Headline Tagline */}
            <div
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                color: '#e2e8f0',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <Terminal size={24} style={{ color: '#8b5cf6' }} />
              <span>{personal.headline}</span>
            </div>

            {/* Bio Subtitle */}
            <p
              style={{
                fontSize: '1.08rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: '580px',
                marginBottom: '2rem',
              }}
            >
              Computer Science Engineering student at <strong style={{ color: '#fff', fontWeight: 600 }}>SIT Nagpur</strong> with a strong interest in software development, machine learning, computer vision, and building practical technology solutions.
            </p>

            {/* Technology tags */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.55rem',
                marginBottom: '2.5rem',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginRight: '0.25rem', fontWeight: 600 }}>
                STACK:
              </span>
              {personal.heroTags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#93c5fd',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => scrollTo('projects')}
                className="btn btn-primary"
                id="btn-explore-work"
              >
                <span>Explore My Work</span>
                <ArrowDown size={16} />
              </button>

              <button
                onClick={onOpenResume}
                className="btn btn-secondary"
                id="btn-hero-resume"
              >
                <FileText size={16} style={{ color: '#38bdf8' }} />
                <span>Download Resume</span>
              </button>

              <button
                onClick={() => scrollTo('contact')}
                className="btn btn-outline"
                id="btn-hero-connect"
              >
                <Send size={15} />
                <span>Let's Connect</span>
              </button>
            </div>
          </div>

          {/* Right Column: Avatar & Quick Info Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Glowing Backdrop behind Avatar */}
            <div
              style={{
                position: 'relative',
                width: '280px',
                height: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.75rem',
              }}
            >
              {/* Outer Pulsing Glow */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(59, 130, 246, 0.5), rgba(6, 182, 212, 0.3))',
                  filter: 'blur(22px)',
                  opacity: 0.6,
                }}
              />

              {/* Avatar Frame */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  padding: '5px',
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {personal.profilePhotoUrl ? (
                  <img
                    src={personal.profilePhotoUrl}
                    alt={personal.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      background: '#0e1422',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: 'linear-gradient(145deg, #101626, #0a0e1a)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '4.5rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #a78bfa, #60a5fa, #38bdf8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '2px',
                        lineHeight: 1,
                      }}
                    >
                      {personal.initials}
                    </span>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.4rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      Student Developer
                    </span>
                  </div>
                )}

                {/* Floating mini badge: Code */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(14, 20, 34, 0.95)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '50%',
                    width: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                    color: '#38bdf8',
                  }}
                  title="Software Developer"
                >
                  <Code2 size={22} />
                </div>
              </div>
            </div>

            {/* Compact Student Identity Card */}
            <div
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '360px',
                padding: '1.25rem 1.4rem',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: '#c084fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <GraduationCap size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>
                    {personal.degree}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Symbiosis International (Deemed University)
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <MapPin size={14} style={{ color: '#38bdf8' }} />
                <span>{personal.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 2.5rem !important;
          }
          .hero-grid > div:first-child {
            order: 2;
          }
          .hero-grid > div:last-child {
            order: 1;
          }
          .hero-grid p {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-grid #btn-explore-work,
          .hero-grid #btn-hero-resume,
          .hero-grid #btn-hero-connect {
            flex: 1 1 auto;
          }
        }
      `}</style>
    </section>
  );
}
