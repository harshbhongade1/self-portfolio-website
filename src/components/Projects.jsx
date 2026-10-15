import React, { useState } from 'react';
import { FolderGit2, ExternalLink, Github, Info, Sparkles, Check, ArrowUpRight, Cpu, AlertCircle } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Projects({ onSelectProject }) {
  const { projects } = portfolioData;

  const getBadgeClass = (statusType) => {
    switch (statusType) {
      case 'active':
        return 'badge-emerald';
      case 'in-progress':
        return 'badge-amber';
      case 'research':
        return 'badge-blue';
      case 'planned':
        return 'badge-purple';
      default:
        return 'badge-gray';
    }
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <FolderGit2 size={14} />
            <span>Practical Work</span>
          </div>
          <h2 className="section-title">
            Featured <span>Projects</span>
          </h2>
          <p className="section-subtitle">
            Hands-on academic and exploratory engineering projects solving problems in computer vision, climate analysis, web tooling, and student analytics.
          </p>
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '2rem',
          }}
          className="projects-grid"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => onSelectProject(project)}
            >
              <div>
                {/* Header: Status badge & Info icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <span className={`badge ${getBadgeClass(project.statusType)}`}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'currentColor',
                        display: 'inline-block',
                      }}
                    />
                    <span>{project.status}</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#38bdf8',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    title="View Full Architecture Details"
                  >
                    <ArrowUpRight size={16} />
                  </button>
                </div>

                {/* Subtitle tag */}
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#a78bfa',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '0.35rem',
                  }}
                >
                  {project.tagline}
                </div>

                {/* Project Title */}
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.35,
                    marginBottom: '0.85rem',
                  }}
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '1.4rem',
                  }}
                >
                  {project.description}
                </p>

                {/* Tech tags */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.45rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        color: '#7dd3fc',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Action Buttons */}
              <div
                style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProject(project);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: '1', justifyContent: 'center' }}
                >
                  <Info size={14} />
                  <span>Project Overview</span>
                </button>

                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn btn-outline btn-sm"
                    title="View GitHub Repository"
                  >
                    <Github size={15} />
                  </a>
                ) : (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontStyle: 'italic',
                      padding: '0 0.5rem',
                    }}
                  >
                    Repo in progress
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
