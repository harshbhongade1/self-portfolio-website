import React, { useEffect } from 'react';
import { X, Download, ShieldCheck, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

export default function CertificateModal({ certificate, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!certificate) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth: '900px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#60a5fa',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.2rem',
              }}
            >
              {certificate.issuer} • {certificate.category}
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              {certificate.title}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close certificate modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Document / Image Viewer */}
          <div
            style={{
              width: '100%',
              minHeight: '380px',
              maxHeight: '560px',
              borderRadius: 'var(--radius-md)',
              background: '#090d16',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            {certificate.fileType === 'image' ? (
              <img
                src={certificate.fileUrl}
                alt={certificate.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '520px',
                  objectFit: 'contain',
                  padding: '1rem',
                }}
              />
            ) : (
              <iframe
                src={`${certificate.fileUrl}#toolbar=0`}
                title={certificate.title}
                style={{
                  width: '100%',
                  height: '480px',
                  border: 'none',
                  background: '#1a1f2c',
                }}
              />
            )}
          </div>

          {/* Details */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <span className="badge badge-emerald">
              <ShieldCheck size={14} />
              <span>{certificate.dateLabel || 'Verified Credential'}</span>
            </span>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Document Type: {certificate.fileType.toUpperCase()}
            </span>
          </div>

          <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {certificate.description}
          </p>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <a
              href={certificate.fileUrl}
              download
              className="btn btn-primary"
            >
              <Download size={16} />
              <span>Download Certificate</span>
            </a>

            <a
              href={certificate.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              <ExternalLink size={16} />
              <span>Open in New Tab</span>
            </a>

            <button onClick={onClose} className="btn btn-outline" style={{ marginLeft: 'auto' }}>
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
