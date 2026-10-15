import React from 'react';
import { Code, Brain, Eye, Globe, BarChart3, Wrench, Compass, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

const iconMap = {
  Code: Code,
  Brain: Brain,
  Eye: Eye,
  Globe: Globe,
  BarChart3: BarChart3,
  Wrench: Wrench,
};

export default function CareerInterests() {
  const { interests, personal } = portfolioData;

  return (
    <section className="section" style={{ background: 'rgba(14, 20, 34, 0.4)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Compass size={14} />
            <span>Vision & Domains</span>
          </div>
          <h2 className="section-title">
            Professional <span>Interests</span>
          </h2>
          <p className="section-subtitle">
            Areas of computer science and technology that excite me and shape my ongoing learning and project development.
          </p>
        </div>

        {/* Career Objective Banner */}
        <div
          style={{
            maxWidth: '850px',
            margin: '0 auto 3rem auto',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.12))',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem 2rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: '#38bdf8',
              fontSize: '0.9rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.65rem',
            }}
          >
            <Sparkles size={16} />
            <span>Student Career Objective</span>
          </div>
          <p
            style={{
              fontSize: '1.02rem',
              color: '#f1f5f9',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            "{personal.careerObjective}"
          </p>
        </div>

        {/* Interests Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {interests.map((item, idx) => {
            const IconComp = iconMap[item.icon] || Code;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.15rem',
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComp size={22} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1.08rem',
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
