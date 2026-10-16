import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import AcademicPerformance from './components/AcademicPerformance';
import Certificates from './components/Certificates';
import Achievements from './components/Achievements';
import Contributions from './components/Contributions';
import CareerInterests from './components/CareerInterests';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import CertificateModal from './components/CertificateModal';
import ResumeModal from './components/ResumeModal';
import PrivacyNoticeModal from './components/PrivacyNoticeModal';
import VoluntaryConnectModal from './components/VoluntaryConnectModal';
import ScrollToTop from './components/ScrollToTop';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { trackPageView, sendHeartbeat } from './services/analytics';
import { getAdminSession, supabase } from './services/supabaseClient';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Routing state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [adminSession, setAdminSession] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Navigation helper
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync route on browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check auth session
  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const session = await getAdminSession();
        if (mounted) {
          setAdminSession(session);
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        if (mounted) setAuthChecking(false);
      }
    };

    checkSession();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) {
          setAdminSession(session);
        }
      });
      return () => {
        mounted = false;
        subscription?.unsubscribe();
      };
    }
  }, []);

  // Track visitor on mount & maintain heartbeat for active visitors
  useEffect(() => {
    if (!currentPath.startsWith('/admin')) {
      trackPageView();

      const heartbeatInterval = setInterval(() => {
        sendHeartbeat();
      }, 60000);

      return () => clearInterval(heartbeatInterval);
    }
  }, [currentPath]);

  // Open privacy modal if directly at /privacy
  useEffect(() => {
    if (currentPath === '/privacy') {
      setIsPrivacyModalOpen(true);
    }
  }, [currentPath]);

  // ADMIN ROUTE
  if (currentPath.startsWith('/admin')) {
    if (authChecking) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#080b11',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="spin-animation" style={{ width: '20px', height: '20px', border: '2px solid #8b5cf6', borderTopColor: 'transparent', borderRadius: '50%' }} />
            <span>Verifying administrator credentials...</span>
          </div>
        </div>
      );
    }

    if (adminSession) {
      return (
        <AdminDashboard
          session={adminSession}
          onLogout={() => {
            setAdminSession(null);
            navigate('/admin');
          }}
          onReturnHome={() => navigate('/')}
        />
      );
    }

    return (
      <AdminLogin
        onLoginSuccess={(session) => {
          setAdminSession(session);
          navigate('/admin');
        }}
        onReturnHome={() => navigate('/')}
      />
    );
  }

  // PUBLIC PORTFOLIO VIEW
  return (
    <div className="portfolio-app">
      {/* Sticky Top Navigation */}
      <Navbar onOpenResume={() => setIsResumeModalOpen(true)} />

      {/* Main Page Sections */}
      <main>
        <Hero onOpenResume={() => setIsResumeModalOpen(true)} />
        <About />
        <Education />
        <Skills />
        <Projects onSelectProject={(proj) => setSelectedProject(proj)} />
        <AcademicPerformance />
        <Certificates onSelectCertificate={(cert) => setSelectedCertificate(cert)} />
        <Achievements />
        <Contributions />
        <CareerInterests />
        <Gallery
          onSelectCertificate={(cert) => setSelectedCertificate(cert)}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />
        <Contact />
      </main>

      {/* Footer with Live Visitor Counter */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onNavigateAdmin={() => navigate('/admin')}
        onOpenConnect={() => setIsConnectModalOpen(true)}
      />

      {/* Modals & Overlays */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      <PrivacyNoticeModal
        isOpen={isPrivacyModalOpen}
        onClose={() => {
          setIsPrivacyModalOpen(false);
          if (currentPath === '/privacy') {
            navigate('/');
          }
        }}
      />

      <VoluntaryConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />

      {/* Scroll to Top floating button */}
      <ScrollToTop />
    </div>
  );
}
