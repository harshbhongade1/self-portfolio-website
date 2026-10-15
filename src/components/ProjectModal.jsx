import React from 'react';
import { X, ExternalLink, Github, CheckCircle2, Layers, Cpu, AlertCircle } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#38bdf8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                marginBottom: '0.2rem',
              }}
            >
              {project.tagline}
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              {project.title}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close project modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Status badge & Overview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span className="badge badge-emerald">
              <span>{project.status}</span>
            </span>
          </div>

          <p style={{ fontSize: '0.98rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {project.description}
          </p>

          {/* Key Engineering Details */}
          {project.details && project.details.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h4
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Layers size={16} style={{ color: '#8b5cf6' }} />
                <span>Architecture & Implementation Highlights</span>
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.2rem',
                }}
              >
                {project.details.map((detail, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#38bdf8', marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies Used */}
          <div style={{ marginBottom: '2rem' }}>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
              }}
            >
              Technologies & Libraries
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: '#7dd3fc',
                    fontSize: '0.84rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                <Github size={16} />
                <span>View on GitHub</span>
              </a>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
              >
                <Github size={15} />
                <span>Repository URL ready to configure in portfolioData.js</span>
              </div>
            )}

            <button onClick={onClose} className="btn btn-secondary">
              <span>Close Overview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
