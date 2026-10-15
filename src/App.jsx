import React, { useState } from 'react';
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
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

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

      {/* Footer */}
      <Footer />

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

      {/* Scroll to Top floating button */}
      <ScrollToTop />
    </div>
  );
}
