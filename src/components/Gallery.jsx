import React, { useState } from 'react';
import { Image, Eye, ExternalLink, ShieldCheck, Layers, FileText } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Gallery({ onSelectCertificate, onSelectProject }) {
  const { certificates, projects } = portfolioData;
  const [filter, setFilter] = useState('All');

  const galleryItems = [
    {
      id: 'cert-1',
      type: 'certificate',
      title: 'Maincrafts Internship Certification',
      subtitle: 'Internship & Practical Training',
      ref: certificates[0],
      isPdf: true,
      tag: 'Verified Certificate'
    },
    {
      id: 'cert-2',
      type: 'certificate',
      title: 'Red Hat Enterprise Linux (RH124)',
      subtitle: 'Red Hat Academy Credential',
      imgUrl: certificates[1]?.fileUrl,
      ref: certificates[1],
      isPdf: false,
      tag: 'Red Hat Badge'
    },
    {
      id: 'proj-1',
      type: 'project',
      title: 'Fruit Ripeness & Defect Detection',
      subtitle: 'Lightweight CNN & OpenCV Pipeline',
      ref: projects[0],
      tag: 'AI/ML Vision Model'
    },
    {
      id: 'proj-2',
      type: 'project',
      title: 'Smart Onboarding Assistant Web App',
      subtitle: 'Full-Stack Flask & Chatbot Helper',
      ref: projects[2],
      tag: 'Web & Chatbot'
    }
  ];

  const filteredItems = filter === 'All'
    ? galleryItems
    : galleryItems.filter(item => (filter === 'Certificates' ? item.type === 'certificate' : item.type === 'project'));

  return (
    <section id="gallery" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Image size={14} />
            <span>Visual Showcase</span>
          </div>
          <h2 className="section-title">
            Project & Credential <span>Gallery</span>
          </h2>
          <p className="section-subtitle">
            Visual cards and media snapshots of active engineering deliverables and verified credentials.
          </p>
        </div>

        {/* Filter buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.65rem',
            marginBottom: '2.5rem',
          }}
        >
          {['All', 'Certificates', 'Projects'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.45rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: filter === f ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                background: filter === f ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: filter === f ? '#38bdf8' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onClick={() => {
                if (item.type === 'certificate') onSelectCertificate(item.ref);
                else onSelectProject(item.ref);
              }}
            >
              <div>
                <div
                  style={{
                    height: '160px',
                    borderRadius: 'var(--radius-md)',
                    background: '#0a0e18',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    position: 'relative',
                  }}
                >
                  {item.imgUrl ? (
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '0.75rem',
                      }}
                    />
                  ) : item.isPdf ? (
                    <div style={{ textAlign: 'center', color: '#38bdf8' }}>
                      <FileText size={36} style={{ margin: '0 auto 0.4rem auto', display: 'block' }} />
                      <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600 }}>PDF Credential</span>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#a78bfa' }}>
                      <Layers size={36} style={{ margin: '0 auto 0.4rem auto', display: 'block' }} />
                      <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600 }}>Architecture Spec</span>
                    </div>
                  )}

                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                    }}
                  >
                    <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                      {item.tag}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {item.subtitle}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  marginTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  color: '#38bdf8',
                  fontWeight: 600,
                }}
              >
                <span>Inspect Item</span>
                <Eye size={15} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
