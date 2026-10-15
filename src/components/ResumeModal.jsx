import React, { useEffect } from 'react';
import { X, FileText, Download, CheckCircle, AlertCircle, Sparkles, FolderDown, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function ResumeModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { personal } = portfolioData;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileText size={20} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Curriculum Vitae / Resume
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close resume modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div
            style={{
              textAlign: 'center',
              padding: '1.5rem 1rem',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(56, 189, 248, 0.2))',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <FolderDown size={32} />
            </div>

            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
              {personal.name} — Engineering Resume
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Computer Science Engineering Student • Symbiosis Institute of Technology
            </p>

            {personal.isResumeAvailable ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <a
                  href={personal.resumeUrl}
                  download="Harsh_Bhongade_Resume.pdf"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  <Download size={18} />
                  <span>Download Resume (PDF)</span>
                </a>

                {personal.resumeDocxUrl && (
                  <a
                    href={personal.resumeDocxUrl}
                    download="Harsh_Bhongade_Resume.docx"
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '0.8rem' }}
                  >
                    <Download size={16} />
                    <span>Download Original Resume (DOCX)</span>
                  </a>
                )}

                <a
                  href={personal.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                >
                  <ExternalLink size={16} />
                  <span>Preview PDF in New Tab</span>
                </a>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#fbbf24',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>Resume PDF Ready For Drop-In</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '0.85rem' }}>
                  To maintain strict truthfulness, an invented resume has not been generated. Whenever you want to attach your real resume:
                </p>
                <ol
                  style={{
                    fontSize: '0.82rem',
                    color: '#94a3b8',
                    paddingLeft: '1.25rem',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  <li>Save your PDF as <code style={{ color: '#38bdf8' }}>resume.pdf</code> inside the <code style={{ color: '#38bdf8' }}>public/assets/</code> folder.</li>
                  <li>In <code style={{ color: '#38bdf8' }}>src/data/portfolioData.js</code>, set <code style={{ color: '#38bdf8' }}>isResumeAvailable: true</code>.</li>
                  <li>The Download Resume button will automatically serve your real PDF file!</li>
                </ol>
              </div>
            )}
          </div>

          <div
            style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
