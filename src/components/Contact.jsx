import React, { useState } from 'react';
import { Mail, Github, Linkedin, Send, MapPin, AlertCircle, CheckCircle, Info, Copy, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Contact() {
  const { contact, personal } = portfolioData;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState(null); // 'success' | 'configured_info' | 'error'
  const [copiedDraft, setCopiedDraft] = useState(false);

  const isEmailConfigured = Boolean(contact.email && contact.email.includes('@'));
  const isGithubConfigured = Boolean(contact.github && contact.github.startsWith('http'));
  const isLinkedinConfigured = Boolean(contact.linkedin && contact.linkedin.startsWith('http'));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus({
        type: 'error',
        message: 'Please complete all required fields (Name, Email, and Message).',
      });
      return;
    }

    if (isEmailConfigured) {
      // Trigger mailto with prefilled fields
      const mailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent(
        formData.subject || `Portfolio Message from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoUrl;

      setFormStatus({
        type: 'success',
        message: 'Your email client has been opened with the drafted message!',
      });
    } else {
      // Honest, transparent feedback as instructed
      setFormStatus({
        type: 'configured_info',
        message:
          'Contact form preview: Email recipient is awaiting configuration in src/data/portfolioData.js. Your draft message is ready below to copy.',
      });
    }
  };

  const handleCopyDraft = () => {
    const draft = `From: ${formData.name} (${formData.email})\nSubject: ${formData.subject}\n\n${formData.message}`;
    navigator.clipboard.writeText(draft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 3000);
  };

  return (
    <section id="contact" className="section" style={{ background: 'rgba(14, 20, 34, 0.45)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Mail size={14} />
            <span>Get in Touch</span>
          </div>
          <h2 className="section-title">
            Let's <span>Connect</span>
          </h2>
          <p className="section-subtitle">
            Have an internship inquiry, project idea, or academic discussion? Reach out through any of the channels below.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '0.85fr 1.15fr',
            gap: '3rem',
            alignItems: 'start',
          }}
          className="contact-grid"
        >
          {/* Left Column: Direct channels & social status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.85rem' }}>
                Contact Information
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                I am actively seeking student internship opportunities and practical project collaborations. Feel free to connect!
              </p>

              {/* Channels List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Location
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                      {personal.location}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      color: '#a78bfa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Email
                    </div>
                    {isEmailConfigured ? (
                      <a
                        href={`mailto:${contact.email}`}
                        style={{ fontSize: '0.95rem', fontWeight: 600, color: '#38bdf8' }}
                      >
                        {contact.email}
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        Configure in portfolioData.js
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Profiles Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                Professional Profiles
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Connect on GitHub and LinkedIn. Links activate automatically once configured.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* GitHub */}
                {isGithubConfigured ? (
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Github size={18} />
                      <span>GitHub Profile</span>
                    </span>
                    <ExternalLink size={15} />
                  </a>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-muted)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Github size={18} />
                      <span>GitHub (Ready to configure)</span>
                    </span>
                    <span style={{ fontSize: '0.75rem' }}>portfolioData.js</span>
                  </div>
                )}

                {/* LinkedIn */}
                {isLinkedinConfigured ? (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Linkedin size={18} style={{ color: '#0a66c2' }} />
                      <span>LinkedIn Profile</span>
                    </span>
                    <ExternalLink size={15} />
                  </a>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-muted)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Linkedin size={18} />
                      <span>LinkedIn (Ready to configure)</span>
                    </span>
                    <span style={{ fontSize: '0.75rem' }}>portfolioData.js</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
              Send a Direct Message
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Fill out the details below. This form integrates directly with configured mail channels.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label
                  htmlFor="contact-name"
                  style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}
                >
                  Your Name <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(56, 189, 248, 0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}
                >
                  Your Email Address <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(56, 189, 248, 0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Internship Opportunity / Collaboration"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(56, 189, 248, 0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}
                >
                  Message <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hello Harsh, I came across your portfolio..."
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(56, 189, 248, 0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                />
              </div>

              {/* Status Notice */}
              {formStatus && (
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    background:
                      formStatus.type === 'error'
                        ? 'rgba(244, 63, 94, 0.1)'
                        : formStatus.type === 'success'
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(56, 189, 248, 0.1)',
                    border: `1px solid ${
                      formStatus.type === 'error'
                        ? 'rgba(244, 63, 94, 0.3)'
                        : formStatus.type === 'success'
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(56, 189, 248, 0.3)'
                    }`,
                    color:
                      formStatus.type === 'error'
                        ? '#fda4af'
                        : formStatus.type === 'success'
                        ? '#6ee7b7'
                        : '#7dd3fc',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {formStatus.type === 'error' ? (
                      <AlertCircle size={18} />
                    ) : formStatus.type === 'success' ? (
                      <CheckCircle size={18} />
                    ) : (
                      <Info size={18} />
                    )}
                    <span>{formStatus.message}</span>
                  </div>

                  {formStatus.type === 'configured_info' && (
                    <button
                      type="button"
                      onClick={handleCopyDraft}
                      className="btn btn-secondary btn-sm"
                      style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
                    >
                      <Copy size={13} />
                      <span>{copiedDraft ? 'Copied to Clipboard!' : 'Copy Form Draft'}</span>
                    </button>
                  )}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
