import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavSection, UserProfile } from '../types';
import { useTheme } from '../hooks/useTheme';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenVerifyModal: () => void;
  currentUser?: UserProfile | null;
  onSignOut?: () => void;
  onOpenDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenVerifyModal,
  currentUser,
  onSignOut,
  onOpenDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'health-assistant', label: 'AI Health Assistant' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 h-[72px] ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md border-b border-[#E5E7EB] dark:border-gray-800/80 shadow-xs'
          : 'bg-white/80 dark:bg-[#0b0f17]/80 backdrop-blur-xs border-b border-transparent'
      }`}
      id="main-navbar"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 h-full flex items-center justify-between">
        {/* Logo (Left) */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          id="brand-logo"
        >
          <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shrink-0 transition-transform duration-200 group-hover:scale-[1.03] group-hover:bg-[#1D4ED8]">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[18px] font-semibold tracking-tight text-[#111827] dark:text-gray-100">
              TruthRx
            </span>
            <span className="px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-blue-400 rounded">
              AI
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" id="desktop-nav">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative text-[15px] font-medium transition-colors duration-200 py-1.5 cursor-pointer ${
                  isActive
                    ? 'text-[#2563EB] dark:text-blue-400 font-semibold'
                    : 'text-[#4B5563] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white'
                }`}
                id={`nav-link-${item.id}`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] dark:bg-blue-500 rounded-full"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button & User Profile & Theme Toggle */}
        <div className="hidden sm:flex items-center gap-4 sm:gap-4.5 md:gap-5">
          <button
            onClick={toggleTheme}
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7280] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 transition-colors cursor-pointer shrink-0"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle visual theme"
            id="nav-theme-toggle-btn"
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5 text-amber-400 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
            )}
          </button>

          <button
            onClick={onOpenVerifyModal}
            className="btn-primary gap-2 px-4.5 h-9 flex items-center justify-center"
            id="nav-verify-now-btn"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Verify Claim</span>
          </button>

          {currentUser && (
            <button
              onClick={onOpenDashboard}
              type="button"
              className="w-9 h-9 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center text-[13px] font-bold shadow-2xs border border-[#2563EB]/20 cursor-pointer shrink-0 transition-transform hover:scale-105"
              title={`${currentUser.name} - View Dashboard & History`}
              id="nav-user-profile-btn"
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </button>
          )}

          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out of TruthRx AI"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7280] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 transition-colors cursor-pointer shrink-0"
              id="nav-sign-out-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-lg text-[#4B5563] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle visual theme"
            id="mobile-theme-toggle-btn"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#4B5563] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition-colors"
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
            className="md:hidden bg-white dark:bg-[#0f172a] border-b border-[#E5E7EB] dark:border-gray-800 px-6 py-4 space-y-3 shadow-md overflow-hidden"
          >
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2 rounded-lg text-[15px] font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#F8FAFC] dark:bg-gray-800 text-[#2563EB] dark:text-blue-400 font-semibold'
                      : 'text-[#4B5563] dark:text-gray-300 hover:bg-[#F8FAFC] dark:hover:bg-gray-800 hover:text-[#111827] dark:hover:text-white'
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
                <div className="pt-2 border-t border-[#E5E7EB] dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[12px] font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left text-[13px]">
                      <p className="font-semibold text-[#111827] dark:text-gray-100">{currentUser.name}</p>
                      <p className="text-[11px] text-[#6B7280] dark:text-gray-400">{currentUser.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-[13px] text-red-600 dark:text-red-400 font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
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
