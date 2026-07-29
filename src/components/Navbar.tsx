import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavSection, UserProfile } from '../types';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenVerifyModal: () => void;
  currentUser?: UserProfile | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenVerifyModal,
  currentUser,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'faq', label: 'FAQ' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (section: NavSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[72px] ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs'
          : 'bg-white/80 backdrop-blur-xs'
      }`}
      id="main-navbar"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-[56px] h-full flex items-center justify-between">
        {/* Logo (Left) */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="brand-logo"
        >
          <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shrink-0 transition-transform duration-200 group-hover:scale-[1.03] group-hover:bg-[#1D4ED8]">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[18px] font-semibold tracking-tight text-[#111827]">
              TruthRx
            </span>
            <span className="px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide bg-[#2563EB]/10 text-[#2563EB] rounded">
              AI
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9" id="desktop-nav">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative text-[15px] font-medium transition-colors duration-200 py-1.5 cursor-pointer ${
                  isActive
                    ? 'text-[#2563EB] font-semibold'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
                id={`nav-link-${item.id}`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] rounded-full"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button & User Profile */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenVerifyModal}
            className="btn-primary gap-2 px-4.5"
            id="nav-verify-now-btn"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Verify Claim</span>
          </button>

          {currentUser && (
            <div
              className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[13px] font-bold shadow-2xs border border-[#2563EB]/20 cursor-pointer shrink-0"
              title={`${currentUser.name} (${currentUser.email})`}
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          )}

          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out of TruthRx AI"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] border border-[#E5E7EB] transition-colors cursor-pointer shrink-0"
              id="nav-sign-out-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors"
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-white border-b border-[#E5E7EB] px-6 py-4 space-y-3 shadow-md overflow-hidden"
          >
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2 rounded-lg text-[15px] font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#F8FAFC] text-[#2563EB] font-semibold'
                      : 'text-[#4B5563] hover:bg-[#F8FAFC] hover:text-[#111827]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  onOpenVerifyModal();
                  setMobileMenuOpen(false);
                }}
                className="btn-primary w-full justify-center"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Claim</span>
              </button>

              {currentUser && onSignOut && (
                <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[12px] font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left text-[13px]">
                      <p className="font-semibold text-[#111827]">{currentUser.name}</p>
                      <p className="text-[11px] text-[#6B7280]">{currentUser.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-[13px] text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
