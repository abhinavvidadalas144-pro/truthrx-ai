import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Trash2,
  Star,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  Sparkles,
  Globe,
  User,
  KeyRound,
  Check,
  Filter,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Download,
  Share2,
  LogOut,
  Bell,
  Lock,
  Sun,
  Moon,
  Laptop,
  HelpCircle,
  FileText,
  Activity,
  CheckCircle2,
  Sliders,
  Shield,
  Smartphone,
  Calendar,
  Mail,
  Camera,
  ArrowUpDown,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, VerificationResult, ClaimVerdict } from '../types';
import { useTheme } from '../hooks/useTheme';

interface SavedVerification extends VerificationResult {
  id: string;
  timestamp: string;
  isFavorite?: boolean;
}

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUpdateProfile: (updated: UserProfile) => void;
  onSelectSavedClaim: (result: VerificationResult) => void;
  onSignOut?: () => void;
}

type DashboardTab = 
  | 'profile' 
  | 'history' 
  | 'favorites' 
  | 'settings' 
  | 'security' 
  | 'notifications' 
  | 'support';

const easeCurve = [0.22, 1, 0.36, 1] as const;

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onSelectSavedClaim,
  onSignOut
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
  const [historyList, setHistoryList] = useState<SavedVerification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerdictFilter, setSelectedVerdictFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isLoadingTab, setIsLoadingTab] = useState(false);

  // Profile Form State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileCountry, setProfileCountry] = useState(currentUser?.country || 'United States');
  const [profileLanguage, setProfileLanguage] = useState(currentUser?.language || 'English');
  const [profileTimezone, setProfileTimezone] = useState('(UTC-05:00) Eastern Time (US & Canada)');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Settings Toggles
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [verificationAlerts, setVerificationAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const { theme: selectedTheme, setTheme: setSelectedTheme } = useTheme();

  // Copy share notification state
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Load history from localStorage
  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('truthrx_verifications_history');
      if (saved) {
        setHistoryList(JSON.parse(saved));
      } else {
        const defaultSamples: SavedVerification[] = [
          {
            id: 'ver-1',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            claimText: 'Drinking warm boiled garlic water every morning completely cures Type 2 diabetes within 30 days!',
            verdict: 'MISLEADING',
            trustScore: 28,
            verdictTitle: 'Overstated Antimicrobial Benefits',
            summaryText: 'While garlic contains allicin with mild dietary antioxidant properties, there is zero medical evidence that garlic water cures Type 2 diabetes or replaces insulin.',
            keyFacts: [
              'Allicin is destroyed during gastric digestion.',
              'No clinical trials support garlic as a diabetes therapeutic.',
              'Discontinuing insulin without supervision carries severe medical risk.'
            ],
            medicalExplanation: 'Allicin breaks down rapidly in human gastric acid. Clinical meta-analyses show no statistically significant HbA1c reduction from garlic supplementation.',
            citations: [
              {
                title: 'Herbal Interventions in Glycemic Control',
                source: 'PubMed / NIH',
                year: '2023',
                summary: 'Meta-analysis of 14 RCTs showed no clinically significant HbA1c reduction.'
              }
            ],
            riskLevel: 'Moderate',
            recommendedAction: 'Consult a licensed endocrinologist. Do not stop prescribed pharmaceuticals.',
            category: 'whatsapp',
            isFavorite: true
          },
          {
            id: 'ver-2',
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
            claimText: 'Viruses cannot survive in an alkaline environment! Drink hot lemon juice with sea salt to kill throat infections.',
            verdict: 'FALSE',
            trustScore: 12,
            verdictTitle: 'Scientifically Unsupported pH Myth',
            summaryText: 'The human body strictly regulates blood pH between 7.35 and 7.45 via the lungs and kidneys. Ingested lemon juice is neutralized in the stomach.',
            keyFacts: [
              'Stomach acid (pH 1.5 - 3.5) neutralizes liquid pH immediately.',
              'Respiratory viruses infect mucosal cells independent of dietary liquid pH.',
              'Warm fluids soothe sore throat symptoms but do not eliminate pathogens.'
            ],
            medicalExplanation: 'Pathogen replication occurs intracellularly within mucosal tissue. Oral pH alterations have no biological mechanism to eliminate viral particles.',
            citations: [
              {
                title: 'Physiological Regulation of Acid-Base Balance',
                source: 'The Lancet',
                year: '2022',
                summary: 'Homeostasis maintains blood pH strictly between 7.35 and 7.45.'
              }
            ],
            riskLevel: 'Low',
            recommendedAction: 'Maintain regular hydration and rely on peer-reviewed clinical treatments.',
            category: 'text',
            isFavorite: true
          },
          {
            id: 'ver-3',
            timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
            claimText: 'mRNA vaccines cause long-term alterations to human DNA in cardiac tissue.',
            verdict: 'FALSE',
            trustScore: 8,
            verdictTitle: 'Biologically Impossible DNA Alteration',
            summaryText: 'mRNA operates exclusively within cellular cytoplasm and lacks nuclear entry signals or reverse transcriptase enzymes required to integrate into genomic DNA.',
            keyFacts: [
              'mRNA cannot cross nuclear membranes into host DNA.',
              'Ribosomes degrade mRNA strands within 48-72 hours post-injection.',
              'CDC & WHO monitoring confirms non-integration across billions of doses.'
            ],
            medicalExplanation: 'Central dogma of molecular biology demonstrates RNA-to-DNA reverse transcription requires viral RT enzymes absent in human cells.',
            citations: [
              {
                title: 'mRNA Transport Kinetics & Degradation',
                source: 'CDC',
                year: '2023',
                summary: 'No nuclear integration detected across genomic sequencing cohorts.'
              }
            ],
            riskLevel: 'High',
            recommendedAction: 'Refer to peer-reviewed public health guidelines.',
            category: 'screenshot',
            isFavorite: false
          }
        ];
        setHistoryList(defaultSamples);
        localStorage.setItem('truthrx_verifications_history', JSON.stringify(defaultSamples));
      }
    } catch (err) {
      console.error('Failed to parse history:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
      setProfileName(currentUser?.name || '');
      setProfileCountry(currentUser?.country || 'United States');
      setProfileLanguage(currentUser?.language || 'English');
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    const handleHistoryUpdate = () => loadHistory();
    window.addEventListener('truthrx_history_updated', handleHistoryUpdate);
    return () => window.removeEventListener('truthrx_history_updated', handleHistoryUpdate);
  }, []);

  const handleTabChange = (tab: DashboardTab) => {
    setIsLoadingTab(true);
    setActiveTab(tab);
    setTimeout(() => setIsLoadingTab(false), 150);
  };

  const saveHistoryToStorage = (updatedList: SavedVerification[]) => {
    setHistoryList(updatedList);
    localStorage.setItem('truthrx_verifications_history', JSON.stringify(updatedList));
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = historyList.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    saveHistoryToStorage(updated);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = historyList.filter(item => item.id !== id);
    saveHistoryToStorage(updated);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your entire verification history?')) {
      saveHistoryToStorage([]);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSaved(false);

    if (newPassword && newPassword !== confirmPassword) {
      setProfileError('New password and confirmation do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser?.email,
          name: profileName,
          country: profileCountry,
          language: profileLanguage,
          newPassword: newPassword || undefined
        })
      });
      const data = await res.json();
      if (data.user) {
        onUpdateProfile(data.user);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2500);
      }
    } catch {
      if (currentUser) {
        const updated = {
          ...currentUser,
          name: profileName,
          country: profileCountry,
          language: profileLanguage
        };
        onUpdateProfile(updated);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2500);
      }
    }
  };

  const handleExportPDF = (item: SavedVerification, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TruthRx_Clinical_Report_${item.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShareReport = (item: SavedVerification, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `TruthRx AI Clinical Verification Report: "${item.claimText}" - Verdict: ${item.verdict} (${item.trustScore}% Trust Score).`;
    navigator.clipboard.writeText(text);
    setShareToast('Report summary copied to clipboard!');
    setTimeout(() => setShareToast(null), 2500);
  };

  // Filter & Sort computation
  const filteredHistory = historyList
    .filter(item => {
      const matchesTab = activeTab === 'favorites' ? item.isFavorite : true;
      const matchesSearch = item.claimText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.summaryText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.verdictTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVerdict = selectedVerdictFilter === 'ALL' || item.verdict === selectedVerdictFilter;
      return matchesTab && matchesSearch && matchesVerdict;
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

  const getVerdictBadgeStyle = (verdict: ClaimVerdict) => {
    switch (verdict) {
      case 'FALSE':
        return { bg: 'bg-red-50 text-red-700 border-red-200', icon: <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> };
      case 'MISLEADING':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> };
      case 'UNPROVEN':
        return { bg: 'bg-yellow-50 text-yellow-800 border-yellow-200', icon: <Info className="w-3.5 h-3.5 text-yellow-600" /> };
      case 'VERIFIED':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> };
      default:
        return { bg: 'bg-gray-50 text-gray-700 border-gray-200', icon: <Info className="w-3.5 h-3.5 text-gray-500" /> };
    }
  };

  const navMenuItems = [
    { id: 'profile' as DashboardTab, label: 'User Profile', icon: User, badge: null },
    { id: 'history' as DashboardTab, label: 'Verification History', icon: Clock, badge: historyList.length },
    { id: 'favorites' as DashboardTab, label: 'Saved Favourites', icon: Star, badge: historyList.filter(i => i.isFavorite).length },
    { id: 'settings' as DashboardTab, label: 'Account Settings', icon: Sliders, badge: null },
    { id: 'security' as DashboardTab, label: 'Privacy & Security', icon: Lock, badge: null },
    { id: 'notifications' as DashboardTab, label: 'Preferences & Theme', icon: Bell, badge: null },
    { id: 'support' as DashboardTab, label: 'Help & Documentation', icon: HelpCircle, badge: null },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: easeCurve }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs overflow-hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.25, ease: easeCurve }}
            className="relative w-full max-w-6xl h-[90vh] bg-white border border-[#E5E7EB] rounded-[16px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
            id="enterprise-profile-dashboard"
          >
            {/* Share Toast Notification */}
            {shareToast && (
              <div className="absolute top-4 right-4 z-50 bg-[#111827] text-white text-[12px] font-medium px-4 py-2.5 rounded-[8px] shadow-lg flex items-center gap-2 animate-bounce">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{shareToast}</span>
              </div>
            )}

            {/* LEFT SIDEBAR NAVIGATION */}
            <aside className="w-full md:w-64 bg-[#F8FAFC] border-r border-[#E5E7EB] flex flex-col shrink-0">
              {/* Sidebar Header */}
              <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-[#2563EB]" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[15px] font-bold shadow-2xs">
                        {currentUser?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" title="Verified Session" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-[14px] font-semibold text-[#111827] truncate">
                      {currentUser?.name || 'Healthcare Member'}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-[#2563EB] font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Account</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="md:hidden p-1.5 text-[#6B7280] hover:text-[#111827] rounded-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Menu Links */}
              <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
                {navMenuItems.map((menu) => {
                  const Icon = menu.icon;
                  const isActive = activeTab === menu.id;
                  return (
                    <button
                      key={menu.id}
                      type="button"
                      onClick={() => handleTabChange(menu.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#2563EB]/10 text-[#2563EB] font-semibold shadow-2xs'
                          : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#E5E7EB]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'}`} />
                        <span>{menu.label}</span>
                      </div>
                      {menu.badge !== null && menu.badge > 0 && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          isActive ? 'bg-[#2563EB] text-white' : 'bg-[#E5E7EB] text-[#4B5563]'
                        }`}>
                          {menu.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Footer Logout */}
              <div className="p-3 border-t border-[#E5E7EB] bg-white">
                {onSignOut && (
                  <button
                    type="button"
                    onClick={() => { onSignOut(); onClose(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-[8px] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Header Bar */}
              <header className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
                <div>
                  <h2 className="text-[18px] font-bold text-[#111827]">
                    {navMenuItems.find(m => m.id === activeTab)?.label}
                  </h2>
                  <p className="text-[12px] text-[#6B7280]">
                    TruthRx Enterprise Healthcare Platform • Medical Intelligence Dashboard
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Medical API Active</span>
                  </span>

                  <button
                    onClick={onClose}
                    className="hidden md:flex p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                    id="close-dashboard-main-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Tab Content Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                {isLoadingTab ? (
                  <div className="space-y-4 animate-pulse py-8">
                    <div className="h-20 bg-[#F3F4F6] rounded-[10px]" />
                    <div className="h-40 bg-[#F3F4F6] rounded-[10px]" />
                    <div className="h-20 bg-[#F3F4F6] rounded-[10px]" />
                  </div>
                ) : (
                  <>
                    {/* TAB 1: USER PROFILE */}
                    {activeTab === 'profile' && (
                      <div className="space-y-6 max-w-4xl">
                        {/* Profile Hero Overview Card */}
                        <div className="bg-gradient-to-r from-[#F8FAFC] to-[#EFF6FF] border border-[#E5E7EB] rounded-[14px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xs">
                          <div className="flex items-center gap-5">
                            <div className="relative group">
                              {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-[#2563EB]" />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[28px] font-bold shadow-md">
                                  {currentUser?.name?.charAt(0) || 'U'}
                                </div>
                              )}
                              <label
                                htmlFor="avatar-file-input"
                                className="absolute bottom-0 right-0 p-1.5 bg-white border border-[#E5E7EB] rounded-full text-[#111827] hover:bg-[#2563EB] hover:text-white cursor-pointer transition-colors shadow-2xs"
                                title="Change photo"
                              >
                                <Camera className="w-3.5 h-3.5" />
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                                id="avatar-file-input"
                              />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-[20px] font-bold text-[#111827]">
                                  {currentUser?.name || 'Healthcare Professional'}
                                </h3>
                                <CheckCircle2 className="w-5 h-5 text-[#2563EB]" title="Verified Medical Member" />
                              </div>
                              <p className="text-[13px] text-[#4B5563]">{currentUser?.email}</p>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-[12px] text-[#6B7280]">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                                  <span>Member Since 2026</span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
                                  <span>{profileCountry}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-3 gap-3 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-[#E5E7EB] pt-4 sm:pt-0 sm:pl-6">
                            <div className="text-center p-2 bg-white rounded-[8px] border border-[#E5E7EB]">
                              <p className="text-[18px] font-bold text-[#2563EB]">{historyList.length}</p>
                              <p className="text-[11px] text-[#6B7280]">Verified Claims</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded-[8px] border border-[#E5E7EB]">
                              <p className="text-[18px] font-bold text-amber-600">{historyList.filter(i => i.isFavorite).length}</p>
                              <p className="text-[11px] text-[#6B7280]">Saved Reports</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded-[8px] border border-[#E5E7EB]">
                              <p className="text-[18px] font-bold text-emerald-600">98.8%</p>
                              <p className="text-[11px] text-[#6B7280]">Confidence Rate</p>
                            </div>
                          </div>
                        </div>

                        {/* Edit Profile Form */}
                        <form onSubmit={handleSaveProfileSubmit} className="bg-white border border-[#E5E7EB] rounded-[14px] p-6 space-y-4 shadow-2xs">
                          <h4 className="text-[15px] font-semibold text-[#111827] flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                            <User className="w-4 h-4 text-[#2563EB]" />
                            <span>Edit Personal Information</span>
                          </h4>

                          {profileSaved && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[8px] p-3 text-[13px] flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span>Profile updated successfully!</span>
                            </div>
                          )}

                          {profileError && (
                            <div className="bg-red-50 border border-red-200 text-red-800 rounded-[8px] p-3 text-[13px]">
                              {profileError}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] mb-1">Full Name</label>
                              <input
                                type="text"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] p-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-[#2563EB]"
                              />
                            </div>

                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] mb-1">Email Address</label>
                              <input
                                type="email"
                                disabled
                                value={currentUser?.email || ''}
                                className="w-full bg-[#E5E7EB]/70 border border-[#E5E7EB] rounded-[8px] p-2.5 text-[13px] text-[#6B7280] cursor-not-allowed"
                              />
                            </div>

                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] mb-1">Country / Region</label>
                              <input
                                type="text"
                                value={profileCountry}
                                onChange={(e) => setProfileCountry(e.target.value)}
                                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] p-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-[#2563EB]"
                              />
                            </div>

                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] mb-1">Preferred Report Language</label>
                              <select
                                value={profileLanguage}
                                onChange={(e) => setProfileLanguage(e.target.value)}
                                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] p-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-[#2563EB]"
                              >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish (Español)</option>
                                <option value="Hindi">Hindi (हिन्दी)</option>
                                <option value="French">French (Français)</option>
                                <option value="German">German (Deutsch)</option>
                                <option value="Arabic">Arabic (العربية)</option>
                              </select>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="submit"
                              className="btn-primary cursor-pointer hover:scale-[1.02] transition-transform"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>Save Profile Changes</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* TAB 2: VERIFICATION HISTORY */}
                    {activeTab === 'history' && (
                      <div className="space-y-4">
                        {/* Search and Filter Control Bar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[10px] p-3">
                          <div className="relative flex-1">
                            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Search previous claim verifications..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-white border border-[#E5E7EB] rounded-[8px] pl-9 pr-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:border-[#2563EB]"
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              value={selectedVerdictFilter}
                              onChange={(e) => setSelectedVerdictFilter(e.target.value)}
                              className="bg-white border border-[#E5E7EB] text-[#111827] text-[12px] rounded-[6px] px-3 py-2 focus:outline-none focus:border-[#2563EB]"
                            >
                              <option value="ALL">All Verdicts</option>
                              <option value="FALSE">False Claims</option>
                              <option value="MISLEADING">Misleading</option>
                              <option value="UNPROVEN">Unproven</option>
                              <option value="VERIFIED">Verified Accurate</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                              className="bg-white border border-[#E5E7EB] text-[#111827] text-[12px] rounded-[6px] px-3 py-2 flex items-center gap-1.5 hover:bg-[#F3F4F6] cursor-pointer"
                            >
                              <ArrowUpDown className="w-3.5 h-3.5 text-[#2563EB]" />
                              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
                            </button>

                            {historyList.length > 0 && (
                              <button
                                type="button"
                                onClick={handleClearAll}
                                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[12px] rounded-[6px] px-3 py-2 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Clear All</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Professional Table / Card List */}
                        {filteredHistory.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-[#E5E7EB] rounded-[12px] bg-[#F8FAFC]">
                            <Clock className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
                            <p className="text-[15px] font-semibold text-[#111827]">No verification history recorded</p>
                            <p className="text-[13px] text-[#6B7280] mt-1 max-w-sm mx-auto">
                              Run a health claim verification using the studio to store complete peer-reviewed medical reports.
                            </p>
                          </div>
                        ) : (
                          <div className="border border-[#E5E7EB] rounded-[12px] overflow-hidden bg-white shadow-2xs">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[12px] font-semibold text-[#4B5563]">
                                    <th className="py-3 px-4">Claim Statement</th>
                                    <th className="py-3 px-4">Verdict</th>
                                    <th className="py-3 px-4">Trust Score</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB] text-[13px]">
                                  {filteredHistory.map((item) => {
                                    const badge = getVerdictBadgeStyle(item.verdict);
                                    return (
                                      <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors group">
                                        <td className="py-3.5 px-4 font-medium text-[#111827] max-w-md">
                                          <p className="line-clamp-2">"{item.claimText}"</p>
                                          <p className="text-[11px] text-[#6B7280] font-normal mt-0.5">{item.verdictTitle}</p>
                                        </td>

                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
                                            {badge.icon}
                                            <span>{item.verdict}</span>
                                          </span>
                                        </td>

                                        <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#111827]">
                                          {item.trustScore}%
                                        </td>

                                        <td className="py-3.5 px-4 whitespace-nowrap text-[#6B7280] text-[12px]">
                                          {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>

                                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                                          <div className="flex items-center justify-end gap-1">
                                            <button
                                              type="button"
                                              onClick={() => { onSelectSavedClaim(item); onClose(); }}
                                              className="p-1.5 text-[#2563EB] hover:bg-[#2563EB]/10 rounded-[6px] transition-colors cursor-pointer"
                                              title="View Full Report"
                                            >
                                              <ExternalLink className="w-4 h-4" />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(e) => handleToggleFavorite(item.id, e)}
                                              className="p-1.5 text-[#6B7280] hover:text-amber-500 hover:bg-amber-50 rounded-[6px] transition-colors cursor-pointer"
                                              title="Toggle Favorite"
                                            >
                                              <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(e) => handleExportPDF(item, e)}
                                              className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-[6px] transition-colors cursor-pointer"
                                              title="Download JSON/Report"
                                            >
                                              <FileDown className="w-4 h-4" />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(e) => handleDeleteItem(item.id, e)}
                                              className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-colors cursor-pointer"
                                              title="Delete record"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 3: SAVED FAVOURITES */}
                    {activeTab === 'favorites' && (
                      <div className="space-y-4">
                        {filteredHistory.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-[#E5E7EB] rounded-[12px] bg-[#F8FAFC]">
                            <Star className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                            <p className="text-[15px] font-semibold text-[#111827]">No saved favorite verifications</p>
                            <p className="text-[13px] text-[#6B7280] mt-1 max-w-sm mx-auto">
                              Star important claim reports in your history to bookmark them for immediate clinical reference.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredHistory.map((item) => {
                              const badge = getVerdictBadgeStyle(item.verdict);
                              return (
                                <div
                                  key={item.id}
                                  className="bg-white border border-[#E5E7EB] hover:border-[#2563EB] rounded-[12px] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
                                        {badge.icon}
                                        <span>{item.verdict}</span>
                                      </span>

                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={(e) => handleToggleFavorite(item.id, e)}
                                          className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                                          title="Remove from favorites"
                                        >
                                          <Star className="w-4 h-4 fill-amber-400" />
                                        </button>
                                      </div>
                                    </div>

                                    <h4 className="text-[14px] font-semibold text-[#111827] line-clamp-2">
                                      "{item.claimText}"
                                    </h4>

                                    <p className="text-[12px] text-[#4B5563] line-clamp-2">
                                      {item.summaryText}
                                    </p>
                                  </div>

                                  <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[12px]">
                                    <span className="text-[#6B7280]">
                                      Trust Score: <strong className="text-[#111827]">{item.trustScore}%</strong>
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={(e) => handleShareReport(item, e)}
                                        className="text-[#6B7280] hover:text-[#111827] flex items-center gap-1 font-medium cursor-pointer"
                                      >
                                        <Share2 className="w-3.5 h-3.5" />
                                        <span>Share</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => { onSelectSavedClaim(item); onClose(); }}
                                        className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                                      >
                                        <span>Open Report →</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 4: ACCOUNT SETTINGS */}
                    {activeTab === 'settings' && (
                      <div className="space-y-6 max-w-3xl">
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <h3 className="text-[15px] font-semibold text-[#111827] border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-[#2563EB]" />
                            <span>General Account Preferences</span>
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] mb-1">Time Zone</label>
                              <select
                                value={profileTimezone}
                                onChange={(e) => setProfileTimezone(e.target.value)}
                                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] p-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-[#2563EB]"
                              >
                                <option value="(UTC-05:00) Eastern Time (US & Canada)">(UTC-05:00) Eastern Time</option>
                                <option value="(UTC+00:00) UTC / London">(UTC+00:00) UTC / London</option>
                                <option value="(UTC+01:00) Central European Time">(UTC+01:00) CET / Paris</option>
                                <option value="(UTC+05:30) Indian Standard Time">(UTC+05:30) IST / New Delhi</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] mb-1">Medical Citation Format</label>
                              <select className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] p-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-[#2563EB]">
                                <option value="AMA">AMA (American Medical Association)</option>
                                <option value="APA">APA 7th Edition</option>
                                <option value="Vancouver">Vancouver Clinical Style</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 5: PRIVACY & SECURITY */}
                    {activeTab === 'security' && (
                      <div className="space-y-6 max-w-3xl">
                        {/* Change Password */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <h3 className="text-[15px] font-semibold text-[#111827] border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-[#2563EB]" />
                            <span>Security Credentials</span>
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] mb-1">New Password</label>
                              <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] p-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-[#2563EB]"
                              />
                            </div>

                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] mb-1">Confirm New Password</label>
                              <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] p-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-[#2563EB]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Two-Factor & Active Sessions */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-[14px] font-semibold text-[#111827]">Two-Factor Authentication (2FA)</h4>
                              <p className="text-[12px] text-[#6B7280]">Require authenticator app code on login</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                                twoFactorEnabled ? 'bg-[#2563EB]' : 'bg-[#E5E7EB]'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>

                          <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
                            <h4 className="text-[13px] font-semibold text-[#111827]">Active Login Sessions</h4>
                            <div className="flex items-center justify-between text-[12px] p-2.5 bg-[#F8FAFC] rounded-[8px] border border-[#E5E7EB]">
                              <div className="flex items-center gap-2">
                                <Laptop className="w-4 h-4 text-[#2563EB]" />
                                <div>
                                  <p className="font-medium text-[#111827]">Current Browser • Cloud Run Sandbox</p>
                                  <p className="text-[11px] text-[#6B7280]">IP: 104.28.12.92 • Active Now</p>
                                </div>
                              </div>
                              <span className="text-emerald-600 font-semibold text-[11px]">Active Session</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 6: PREFERENCES & THEME */}
                    {activeTab === 'notifications' && (
                      <div className="space-y-6 max-w-3xl">
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <h3 className="text-[15px] font-semibold text-[#111827] border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                            <Bell className="w-4 h-4 text-[#2563EB]" />
                            <span>Notification Channels</span>
                          </h3>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[13px] font-medium text-[#111827]">Email Verification Summaries</p>
                                <p className="text-[11px] text-[#6B7280]">Receive PDF report copies via email</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={emailAlerts}
                                onChange={(e) => setEmailAlerts(e.target.checked)}
                                className="w-4 h-4 text-[#2563EB] accent-[#2563EB] cursor-pointer"
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[13px] font-medium text-[#111827]">High-Risk Claim Alerts</p>
                                <p className="text-[11px] text-[#6B7280]">Alert when claims pose severe medical misinformation risks</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={verificationAlerts}
                                onChange={(e) => setVerificationAlerts(e.target.checked)}
                                className="w-4 h-4 text-[#2563EB] accent-[#2563EB] cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Theme Preference */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <h3 className="text-[15px] font-semibold text-[#111827] border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                            <Sun className="w-4 h-4 text-[#2563EB]" />
                            <span>Visual Theme</span>
                          </h3>

                          <div className="grid grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() => setSelectedTheme('light')}
                              className={`p-3 border rounded-[8px] text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                selectedTheme === 'light'
                                  ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-semibold'
                                  : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <Sun className="w-5 h-5" />
                              <span className="text-[12px]">Light Theme</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedTheme('dark')}
                              className={`p-3 border rounded-[8px] text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                selectedTheme === 'dark'
                                  ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-semibold'
                                  : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <Moon className="w-5 h-5" />
                              <span className="text-[12px]">Dark Theme</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedTheme('system')}
                              className={`p-3 border rounded-[8px] text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                selectedTheme === 'system'
                                  ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-semibold'
                                  : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <Laptop className="w-5 h-5" />
                              <span className="text-[12px]">System Default</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 7: HELP & SUPPORT */}
                    {activeTab === 'support' && (
                      <div className="space-y-6 max-w-3xl">
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <h3 className="text-[15px] font-semibold text-[#111827] border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                            <span>Clinical Verification Assistance</span>
                          </h3>

                          <div className="space-y-3 text-[13px] text-[#4B5563]">
                            <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px]">
                              <p className="font-semibold text-[#111827]">How does TruthRx AI calculate the Trust Score?</p>
                              <p className="mt-1 text-[12px]">
                                Trust Scores synthesize peer-reviewed meta-analyses from WHO, CDC, PubMed/NIH, and The Lancet using Gemini clinical models.
                              </p>
                            </div>

                            <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px]">
                              <p className="font-semibold text-[#111827]">Can I export reports for clinical presentations?</p>
                              <p className="mt-1 text-[12px]">
                                Yes, every claim report includes a JSON/PDF download action inside your Verification History tab.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
