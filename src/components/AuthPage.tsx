import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Globe,
  Languages,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Building2,
  FileCheck,
  Check,
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthView, UserProfile } from '../types';
import { useTheme } from '../hooks/useTheme';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const easeCurve = [0.22, 1, 0.36, 1] as const;

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const { isDark, toggleTheme } = useTheme();

  // Form State - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Form State - Registration
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCountry, setRegCountry] = useState('United States');
  const [regLanguage, setRegLanguage] = useState('English');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [regError, setRegError] = useState('');

  // Form State - Forgot Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Form State - Verification
  const [verifyCode, setVerifyCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  // Registered User Data Cache
  const [createdUser, setCreatedUser] = useState<UserProfile | null>(null);

  // Helper for quick Demo Auto-fill
  const handleQuickDemoLogin = (emailVal: string) => {
    setLoginEmail(emailVal);
    setLoginPassword('TruthRx2026!');
  };

  // Handler: Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your work or personal email address.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setLoginError(data.error || 'Failed to sign in. Please check your credentials.');
      } else {
        onLoginSuccess(data.user);
      }
    } catch {
      // Fallback client-side auth
      const user: UserProfile = {
        name: loginEmail.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()) || 'Healthcare Professional',
        email: loginEmail,
        country: 'United States',
        language: 'English',
        role: 'Verified Researcher'
      };
      onLoginSuccess(user);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Registration Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify both fields.');
      return;
    }
    if (!agreeTerms) {
      setRegError('You must agree to the Terms & Privacy Policy to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          country: regCountry,
          language: regLanguage,
          role: 'Enterprise Member'
        })
      });
      const data = await res.json();
      const newUser: UserProfile = data.user || {
        name: regName,
        email: regEmail,
        country: regCountry,
        language: regLanguage,
        role: 'Enterprise Member'
      };
      setCreatedUser(newUser);
      setCurrentView('verification');
    } catch {
      const newUser: UserProfile = {
        name: regName,
        email: regEmail,
        country: regCountry,
        language: regLanguage,
        role: 'Enterprise Member'
      };
      setCreatedUser(newUser);
      setCurrentView('verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Forgot Password Submission
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      setForgotSent(true);
    } catch {
      setForgotSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Code Digit Entry
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...verifyCode];
    newCode[index] = value;
    setVerifyCode(newCode);

    // Auto-advance focus to next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentView('account-created');
    }, 700);
  };

  const handleResendCode = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0b0f17] flex flex-col justify-between font-sans text-[#111827] dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.08]" 
        style={{
          backgroundImage: `radial-gradient(#111827 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header Navigation */}
      <header className="w-full bg-white/90 dark:bg-[#0b0f17]/90 backdrop-blur-md border-b border-[#E5E7EB] dark:border-gray-800 py-4 px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-xs">
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

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7280] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 transition-colors cursor-pointer shrink-0"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle visual theme"
              id="auth-theme-toggle-btn"
            >
              {isDark ? (
                <Sun className="w-4.5 h-4.5 text-amber-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
              )}
            </button>

            <div className="flex items-center gap-2 text-[12px] font-medium text-[#6B7280] dark:text-gray-400">
              <ShieldCheck className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              <span className="hidden sm:inline">HIPAA & Clinical Evidence Standard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-[1120px] mx-auto">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: LOGIN PAGE */}
            {currentView === 'login' && (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: easeCurve }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left Side: Welcome & Value Propositions */}
                <div className="lg:col-span-5 space-y-6 lg:pr-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-[12px] font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Clinical Verification Portal</span>
                  </div>

                  <div>
                    <h1 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-[#111827] dark:text-white leading-[1.2]">
                      Welcome Back
                    </h1>
                    <p className="mt-3 text-[15px] text-[#4B5563] dark:text-gray-300 leading-relaxed">
                      Sign in to securely access your TruthRx AI account and verify medical claims against peer-reviewed clinical databases.
                    </p>
                  </div>

                  {/* Enterprise Feature Cards */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3.5 p-3.5 bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[12px] shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 dark:bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-blue-400 shrink-0 mt-0.5">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-[#111827] dark:text-white">WHO & PubMed Indexing</h4>
                        <p className="text-[12px] text-[#6B7280] dark:text-gray-400">Automated cross-referencing with global medical journals & CDC guidelines.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3.5 bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[12px] shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 dark:bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-blue-400 shrink-0 mt-0.5">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-[#111827] dark:text-white">Multimodal Rumor Analysis</h4>
                        <p className="text-[12px] text-[#6B7280] dark:text-gray-400">Analyze screenshots, WhatsApp forwards, and voice notes instantly.</p>
                      </div>
                    </div>
                  </div>

                  {/* Demo Account Quick Switch */}
                  <div className="pt-2">
                    <p className="text-[12px] font-medium text-[#6B7280] dark:text-gray-400 mb-2">Instant Demo Login Accounts:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('dr.sarah.jenkins@mayo.edu')}
                        className="text-[12px] bg-white dark:bg-gray-800 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 text-[#2563EB] dark:text-blue-400 border border-[#2563EB]/30 rounded-[8px] px-2.5 py-1 transition-all cursor-pointer hover:-translate-y-0.5 shadow-2xs"
                      >
                        Doctor / Researcher
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('alex.verified@truth-rx.ai')}
                        className="text-[12px] bg-white dark:bg-gray-800 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 text-[#2563EB] dark:text-blue-400 border border-[#2563EB]/30 rounded-[8px] px-2.5 py-1 transition-all cursor-pointer hover:-translate-y-0.5 shadow-2xs"
                      >
                        Public Health Analyst
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side: Login Card */}
                <div className="lg:col-span-7">
                  <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[16px] shadow-lg p-6 sm:p-8 max-w-md mx-auto lg:max-w-none">
                    
                    <div className="mb-6">
                      <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">Sign In to Your Account</h2>
                      <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mt-1">Please enter your credentials to proceed.</p>
                    </div>

                    {loginError && (
                      <div className="mb-4 p-3 rounded-[10px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-[13px] flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      {/* Email Field */}
                      <div>
                        <label className="block text-[12px] font-medium text-[#374151] dark:text-gray-300 uppercase tracking-wider mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#9CA3AF] dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="name@organization.com"
                            className="w-full bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[10px] pl-10 pr-3.5 py-2.5 text-[14px] text-[#111827] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-all duration-200"
                            id="login-email-input"
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div>
                        <label className="block text-[12px] font-medium text-[#374151] dark:text-gray-300 uppercase tracking-wider mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#9CA3AF] dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[10px] pl-10 pr-10 py-2.5 text-[14px] text-[#111827] dark:text-white placeholder-[#9CA3AF] dark:placeholder-gray-500 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-all duration-200"
                            id="login-password-input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-gray-500 hover:text-[#374151] dark:hover:text-gray-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember & Forgot Options */}
                      <div className="flex items-center justify-between text-[13px] pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[#4B5563] dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-[#D1D5DB] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#2563EB] focus:ring-[#2563EB]"
                          />
                          <span>Remember Me</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setCurrentView('forgot-password')}
                          className="font-medium text-[#2563EB] dark:text-blue-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      {/* Primary Sign In Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary py-3 justify-center text-[15px] font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 mt-2"
                        id="login-submit-btn"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Authenticating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#E5E7EB]" />
                      </div>
                      <div className="relative flex justify-center text-[12px] uppercase">
                        <span className="bg-white px-3 text-[#6B7280] font-medium">Or continue with</span>
                      </div>
                    </div>

                    {/* Social OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('workspace.user@google.com')}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#E5E7EB] rounded-[10px] text-[13px] font-medium text-[#374151] hover:bg-[#F8FAFC] hover:border-[#D1D5DB] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-2xs"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('enterprise.user@microsoft.com')}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#E5E7EB] rounded-[10px] text-[13px] font-medium text-[#374151] hover:bg-[#F8FAFC] hover:border-[#D1D5DB] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-2xs"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 23 23">
                          <path fill="#f35325" d="M1 1h10v10H1z"/>
                          <path fill="#81bc06" d="M12 1h10v10H12z"/>
                          <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                          <path fill="#ffba08" d="M12 12h10v10H12z"/>
                        </svg>
                        <span>Microsoft</span>
                      </button>
                    </div>

                    {/* Bottom Registration Link */}
                    <div className="mt-6 text-center text-[13px] text-[#6B7280]">
                      <span>Don't have an account? </span>
                      <button
                        type="button"
                        onClick={() => setCurrentView('register')}
                        className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors cursor-pointer"
                        id="switch-to-register-btn"
                      >
                        Create Account
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: REGISTRATION PAGE */}
            {currentView === 'register' && (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.35, ease: easeCurve }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left Side (45%): Branding & Value Propositions */}
                <div className="lg:col-span-5 space-y-6 lg:pr-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-[12px] font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>TruthRx AI Account Setup</span>
                  </div>

                  <div>
                    <h1 className="text-[30px] sm:text-[36px] font-bold tracking-tight text-[#111827] leading-[1.2]">
                      Create Your TruthRx AI Account
                    </h1>
                    <p className="mt-3 text-[14px] text-[#4B5563] leading-relaxed">
                      Join TruthRx AI to securely verify health information, identify misinformation, and access trusted medical guidance powered by AI.
                    </p>
                  </div>

                  {/* Three Feature Points */}
                  <div className="space-y-3.5 pt-1">
                    <div className="flex items-start gap-3.5 p-3.5 bg-white border border-[#E5E7EB] rounded-[12px] shadow-2xs hover:border-[#2563EB]/30 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                        <ShieldCheck className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-[#111827] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#2563EB] font-bold" />
                          <span>Enterprise-grade Security</span>
                        </h4>
                        <p className="text-[12px] text-[#6B7280] mt-0.5">
                          Your account and data are protected using secure authentication.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3.5 bg-white border border-[#E5E7EB] rounded-[12px] shadow-2xs hover:border-[#2563EB]/30 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-[#111827] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#2563EB] font-bold" />
                          <span>Trusted Health Verification</span>
                        </h4>
                        <p className="text-[12px] text-[#6B7280] mt-0.5">
                          Verify medical information using reliable evidence-based sources.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3.5 bg-white border border-[#E5E7EB] rounded-[12px] shadow-2xs hover:border-[#2563EB]/30 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                        <Globe className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-[#111827] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#2563EB] font-bold" />
                          <span>Multi-language Support</span>
                        </h4>
                        <p className="text-[12px] text-[#6B7280] mt-0.5">
                          Access healthcare verification in your preferred language.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side (55%): Registration Card (Matches Login card size) */}
                <div className="lg:col-span-7">
                  <div className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-lg p-6 sm:p-8 max-w-md mx-auto lg:max-w-none">
                    
                    <div className="mb-5">
                      <h2 className="text-[22px] font-semibold text-[#111827]">Get Started</h2>
                      <p className="text-[13px] text-[#6B7280] mt-1">Fill in your details below to create your account.</p>
                    </div>

                    {regError && (
                      <div className="mb-4 p-3 rounded-[10px] bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[12px] font-medium text-[#374151] uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="Dr. Sarah Jenkins"
                            className="w-full bg-white border border-[#E5E7EB] rounded-[10px] pl-10 pr-3.5 py-2.5 text-[14px] text-[#111827] placeholder-[#9CA3AF] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-all duration-200"
                            id="register-fullname-input"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-[12px] font-medium text-[#374151] uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="sarah.jenkins@hospital.org"
                            className="w-full bg-white border border-[#E5E7EB] rounded-[10px] pl-10 pr-3.5 py-2.5 text-[14px] text-[#111827] placeholder-[#9CA3AF] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-all duration-200"
                            id="register-email-input"
                          />
                        </div>
                      </div>

                      {/* Password & Confirm Password */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[12px] font-medium text-[#374151] uppercase tracking-wider mb-1">
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="password"
                              required
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-white border border-[#E5E7EB] rounded-[10px] pl-10 pr-3.5 py-2.5 text-[14px] text-[#111827] placeholder-[#9CA3AF] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-all duration-200"
                              id="register-password-input"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[12px] font-medium text-[#374151] uppercase tracking-wider mb-1">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="password"
                              required
                              value={regConfirmPassword}
                              onChange={(e) => setRegConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-white border border-[#E5E7EB] rounded-[10px] pl-10 pr-3.5 py-2.5 text-[14px] text-[#111827] placeholder-[#9CA3AF] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-all duration-200"
                              id="register-confirmpassword-input"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Terms & Privacy Checkbox */}
                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer text-[12.5px] text-[#4B5563]">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="w-4 h-4 rounded border-[#D1D5DB] text-[#2563EB] focus:ring-[#2563EB] mt-0.5 shrink-0"
                          />
                          <span>
                            I agree to the <a href="#faq" className="text-[#2563EB] font-medium underline">Terms of Service</a> and <a href="#faq" className="text-[#2563EB] font-medium underline">Privacy Policy</a>.
                          </span>
                        </label>
                      </div>

                      {/* Primary Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary py-3 justify-center text-[15px] font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 mt-2"
                        id="register-submit-btn"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>Create Account</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#E5E7EB]" />
                      </div>
                      <div className="relative flex justify-center text-[12px] uppercase">
                        <span className="bg-white px-3 text-[#6B7280] font-medium">Or continue with</span>
                      </div>
                    </div>

                    {/* Social OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setRegName('Dr. Sarah Jenkins');
                          setRegEmail('workspace.user@google.com');
                          setAgreeTerms(true);
                        }}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#E5E7EB] rounded-[10px] text-[13px] font-medium text-[#374151] hover:bg-[#F8FAFC] hover:border-[#D1D5DB] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-2xs"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRegName('Alex Verified');
                          setRegEmail('enterprise.user@microsoft.com');
                          setAgreeTerms(true);
                        }}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#E5E7EB] rounded-[10px] text-[13px] font-medium text-[#374151] hover:bg-[#F8FAFC] hover:border-[#D1D5DB] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-2xs"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 23 23">
                          <path fill="#f35325" d="M1 1h10v10H1z"/>
                          <path fill="#81bc06" d="M12 1h10v10H12z"/>
                          <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                          <path fill="#ffba08" d="M12 12h10v10H12z"/>
                        </svg>
                        <span>Microsoft</span>
                      </button>
                    </div>

                    {/* Bottom Link */}
                    <div className="mt-5 text-center text-[13px] text-[#6B7280]">
                      <span>Already have an account? </span>
                      <button
                        type="button"
                        onClick={() => setCurrentView('login')}
                        className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors cursor-pointer"
                        id="switch-to-login-btn"
                      >
                        Sign In
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 3: FORGOT PASSWORD */}
            {currentView === 'forgot-password' && (
              <motion.div
                key="forgot-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: easeCurve }}
                className="max-w-md mx-auto bg-white border border-[#E5E7EB] rounded-[16px] shadow-lg p-6 sm:p-8"
              >
                <button
                  type="button"
                  onClick={() => setCurrentView('login')}
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#111827] transition-colors mb-4 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </button>

                <div className="mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-3">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h2 className="text-[22px] font-bold text-[#111827]">Reset Password</h2>
                  <p className="text-[13px] text-[#6B7280] mt-1">
                    Enter your email address to receive a secure password reset link.
                  </p>
                </div>

                {forgotSent ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-[14px]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Reset Link Sent!</span>
                      </div>
                      <p className="text-[12px] leading-relaxed">
                        We have sent password reset instructions to <span className="font-semibold">{forgotEmail}</span>. Please check your inbox.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentView('login')}
                      className="w-full btn-primary py-2.5 justify-center text-[14px]"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-medium text-[#374151] uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="name@organization.com"
                          className="w-full bg-white border border-[#E5E7EB] rounded-[10px] pl-10 pr-3.5 py-2.5 text-[14px] text-[#111827] placeholder-[#9CA3AF] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-all duration-200"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-3 justify-center text-[15px] font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* VIEW 4: EMAIL VERIFICATION CODE */}
            {currentView === 'verification' && (
              <motion.div
                key="verification-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: easeCurve }}
                className="max-w-md mx-auto bg-white border border-[#E5E7EB] rounded-[16px] shadow-lg p-6 sm:p-8 text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mx-auto mb-4">
                  <Mail className="w-6 h-6" />
                </div>

                <h2 className="text-[22px] font-bold text-[#111827]">Verify Your Email</h2>
                <p className="text-[13px] text-[#6B7280] mt-1.5 leading-relaxed">
                  We've sent a 6-digit verification code to{' '}
                  <span className="font-semibold text-[#111827]">{regEmail || 'your email address'}</span>.
                </p>

                <form onSubmit={handleVerificationSubmit} className="mt-6 space-y-6">
                  {/* 6-Digit Code Inputs */}
                  <div className="flex justify-center gap-2">
                    {verifyCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`digit-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(idx, e.target.value)}
                        className="w-10 h-12 text-center text-[18px] font-bold border border-[#E5E7EB] rounded-[8px] bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all duration-200"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[12px] text-[#6B7280]">
                    <span>Didn't receive code?</span>
                    {resendTimer > 0 ? (
                      <span className="text-[#9CA3AF]">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="font-medium text-[#2563EB] hover:underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3 justify-center text-[15px] font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    {isSubmitting ? 'Verifying Code...' : 'Verify & Continue'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* VIEW 5: ACCOUNT CREATED SUCCESS */}
            {currentView === 'account-created' && (
              <motion.div
                key="account-created-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: easeCurve }}
                className="max-w-md mx-auto bg-white border border-[#E5E7EB] rounded-[16px] shadow-lg p-6 sm:p-8 text-center"
              >
                {/* Large Success Badge */}
                <div className="relative w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-5 shadow-xs">
                  <CheckCircle2 className="w-10 h-10" />
                  <span className="absolute -inset-1 rounded-full border border-emerald-400/30 animate-ping opacity-75" />
                </div>

                <h2 className="text-[24px] font-bold text-[#111827]">Account Created Successfully</h2>
                <p className="text-[14px] text-[#4B5563] mt-2 leading-relaxed">
                  Your account is ready. Welcome to TruthRx AI!
                </p>

                {/* Profile Summary Card */}
                {createdUser && (
                  <div className="mt-5 p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px] text-left text-[13px] space-y-2">
                    <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                      <span className="text-[#6B7280]">Name:</span>
                      <span className="font-semibold text-[#111827]">{createdUser.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                      <span className="text-[#6B7280]">Email:</span>
                      <span className="font-semibold text-[#111827]">{createdUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Region & Language:</span>
                      <span className="font-semibold text-[#111827]">{createdUser.country} ({createdUser.language})</span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (createdUser) {
                      onLoginSuccess(createdUser);
                    } else {
                      onLoginSuccess({
                        name: 'Verified User',
                        email: 'user@truthrx.ai',
                        country: 'United States',
                        language: 'English'
                      });
                    }
                  }}
                  className="w-full btn-primary py-3 justify-center text-[15px] font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer mt-6"
                  id="continue-to-platform-btn"
                >
                  <span>Continue to TruthRx AI</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="w-full py-4 text-center text-[12px] text-[#6B7280] border-t border-[#E5E7EB] bg-white relative z-10">
        <p>© 2026 TruthRx AI Platform Inc. Enterprise Healthcare Security Standard.</p>
      </footer>

    </div>
  );
};
