import React, { useState } from 'react';
import { Code2, Globe, Database, Brain, Wrench, CheckCircle, Flame, Layers } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

const categoryIcons = {
  "Programming Languages": Code2,
  "Web Development": Globe,
  "Backend & Databases": Database,
  "AI & Machine Learning": Brain,
  "Tools & Development Environment": Wrench,
};

export default function Skills() {
  const { skills } = portfolioData;
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...skills.map(s => s.category)];

  const displayedSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'Familiar':
        return 'badge-blue';
      case 'Learning':
        return 'badge-amber';
      case 'Beginner':
        return 'badge-purple';
      default:
        return 'badge-gray';
    }
  };

  return (
    <section id="skills" className="section" style={{ background: 'rgba(14, 20, 34, 0.4)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Layers size={14} />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="section-title">
            Skills & <span>Toolbox</span>
          </h2>
          <p className="section-subtitle">
            Core competencies organized by domain with transparent proficiency indicators—no arbitrary percentages.
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '3rem',
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1.15rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#38bdf8' : 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Skill Category Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.75rem',
          }}
          className="skills-grid"
        >
          {displayedSkills.map((catGroup, idx) => {
            const IconComp = categoryIcons[catGroup.category] || Layers;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Category Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#a78bfa',
                      }}
                    >
                      <IconComp size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                        {catGroup.category}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {catGroup.description}
                      </div>
                    </div>
                  </div>

                  {/* Skills List inside category */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                      marginTop: '1.25rem',
                    }}
                  >
                    {catGroup.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.025)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                          e.currentTarget.style.background = 'rgba(56, 189, 248, 0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.025)';
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f1f5f9' }}>
                            {skill.name}
                          </div>
                          {skill.tag && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {skill.tag}
                            </div>
                          )}
                        </div>

                        <span className={`badge ${getLevelBadgeClass(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom stage explanation legend */}
                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <CheckCircle size={12} style={{ color: '#10b981' }} />
                  <span>Verified via academic coursework & projects</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
