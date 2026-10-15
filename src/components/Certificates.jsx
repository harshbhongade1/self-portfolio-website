import React from 'react';
import { Award, FileText, ExternalLink, Eye, Download, ShieldCheck, PlusCircle } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Certificates({ onSelectCertificate }) {
  const { certificates } = portfolioData;

  return (
    <section id="certificates" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Award size={14} />
            <span>Verified Credentials</span>
          </div>
          <h2 className="section-title">
            Certificates & <span>Training</span>
          </h2>
          <p className="section-subtitle">
            Authentic certifications and training documents. Click any credential to inspect the verified document or certificate badge.
          </p>
        </div>

        {/* Certificates Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '2rem',
          }}
          className="certificates-grid"
        >
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => onSelectCertificate(cert)}
            >
              <div>
                {/* Certificate Preview Header */}
                <div
                  style={{
                    position: 'relative',
                    height: '180px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    marginBottom: '1.25rem',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cert.fileType === 'image' ? (
                    <img
                      src={cert.fileUrl}
                      alt={cert.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '1rem',
                        transition: 'transform var(--transition-normal)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: '#38bdf8',
                      }}
                    >
                      <div
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '12px',
                          background: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FileText size={28} />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>
                        Official PDF Certificate
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Click to view document
                      </span>
                    </div>
                  )}

                  {/* Top-right badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                    }}
                  >
                    <span className="badge badge-emerald">
                      <ShieldCheck size={12} />
                      <span>{cert.dateLabel || 'Verified'}</span>
                    </span>
                  </div>
                </div>

                {/* Issuer & Category */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.4rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#60a5fa',
                    }}
                  >
                    {cert.issuer}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {cert.category}
                  </span>
                </div>

                {/* Certificate Title */}
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '0.65rem',
                  }}
                >
                  {cert.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                    marginBottom: '1.25rem',
                  }}
                >
                  {cert.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCertificate(cert);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Eye size={14} />
                  <span>View Certificate</span>
                </button>

                <a
                  href={cert.fileUrl}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="btn btn-secondary btn-sm"
                  title="Download File"
                >
                  <Download size={14} />
                </a>
              </div>
            </div>
          ))}

          {/* Add More Certificate Placeholder Card */}
          <div
            className="glass-card"
            style={{
              borderStyle: 'dashed',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '2.5rem 1.5rem',
              background: 'rgba(14, 20, 34, 0.3)',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                color: '#a78bfa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <PlusCircle size={24} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
              Add More Certificates
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '280px', marginBottom: '1rem' }}>
              Drop your new PDF or image certificate in <code style={{ color: '#38bdf8' }}>public/assets/certificates/</code> and list it in <code style={{ color: '#38bdf8' }}>portfolioData.js</code>.
            </p>
            <span className="badge badge-gray">Extensible Gallery</span>
          </div>
        </div>
      </div>
    </section>
  );
}
