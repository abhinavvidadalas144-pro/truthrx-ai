import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VerificationModal } from './components/VerificationModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { SampleClaims } from './components/SampleClaims';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { NavSection, ClaimCategory, UserProfile, VerificationResult } from './types';
import { initTheme } from './utils/theme';

export default function App() {
  useEffect(() => {
    const cleanup = initTheme();
    return cleanup;
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('truthrx_auth_logged_in') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('truthrx_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [modalInitialClaim, setModalInitialClaim] = useState('');
  const [modalInitialCategory, setModalInitialCategory] = useState<ClaimCategory>('whatsapp');

  const isProgrammaticScrollRef = React.useRef(false);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('truthrx_auth_logged_in', 'true');
    localStorage.setItem('truthrx_user_profile', JSON.stringify(user));
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setCurrentUser(updated);
    localStorage.setItem('truthrx_user_profile', JSON.stringify(updated));
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('truthrx_auth_logged_in');
    localStorage.removeItem('truthrx_user_profile');
  };

  const scrollToSection = (section: NavSection) => {
    setActiveSection(section);
    isProgrammaticScrollRef.current = true;
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 800);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const sectionIds: NavSection[] = ['home', 'features', 'how-it-works', 'faq', 'about'];

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollBottom = scrollY + viewportHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollBottom >= pageHeight - 60) {
        setActiveSection('about');
        return;
      }

      const navbarOffset = 120;
      let currentSection: NavSection = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - navbarOffset;
          if (scrollY >= top) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated]);

  const handleOpenVerifyModal = (claimText: string = '', category: ClaimCategory = 'whatsapp') => {
    setModalInitialClaim(claimText);
    setModalInitialCategory(category);
    setIsVerifyModalOpen(true);
  };

  const handleSelectSavedClaim = (result: VerificationResult) => {
    setModalInitialClaim(result.claimText);
    setModalInitialCategory(result.category || 'text');
    setIsVerifyModalOpen(true);
  };

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f17] text-[#111827] dark:text-gray-100 font-sans transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenVerifyModal={() => handleOpenVerifyModal('', 'whatsapp')}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      {/* Main Content Area */}
      <main>
        {/* Hero Section */}
        <Hero
          onVerifyClick={() => handleOpenVerifyModal('', 'whatsapp')}
          onLearnMoreClick={() => scrollToSection('features')}
        />

        {/* Viral Claims Fact-Check Library / Sandbox */}
        <SampleClaims
          onSelectClaim={(text, category) => handleOpenVerifyModal(text, category)}
        />

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks
          onVerifyClick={() => handleOpenVerifyModal('', 'whatsapp')}
        />

        {/* FAQ Section */}
        <FAQ />

        {/* About Section */}
        <About />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenVerifyModal={() => handleOpenVerifyModal('', 'whatsapp')}
      />

      {/* Verification Modal Dialog */}
      <VerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        initialClaimText={modalInitialClaim}
        initialCategory={modalInitialCategory}
      />

      {/* User Dashboard & History Modal */}
      <UserDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onSelectSavedClaim={handleSelectSavedClaim}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
