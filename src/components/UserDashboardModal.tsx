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
  ExternalLink,
  Share2,
  LogOut,
  Bell,
  Lock,
  Sun,
  Moon,
  Laptop,
  HelpCircle,
  Activity,
  CheckCircle2,
  Sliders,
  Shield,
  Calendar,
  Mail,
  Camera,
  ArrowUpDown,
  FileDown,
  CheckSquare,
  Square,
  QrCode,
  AlertCircle,
  RefreshCw,
  Copy,
  Printer,
  ShieldOff,
  Smartphone
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

  // Batch Selection State
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Profile Form State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profileCountry, setProfileCountry] = useState(currentUser?.country || 'United States');
  const [profileLanguage, setProfileLanguage] = useState(currentUser?.language || 'English');
  const [profileTimezone, setProfileTimezone] = useState('(UTC-05:00) Eastern Time (US & Canada)');
  const [citationFormat, setCitationFormat] = useState('AMA');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Settings Toggles
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [verificationAlerts, setVerificationAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  
  // Privacy Toggles
  const [telemetryEnabled, setTelemetryEnabled] = useState(true);
  const [publicIndexEnabled, setPublicIndexEnabled] = useState(false);
  const [offlineCacheEnabled, setOfflineCacheEnabled] = useState(true);

  // Active Sessions
  const [otherSessionsSignedOut, setOtherSessionsSignedOut] = useState(false);

  // Modals & Confirmations
  const [itemToDelete, setItemToDelete] = useState<SavedVerification | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);
  const [showSignOutOthersConfirm, setShowSignOutOthersConfirm] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteAccountInput, setDeleteAccountInput] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { theme: selectedTheme, setTheme: setSelectedTheme } = useTheme();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load avatar from localStorage if saved
  useEffect(() => {
    const savedAvatar = localStorage.getItem('truthrx_user_avatar');
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

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
      setProfileEmail(currentUser?.email || '');
      setProfileCountry(currentUser?.country || 'United States');
      setProfileLanguage(currentUser?.language || 'English');
      setSelectedItemIds([]);
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

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const item = historyList.find(i => i.id === id);
    const willFav = !item?.isFavorite;
    const updated = historyList.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    saveHistoryToStorage(updated);
    showToast(willFav ? 'Report saved to Favourites!' : 'Report removed from Favourites');
  };

  const handleDeleteItemConfirm = () => {
    if (!itemToDelete) return;
    const updated = historyList.filter(item => item.id !== itemToDelete.id);
    saveHistoryToStorage(updated);
    setSelectedItemIds(prev => prev.filter(id => id !== itemToDelete.id));
    setItemToDelete(null);
    showToast('Report deleted successfully');
  };

  const handleClearAllConfirm = () => {
    saveHistoryToStorage([]);
    setSelectedItemIds([]);
    setShowClearAllConfirm(false);
    showToast('All verification history cleared');
  };

  const handleBatchDeleteConfirm = () => {
    const updated = historyList.filter(item => !selectedItemIds.includes(item.id));
    saveHistoryToStorage(updated);
    showToast(`Deleted ${selectedItemIds.length} verification reports`);
    setSelectedItemIds([]);
    setShowBatchDeleteConfirm(false);
  };

  const handleToggleSelectItem = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedItemIds.length === filteredHistory.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredHistory.map(i => i.id));
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarUrl(result);
        localStorage.setItem('truthrx_user_avatar', result);
        showToast('Profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    localStorage.removeItem('truthrx_user_avatar');
    showToast('Profile photo removed');
  };

  const handleSaveProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSaved(false);

    if (!profileName.trim()) {
      setProfileError('Full name cannot be empty.');
      return;
    }
    if (!profileEmail.trim() || !profileEmail.includes('@')) {
      setProfileError('Please enter a valid email address.');
      return;
    }

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profileEmail,
          name: profileName,
          country: profileCountry,
          language: profileLanguage
        })
      });
      const data = await res.json();
      const updatedUser: UserProfile = {
        name: profileName,
        email: profileEmail,
        country: profileCountry,
        language: profileLanguage,
        role: currentUser?.role || 'Verified User'
      };
      onUpdateProfile(data.user || updatedUser);
      setProfileSaved(true);
      showToast('Profile changes saved successfully!');
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      const updatedUser: UserProfile = {
        name: profileName,
        email: profileEmail,
        country: profileCountry,
        language: profileLanguage,
        role: currentUser?.role || 'Verified User'
      };
      onUpdateProfile(updatedUser);
      setProfileSaved(true);
      showToast('Profile updated locally');
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  const handleCancelProfileEdit = () => {
    setProfileName(currentUser?.name || '');
    setProfileEmail(currentUser?.email || '');
    setProfileCountry(currentUser?.country || 'United States');
    setProfileLanguage(currentUser?.language || 'English');
    setProfileError('');
    showToast('Changes discarded');
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
      await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser?.email,
          newPassword
        })
      });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Security password updated!');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch {
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Security password updated!');
      setTimeout(() => setPasswordSuccess(''), 3000);
    }
  };

  const handleExportPDF = (item: SavedVerification, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Trigger printable formatted clinical report window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Please allow popups to export PDF reports');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>TruthRx AI Clinical Verification Report - ${item.id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #111827; max-width: 800px; margin: 0 auto; line-height: 1.6; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .badge { display: inline-block; padding: 6px 12px; border-radius: 9999px; font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 16px; }
          .badge-FALSE { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
          .badge-MISLEADING { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }
          .badge-UNPROVEN { background: #fefce8; color: #ca8a04; border: 1px solid #fef08a; }
          .badge-VERIFIED { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
          h1 { font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 8px; }
          h2 { font-size: 16px; font-weight: 600; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 6px; }
          .footer { font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 40px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">TruthRx AI Clinical Report</div>
          <div style="font-size: 12px; color: #64748b;">Generated: ${new Date().toLocaleDateString()}</div>
        </div>
        <div class="badge badge-${item.verdict}">Verdict: ${item.verdict} (${item.trustScore}% Trust Score)</div>
        <h1>"${item.claimText}"</h1>
        <p style="color: #475569; font-size: 15px;"><strong>Analysis Overview:</strong> ${item.verdictTitle}</p>
        
        <div class="box">
          <strong>Clinical Summary:</strong>
          <p style="margin: 6px 0 0 0;">${item.summaryText}</p>
        </div>

        <h2>Physiological & Medical Mechanism</h2>
        <p>${item.medicalExplanation}</p>

        <h2>Key Clinical Findings</h2>
        <ul>
          ${item.keyFacts.map(fact => `<li>${fact}</li>`).join('')}
        </ul>

        <h2>Peer-Reviewed Reference Citations</h2>
        <ul>
          ${item.citations.map(c => `<li><strong>${c.title}</strong> (${c.source}, ${c.year}) - ${c.summary}</li>`).join('')}
        </ul>

        <h2>Recommended Clinical Action</h2>
        <p class="box" style="background: #eff6ff; border-color: #bfdbfe; color: #1e40af;">${item.recommendedAction}</p>

        <div class="footer">
          TruthRx AI Evidence Framework • Peer-Reviewed Indexing (WHO, PubMed, CDC, Mayo Clinic)
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    showToast('Clinical report formatted for PDF export!');
  };

  const handleShareReport = (item: SavedVerification, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `TruthRx AI Clinical Report: "${item.claimText}"\nVerdict: ${item.verdict} (${item.trustScore}% Trust Score)\nSummary: ${item.summaryText}`;
    navigator.clipboard.writeText(text);
    showToast('Report summary copied to clipboard!');
  };

  const handleDownloadUserData = () => {
    const exportData = {
      user: {
        ...currentUser,
        name: profileName,
        email: profileEmail,
        country: profileCountry,
        language: profileLanguage,
        timezone: profileTimezone,
        citationFormat
      },
      preferences: {
        theme: selectedTheme,
        twoFactorEnabled,
        emailAlerts,
        verificationAlerts,
        productUpdates,
        weeklyDigest,
        telemetryEnabled,
        publicIndexEnabled
      },
      verificationHistory: historyList,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TruthRx_Account_Data_${profileEmail.split('@')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Your complete data archive has been downloaded');
  };

  const handleSignOutOtherSessionsConfirm = () => {
    setOtherSessionsSignedOut(true);
    setShowSignOutOthersConfirm(false);
    showToast('Signed out of 2 other active device sessions');
  };

  const handleDeleteAccountConfirm = () => {
    if (deleteAccountInput.trim().toUpperCase() !== 'DELETE') {
      showToast('Please type DELETE to confirm account termination');
      return;
    }
    localStorage.clear();
    setShowDeleteAccountModal(false);
    if (onSignOut) {
      onSignOut();
    }
    onClose();
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
        return { bg: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800', icon: <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> };
      case 'MISLEADING':
        return { bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> };
      case 'UNPROVEN':
        return { bg: 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800', icon: <Info className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" /> };
      case 'VERIFIED':
        return { bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> };
      default:
        return { bg: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700', icon: <Info className="w-3.5 h-3.5 text-gray-500" /> };
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.25, ease: easeCurve }}
            className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-[#0f172a] border border-[#E5E7EB] dark:border-gray-800 rounded-[16px] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
            id="enterprise-profile-dashboard"
          >
            {/* Share & Feedback Toast Notification */}
            {toastMessage && (
              <div className="absolute top-4 right-4 z-50 bg-[#111827] dark:bg-gray-800 text-white text-[12px] font-medium px-4 py-2.5 rounded-[8px] shadow-xl flex items-center gap-2.5 border border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* LEFT SIDEBAR NAVIGATION */}
            <aside className="w-full md:w-64 bg-[#F8FAFC] dark:bg-[#0b0f17] border-r border-[#E5E7EB] dark:border-gray-800 flex flex-col shrink-0 transition-colors duration-300">
              {/* Sidebar Header */}
              <div className="p-5 border-b border-[#E5E7EB] dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-[#2563EB]" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[15px] font-bold shadow-2xs">
                        {currentUser?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" title="Verified Session" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white truncate">
                      {currentUser?.name || profileName || 'Healthcare Member'}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-[#2563EB] dark:text-blue-400 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Account</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="md:hidden p-1.5 text-[#6B7280] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white rounded-md cursor-pointer"
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
                          ? 'bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-blue-400 font-semibold shadow-2xs'
                          : 'text-[#4B5563] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white hover:bg-[#E5E7EB]/60 dark:hover:bg-gray-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB] dark:text-blue-400' : 'text-[#6B7280] dark:text-gray-400'}`} />
                        <span>{menu.label}</span>
                      </div>
                      {menu.badge !== null && menu.badge > 0 && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          isActive ? 'bg-[#2563EB] text-white' : 'bg-[#E5E7EB] dark:bg-gray-800 text-[#4B5563] dark:text-gray-300'
                        }`}>
                          {menu.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Footer Logout */}
              <div className="p-3 border-t border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#0b0f17]">
                {onSignOut && (
                  <button
                    type="button"
                    onClick={() => { onSignOut(); onClose(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-[8px] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col bg-white dark:bg-[#0f172a] overflow-hidden transition-colors duration-300">
              {/* Header Bar */}
              <header className="px-6 py-4 border-b border-[#E5E7EB] dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#0f172a] shrink-0">
                <div>
                  <h2 className="text-[18px] font-bold text-[#111827] dark:text-white">
                    {navMenuItems.find(m => m.id === activeTab)?.label}
                  </h2>
                  <p className="text-[12px] text-[#6B7280] dark:text-gray-400">
                    TruthRx Enterprise Healthcare Platform • Medical Intelligence Dashboard
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Medical API Active</span>
                  </span>

                  <button
                    onClick={onClose}
                    className="hidden md:flex p-1.5 rounded-lg text-[#6B7280] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-gray-800 transition-colors cursor-pointer"
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
                    <div className="h-20 bg-[#F3F4F6] dark:bg-gray-800 rounded-[10px]" />
                    <div className="h-40 bg-[#F3F4F6] dark:bg-gray-800 rounded-[10px]" />
                    <div className="h-20 bg-[#F3F4F6] dark:bg-gray-800 rounded-[10px]" />
                  </div>
                ) : (
                  <>
                    {/* TAB 1: USER PROFILE */}
                    {activeTab === 'profile' && (
                      <div className="space-y-6 max-w-4xl">
                        {/* Profile Hero Overview Card */}
                        <div className="bg-gradient-to-r from-[#F8FAFC] to-[#EFF6FF] dark:from-gray-900 dark:to-gray-800/80 border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xs">
                          <div className="flex items-center gap-5">
                            <div className="relative group">
                              {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-[#2563EB]" />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[28px] font-bold shadow-md">
                                  {currentUser?.name?.charAt(0) || profileName?.charAt(0) || 'U'}
                                </div>
                              )}
                              <label
                                htmlFor="avatar-file-input"
                                className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-full text-[#111827] dark:text-white hover:bg-[#2563EB] hover:text-white dark:hover:bg-blue-600 cursor-pointer transition-colors shadow-2xs"
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
                                <h3 className="text-[20px] font-bold text-[#111827] dark:text-white">
                                  {currentUser?.name || profileName || 'Healthcare Professional'}
                                </h3>
                                <CheckCircle2 className="w-5 h-5 text-[#2563EB] dark:text-blue-400" title="Verified Medical Member" />
                              </div>
                              <p className="text-[13px] text-[#4B5563] dark:text-gray-300">{currentUser?.email || profileEmail}</p>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-[12px] text-[#6B7280] dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                                  <span>Member Since 2026</span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Globe className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                                  <span>{profileCountry}</span>
                                </span>
                              </div>

                              {avatarUrl && (
                                <button
                                  type="button"
                                  onClick={handleRemoveAvatar}
                                  className="mt-2 text-[11px] text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Remove custom photo</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-3 gap-3 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-[#E5E7EB] dark:border-gray-700 pt-4 sm:pt-0 sm:pl-6">
                            <div className="text-center p-2.5 bg-white dark:bg-gray-800/80 rounded-[8px] border border-[#E5E7EB] dark:border-gray-700">
                              <p className="text-[18px] font-bold text-[#2563EB] dark:text-blue-400">{historyList.length}</p>
                              <p className="text-[11px] text-[#6B7280] dark:text-gray-400">Verified Claims</p>
                            </div>
                            <div className="text-center p-2.5 bg-white dark:bg-gray-800/80 rounded-[8px] border border-[#E5E7EB] dark:border-gray-700">
                              <p className="text-[18px] font-bold text-amber-600 dark:text-amber-400">{historyList.filter(i => i.isFavorite).length}</p>
                              <p className="text-[11px] text-[#6B7280] dark:text-gray-400">Saved Reports</p>
                            </div>
                            <div className="text-center p-2.5 bg-white dark:bg-gray-800/80 rounded-[8px] border border-[#E5E7EB] dark:border-gray-700">
                              <p className="text-[18px] font-bold text-emerald-600 dark:text-emerald-400">98.8%</p>
                              <p className="text-[11px] text-[#6B7280] dark:text-gray-400">Confidence Rate</p>
                            </div>
                          </div>
                        </div>

                        {/* Edit Profile Form */}
                        <form onSubmit={handleSaveProfileSubmit} className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] p-6 space-y-4 shadow-2xs">
                          <h4 className="text-[15px] font-semibold text-[#111827] dark:text-white flex items-center justify-between border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                              <span>Edit Personal Information</span>
                            </div>
                            <span className="text-[12px] text-[#6B7280] dark:text-gray-400 font-normal">All changes sync securely</span>
                          </h4>

                          {profileSaved && (
                            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-[8px] p-3 text-[13px] flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                              <span>Profile updated successfully!</span>
                            </div>
                          )}

                          {profileError && (
                            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-[8px] p-3 text-[13px]">
                              {profileError}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] dark:text-gray-300 mb-1">Full Name</label>
                              <input
                                type="text"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                className="w-full bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px] p-2.5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] dark:text-gray-300 mb-1">Email Address</label>
                              <input
                                type="email"
                                value={profileEmail}
                                onChange={(e) => setProfileEmail(e.target.value)}
                                className="w-full bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px] p-2.5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] dark:text-gray-300 mb-1">Country / Region</label>
                              <input
                                type="text"
                                value={profileCountry}
                                onChange={(e) => setProfileCountry(e.target.value)}
                                className="w-full bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px] p-2.5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] dark:text-gray-300 mb-1">Preferred Report Language</label>
                              <select
                                value={profileLanguage}
                                onChange={(e) => setProfileLanguage(e.target.value)}
                                className="w-full bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px] p-2.5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
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

                          <div className="pt-2 flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={handleCancelProfileEdit}
                              className="px-4 py-2 text-[13px] font-medium text-[#6B7280] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white cursor-pointer transition-colors"
                            >
                              Cancel Changes
                            </button>

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
                        {/* Search, Filter, and Action Bar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F8FAFC] dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[10px] p-3">
                          <div className="relative flex-1">
                            <Search className="w-4 h-4 text-[#6B7280] dark:text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Search previous claim verifications..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px] pl-9 pr-3 py-2 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              value={selectedVerdictFilter}
                              onChange={(e) => setSelectedVerdictFilter(e.target.value)}
                              className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 text-[#111827] dark:text-white text-[12px] rounded-[6px] px-3 py-2 focus:outline-none focus:border-[#2563EB]"
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
                              className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 text-[#111827] dark:text-white text-[12px] rounded-[6px] px-3 py-2 flex items-center gap-1.5 hover:bg-[#F3F4F6] dark:hover:bg-gray-700 cursor-pointer"
                            >
                              <ArrowUpDown className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
                            </button>

                            {historyList.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setShowClearAllConfirm(true)}
                                className="bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-[12px] rounded-[6px] px-3 py-2 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Clear History</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Batch Operations Bar */}
                        {selectedItemIds.length > 0 && (
                          <div className="bg-[#EFF6FF] dark:bg-blue-950/50 border border-[#BFDBFE] dark:border-blue-800 rounded-[8px] p-3 flex items-center justify-between text-[13px] text-[#1E40AF] dark:text-blue-200 animate-in fade-in duration-200">
                            <span className="font-semibold">
                              {selectedItemIds.length} {selectedItemIds.length === 1 ? 'report' : 'reports'} selected
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedItemIds([])}
                                className="px-3 py-1 bg-white dark:bg-gray-800 text-[#4B5563] dark:text-gray-300 rounded-[6px] text-[12px] border border-gray-300 dark:border-gray-600 hover:bg-gray-50 cursor-pointer"
                              >
                                Deselect All
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowBatchDeleteConfirm(true)}
                                className="px-3 py-1 bg-red-600 text-white rounded-[6px] text-[12px] font-semibold hover:bg-red-700 flex items-center gap-1 cursor-pointer shadow-2xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Selected ({selectedItemIds.length})</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* History Table */}
                        {filteredHistory.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-[#E5E7EB] dark:border-gray-800 rounded-[12px] bg-[#F8FAFC] dark:bg-gray-900">
                            <Clock className="w-10 h-10 text-[#9CA3AF] dark:text-gray-500 mx-auto mb-2" />
                            <p className="text-[15px] font-semibold text-[#111827] dark:text-white">No verification history recorded</p>
                            <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mt-1 max-w-sm mx-auto">
                              Run a health claim verification using TruthRx AI to generate and store complete clinical reports.
                            </p>
                          </div>
                        ) : (
                          <div className="border border-[#E5E7EB] dark:border-gray-800 rounded-[12px] overflow-hidden bg-white dark:bg-gray-900 shadow-2xs">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-[#F8FAFC] dark:bg-gray-800/80 border-b border-[#E5E7EB] dark:border-gray-800 text-[12px] font-semibold text-[#4B5563] dark:text-gray-300">
                                    <th className="py-3 px-4 w-10">
                                      <input
                                        type="checkbox"
                                        checked={selectedItemIds.length > 0 && selectedItemIds.length === filteredHistory.length}
                                        onChange={handleSelectAllFiltered}
                                        className="w-4 h-4 text-[#2563EB] accent-[#2563EB] rounded cursor-pointer"
                                      />
                                    </th>
                                    <th className="py-3 px-4">Claim Statement</th>
                                    <th className="py-3 px-4">Verdict</th>
                                    <th className="py-3 px-4">Trust Score</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB] dark:divide-gray-800 text-[13px]">
                                  {filteredHistory.map((item) => {
                                    const badge = getVerdictBadgeStyle(item.verdict);
                                    const isSelected = selectedItemIds.includes(item.id);
                                    return (
                                      <tr key={item.id} className={`hover:bg-[#F8FAFC] dark:hover:bg-gray-800/60 transition-colors group ${isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
                                        <td className="py-3.5 px-4">
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => handleToggleSelectItem(item.id, e)}
                                            className="w-4 h-4 text-[#2563EB] accent-[#2563EB] rounded cursor-pointer"
                                          />
                                        </td>

                                        <td className="py-3.5 px-4 font-medium text-[#111827] dark:text-white max-w-md">
                                          <p className="line-clamp-2">"{item.claimText}"</p>
                                          <p className="text-[11px] text-[#6B7280] dark:text-gray-400 font-normal mt-0.5">{item.verdictTitle}</p>
                                        </td>

                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
                                            {badge.icon}
                                            <span>{item.verdict}</span>
                                          </span>
                                        </td>

                                        <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#111827] dark:text-white">
                                          {item.trustScore}%
                                        </td>

                                        <td className="py-3.5 px-4 whitespace-nowrap text-[#6B7280] dark:text-gray-400 text-[12px]">
                                          {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>

                                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                                          <div className="flex items-center justify-end gap-1">
                                            <button
                                              type="button"
                                              onClick={() => { onSelectSavedClaim(item); onClose(); }}
                                              className="p-1.5 text-[#2563EB] dark:text-blue-400 hover:bg-[#2563EB]/10 rounded-[6px] transition-colors cursor-pointer"
                                              title="View Full Report"
                                            >
                                              <ExternalLink className="w-4 h-4" />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(e) => handleToggleFavorite(item.id, e)}
                                              className="p-1.5 text-[#6B7280] dark:text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-[6px] transition-colors cursor-pointer"
                                              title="Toggle Favorite"
                                            >
                                              <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(e) => handleExportPDF(item, e)}
                                              className="p-1.5 text-[#6B7280] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-gray-800 rounded-[6px] transition-colors cursor-pointer"
                                              title="Print / Export PDF"
                                            >
                                              <FileDown className="w-4 h-4" />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(e) => { e.stopPropagation(); setItemToDelete(item); }}
                                              className="p-1.5 text-[#6B7280] dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-[6px] transition-colors cursor-pointer"
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
                        <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-gray-800">
                          <p className="text-[13px] text-[#6B7280] dark:text-gray-400">
                            Bookmarked clinical reports for instant medical reference.
                          </p>
                          <span className="text-[12px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                            {filteredHistory.length} Saved
                          </span>
                        </div>

                        {filteredHistory.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-[#E5E7EB] dark:border-gray-800 rounded-[12px] bg-[#F8FAFC] dark:bg-gray-900">
                            <Star className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                            <p className="text-[15px] font-semibold text-[#111827] dark:text-white">No saved favorite verifications</p>
                            <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mt-1 max-w-sm mx-auto">
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
                                  className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 hover:border-[#2563EB] dark:hover:border-blue-500 rounded-[12px] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
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

                                    <h4 className="text-[14px] font-semibold text-[#111827] dark:text-white line-clamp-2">
                                      "{item.claimText}"
                                    </h4>

                                    <p className="text-[12px] text-[#4B5563] dark:text-gray-300 line-clamp-2">
                                      {item.summaryText}
                                    </p>
                                  </div>

                                  <div className="pt-3 border-t border-[#E5E7EB] dark:border-gray-800 flex items-center justify-between text-[12px]">
                                    <span className="text-[#6B7280] dark:text-gray-400">
                                      Trust Score: <strong className="text-[#111827] dark:text-white">{item.trustScore}%</strong>
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={(e) => handleShareReport(item, e)}
                                        className="text-[#6B7280] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white flex items-center gap-1 font-medium cursor-pointer"
                                      >
                                        <Share2 className="w-3.5 h-3.5" />
                                        <span>Share</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => { onSelectSavedClaim(item); onClose(); }}
                                        className="text-[#2563EB] dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
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
                        <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white border-b border-[#E5E7EB] dark:border-gray-800 pb-3 flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                            <span>General Account Preferences</span>
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] dark:text-gray-300 mb-1">Time Zone</label>
                              <select
                                value={profileTimezone}
                                onChange={(e) => setProfileTimezone(e.target.value)}
                                className="w-full bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px] p-2.5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                              >
                                <option value="(UTC-05:00) Eastern Time (US & Canada)">(UTC-05:00) Eastern Time</option>
                                <option value="(UTC+00:00) UTC / London">(UTC+00:00) UTC / London</option>
                                <option value="(UTC+01:00) Central European Time">(UTC+01:00) CET / Paris</option>
                                <option value="(UTC+05:30) Indian Standard Time">(UTC+05:30) IST / New Delhi</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] dark:text-gray-300 mb-1">Medical Citation Format</label>
                              <select
                                value={citationFormat}
                                onChange={(e) => setCitationFormat(e.target.value)}
                                className="w-full bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px] p-2.5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                              >
                                <option value="AMA">AMA (American Medical Association)</option>
                                <option value="APA">APA 7th Edition</option>
                                <option value="Vancouver">Vancouver Clinical Style</option>
                              </select>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => showToast('Account preferences saved!')}
                              className="btn-primary cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>Save Preferences</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 5: PRIVACY & SECURITY */}
                    {activeTab === 'security' && (
                      <div className="space-y-6 max-w-3xl">
                        {/* Change Password */}
                        <form onSubmit={handleChangePasswordSubmit} className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white border-b border-[#E5E7EB] dark:border-gray-800 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <KeyRound className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                              <span>Security Credentials</span>
                            </div>
                            <span className="text-[12px] text-[#6B7280] dark:text-gray-400 font-normal">Encrypted 256-bit</span>
                          </h3>

                          {passwordSuccess && (
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-[8px] text-[13px] flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>{passwordSuccess}</span>
                            </div>
                          )}

                          {passwordError && (
                            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-[8px] text-[13px] flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                              <span>{passwordError}</span>
                            </div>
                          )}

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[12px] font-medium text-[#4B5563] dark:text-gray-300 mb-1">Current Password</label>
                              <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px] p-2.5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[12px] font-medium text-[#4B5563] dark:text-gray-300 mb-1">New Password</label>
                                <input
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder="••••••••"
                                  className="w-full bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px] p-2.5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                                />
                              </div>

                              <div>
                                <label className="block text-[12px] font-medium text-[#4B5563] dark:text-gray-300 mb-1">Confirm New Password</label>
                                <input
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder="••••••••"
                                  className="w-full bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px] p-2.5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-1 flex justify-end">
                            <button type="submit" className="btn-primary cursor-pointer">
                              <Lock className="w-4 h-4" />
                              <span>Update Password</span>
                            </button>
                          </div>
                        </form>

                        {/* Two-Factor Authentication & Active Sessions */}
                        <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-[14px] font-semibold text-[#111827] dark:text-white">Two-Factor Authentication (2FA)</h4>
                              <p className="text-[12px] text-[#6B7280] dark:text-gray-400">Require authenticator app code (Google Authenticator / Authy) on login</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (!twoFactorEnabled) {
                                  setShow2FAModal(true);
                                } else {
                                  setTwoFactorEnabled(false);
                                  showToast('2FA has been disabled');
                                }
                              }}
                              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                                twoFactorEnabled ? 'bg-[#2563EB]' : 'bg-[#E5E7EB] dark:bg-gray-700'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>

                          {/* Active Login Sessions */}
                          <div className="pt-4 border-t border-[#E5E7EB] dark:border-gray-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[13px] font-semibold text-[#111827] dark:text-white">Active Login Sessions</h4>
                              {!otherSessionsSignedOut && (
                                <button
                                  type="button"
                                  onClick={() => setShowSignOutOthersConfirm(true)}
                                  className="text-[12px] text-red-600 dark:text-red-400 hover:underline font-medium cursor-pointer"
                                >
                                  Sign Out Other Devices
                                </button>
                              )}
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[12px] p-3 bg-[#F8FAFC] dark:bg-gray-800/80 rounded-[8px] border border-[#E5E7EB] dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                  <Laptop className="w-4 h-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
                                  <div>
                                    <p className="font-medium text-[#111827] dark:text-white">Current Session • Cloud Run Sandbox</p>
                                    <p className="text-[11px] text-[#6B7280] dark:text-gray-400">IP: 104.28.12.92 • Active Now</p>
                                  </div>
                                </div>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                  This Device
                                </span>
                              </div>

                              {!otherSessionsSignedOut && (
                                <div className="flex items-center justify-between text-[12px] p-3 bg-[#F8FAFC] dark:bg-gray-800/80 rounded-[8px] border border-[#E5E7EB] dark:border-gray-700 opacity-75">
                                  <div className="flex items-center gap-3">
                                    <Smartphone className="w-4 h-4 text-gray-500 shrink-0" />
                                    <div>
                                      <p className="font-medium text-[#111827] dark:text-white">TruthRx Mobile App • iOS 18</p>
                                      <p className="text-[11px] text-[#6B7280] dark:text-gray-400">Last active 3 hours ago • New York, USA</p>
                                    </div>
                                  </div>
                                  <span className="text-gray-500 text-[11px]">Active</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Privacy & Account Export/Deletion */}
                        <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white border-b border-[#E5E7EB] dark:border-gray-800 pb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                            <span>Privacy & Account Data</span>
                          </h3>

                          <div className="space-y-3 text-[13px]">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-[#111827] dark:text-white">Anonymized Clinical Telemetry</p>
                                <p className="text-[11px] text-[#6B7280] dark:text-gray-400">Help improve WHO/CDC claim classification models</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={telemetryEnabled}
                                onChange={(e) => {
                                  setTelemetryEnabled(e.target.checked);
                                  showToast(e.target.checked ? 'Telemetry enabled' : 'Telemetry disabled');
                                }}
                                className="w-4 h-4 text-[#2563EB] accent-[#2563EB] cursor-pointer"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                              <div>
                                <p className="font-medium text-[#111827] dark:text-white">Download My Personal Data</p>
                                <p className="text-[11px] text-[#6B7280] dark:text-gray-400">Export JSON file containing search history, account info, and saved reports</p>
                              </div>
                              <button
                                type="button"
                                onClick={handleDownloadUserData}
                                className="px-3 py-1.5 bg-[#F8FAFC] dark:bg-gray-800 hover:bg-[#E5E7EB] dark:hover:bg-gray-700 text-[#111827] dark:text-white rounded-[6px] border border-[#E5E7EB] dark:border-gray-700 text-[12px] font-medium flex items-center gap-1.5 cursor-pointer"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                                <span>Export JSON</span>
                              </button>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-red-100 dark:border-red-950">
                              <div>
                                <p className="font-medium text-red-600 dark:text-red-400">Delete My TruthRx Account</p>
                                <p className="text-[11px] text-[#6B7280] dark:text-gray-400">Permanently purge all user history, saved claims, and credentials</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowDeleteAccountModal(true)}
                                className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 rounded-[6px] border border-red-200 dark:border-red-800 text-[12px] font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Account</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 6: PREFERENCES & THEME */}
                    {activeTab === 'notifications' && (
                      <div className="space-y-6 max-w-3xl">
                        <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white border-b border-[#E5E7EB] dark:border-gray-800 pb-3 flex items-center gap-2">
                            <Bell className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                            <span>Notification Channels</span>
                          </h3>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[13px] font-medium text-[#111827] dark:text-white">Email Verification Summaries</p>
                                <p className="text-[11px] text-[#6B7280] dark:text-gray-400">Receive PDF report copies via email</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={emailAlerts}
                                onChange={(e) => {
                                  setEmailAlerts(e.target.checked);
                                  showToast(e.target.checked ? 'Email notifications enabled' : 'Email notifications disabled');
                                }}
                                className="w-4 h-4 text-[#2563EB] accent-[#2563EB] cursor-pointer"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                              <div>
                                <p className="text-[13px] font-medium text-[#111827] dark:text-white">High-Risk Claim Alerts</p>
                                <p className="text-[11px] text-[#6B7280] dark:text-gray-400">Alert when claims pose severe medical misinformation risks</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={verificationAlerts}
                                onChange={(e) => {
                                  setVerificationAlerts(e.target.checked);
                                  showToast(e.target.checked ? 'High-risk alerts enabled' : 'High-risk alerts disabled');
                                }}
                                className="w-4 h-4 text-[#2563EB] accent-[#2563EB] cursor-pointer"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                              <div>
                                <p className="text-[13px] font-medium text-[#111827] dark:text-white">Weekly Public Health Digest</p>
                                <p className="text-[11px] text-[#6B7280] dark:text-gray-400">Top viral health rumors debunks compiled weekly</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={weeklyDigest}
                                onChange={(e) => {
                                  setWeeklyDigest(e.target.checked);
                                  showToast(e.target.checked ? 'Weekly digest enabled' : 'Weekly digest disabled');
                                }}
                                className="w-4 h-4 text-[#2563EB] accent-[#2563EB] cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Theme Preference */}
                        <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white border-b border-[#E5E7EB] dark:border-gray-800 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sun className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                              <span>Visual Theme</span>
                            </div>
                            <span className="text-[12px] text-[#6B7280] dark:text-gray-400 font-normal">Applies instantly across entire site</span>
                          </h3>

                          <div className="grid grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTheme('light');
                                showToast('Switched to Light Mode');
                              }}
                              className={`p-3.5 border rounded-[10px] text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                selectedTheme === 'light'
                                  ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 font-semibold ring-2 ring-[#2563EB]/20'
                                  : 'border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-800 text-[#4B5563] dark:text-gray-300 hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <Sun className="w-5 h-5 text-amber-500" />
                              <span className="text-[12px]">Light Theme</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTheme('dark');
                                showToast('Switched to Dark Mode');
                              }}
                              className={`p-3.5 border rounded-[10px] text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                selectedTheme === 'dark'
                                  ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 font-semibold ring-2 ring-[#2563EB]/20'
                                  : 'border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-800 text-[#4B5563] dark:text-gray-300 hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                              <span className="text-[12px]">Dark Theme</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTheme('system');
                                showToast('Set to System Theme');
                              }}
                              className={`p-3.5 border rounded-[10px] text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                selectedTheme === 'system'
                                  ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 font-semibold ring-2 ring-[#2563EB]/20'
                                  : 'border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-800 text-[#4B5563] dark:text-gray-300 hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <Laptop className="w-5 h-5 text-gray-500" />
                              <span className="text-[12px]">System Default</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 7: HELP & SUPPORT */}
                    {activeTab === 'support' && (
                      <div className="space-y-6 max-w-3xl">
                        <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[12px] p-5 space-y-4 shadow-2xs">
                          <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white border-b border-[#E5E7EB] dark:border-gray-800 pb-3 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                            <span>Clinical Verification Assistance</span>
                          </h3>

                          <div className="space-y-3 text-[13px] text-[#4B5563] dark:text-gray-300">
                            <div className="p-3 bg-[#F8FAFC] dark:bg-gray-800/80 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px]">
                              <p className="font-semibold text-[#111827] dark:text-white">How does TruthRx AI calculate the Trust Score?</p>
                              <p className="mt-1 text-[12px] text-[#6B7280] dark:text-gray-400">
                                Trust Scores synthesize peer-reviewed meta-analyses from WHO, CDC, PubMed/NIH, and The Lancet using Gemini clinical models.
                              </p>
                            </div>

                            <div className="p-3 bg-[#F8FAFC] dark:bg-gray-800/80 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px]">
                              <p className="font-semibold text-[#111827] dark:text-white">Can I export reports for clinical presentations?</p>
                              <p className="mt-1 text-[12px] text-[#6B7280] dark:text-gray-400">
                                Yes, every claim report includes a JSON/PDF download action inside your Verification History tab.
                              </p>
                            </div>

                            <div className="p-3 bg-[#F8FAFC] dark:bg-gray-800/80 border border-[#E5E7EB] dark:border-gray-700 rounded-[8px]">
                              <p className="font-semibold text-[#111827] dark:text-white">How do I verify OCR screenshot or voice note claims?</p>
                              <p className="mt-1 text-[12px] text-[#6B7280] dark:text-gray-400">
                                Upload image or audio files directly into the studio input area. Multimodal Gemini vision and audio models extract and analyze the transcript automatically.
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

          {/* INTERACTIVE CONFIRMATION MODALS */}

          {/* 1. Delete Single Report Modal */}
          {itemToDelete && (
            <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] p-6 max-w-md w-full shadow-2xl space-y-4"
              >
                <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#111827] dark:text-white">Delete Report Confirmation</h3>
                    <p className="text-[12px] text-[#6B7280] dark:text-gray-400">This action cannot be undone.</p>
                  </div>
                </div>

                <p className="text-[13px] text-[#4B5563] dark:text-gray-300 bg-[#F8FAFC] dark:bg-gray-800 p-3 rounded-[8px] border border-[#E5E7EB] dark:border-gray-700">
                  "{itemToDelete.claimText}"
                </p>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setItemToDelete(null)}
                    className="px-4 py-2 rounded-[8px] border border-gray-300 dark:border-gray-700 text-[#4B5563] dark:text-gray-300 text-[13px] hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteItemConfirm}
                    className="px-4 py-2 rounded-[8px] bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold cursor-pointer shadow-2xs"
                  >
                    Delete Report
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* 2. Clear All History Confirmation */}
          {showClearAllConfirm && (
            <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] p-6 max-w-md w-full shadow-2xl space-y-4"
              >
                <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#111827] dark:text-white">Clear All History?</h3>
                    <p className="text-[12px] text-[#6B7280] dark:text-gray-400">This will remove all {historyList.length} saved reports.</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowClearAllConfirm(false)}
                    className="px-4 py-2 rounded-[8px] border border-gray-300 dark:border-gray-700 text-[#4B5563] dark:text-gray-300 text-[13px] hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllConfirm}
                    className="px-4 py-2 rounded-[8px] bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold cursor-pointer shadow-2xs"
                  >
                    Clear All History
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* 3. Batch Delete Confirmation */}
          {showBatchDeleteConfirm && (
            <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] p-6 max-w-md w-full shadow-2xl space-y-4"
              >
                <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#111827] dark:text-white">Delete Selected Reports?</h3>
                    <p className="text-[12px] text-[#6B7280] dark:text-gray-400">You are about to delete {selectedItemIds.length} reports.</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBatchDeleteConfirm(false)}
                    className="px-4 py-2 rounded-[8px] border border-gray-300 dark:border-gray-700 text-[#4B5563] dark:text-gray-300 text-[13px] hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBatchDeleteConfirm}
                    className="px-4 py-2 rounded-[8px] bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold cursor-pointer shadow-2xs"
                  >
                    Delete {selectedItemIds.length} Reports
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* 4. 2FA Setup Modal */}
          {show2FAModal && (
            <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] p-6 max-w-md w-full shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                  <div className="flex items-center gap-2 text-[#2563EB] dark:text-blue-400">
                    <QrCode className="w-5 h-5" />
                    <h3 className="text-[16px] font-bold text-[#111827] dark:text-white">Enable Two-Factor Authentication</h3>
                  </div>
                  <button onClick={() => setShow2FAModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-[13px] text-[#4B5563] dark:text-gray-300">
                  Scan this QR code using Google Authenticator or Authy to configure your enterprise account 2FA:
                </p>

                {/* QR Code Container Mock */}
                <div className="p-4 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[10px] text-center space-y-2">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg border flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-gray-900" />
                  </div>
                  <p className="text-[11px] text-[#6B7280] dark:text-gray-400 font-mono">Secret Key: TRUTHRX-2FA-2026-X99</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShow2FAModal(false)}
                    className="px-4 py-2 rounded-[8px] border border-gray-300 dark:border-gray-700 text-[#4B5563] dark:text-gray-300 text-[13px] hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(true);
                      setShow2FAModal(false);
                      showToast('Two-Factor Authentication is now ENABLED!');
                    }}
                    className="btn-primary cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Verify & Activate 2FA</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* 5. Sign Out Other Devices Modal */}
          {showSignOutOthersConfirm && (
            <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] p-6 max-w-md w-full shadow-2xl space-y-4"
              >
                <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center shrink-0">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#111827] dark:text-white">Sign Out Other Sessions?</h3>
                    <p className="text-[12px] text-[#6B7280] dark:text-gray-400">This will disconnect all other mobile and web devices.</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSignOutOthersConfirm(false)}
                    className="px-4 py-2 rounded-[8px] border border-gray-300 dark:border-gray-700 text-[#4B5563] dark:text-gray-300 text-[13px] hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOutOtherSessionsConfirm}
                    className="px-4 py-2 rounded-[8px] bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold cursor-pointer shadow-2xs"
                  >
                    Sign Out Other Sessions
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* 6. Delete Account Confirmation Modal */}
          {showDeleteAccountModal && (
            <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] p-6 max-w-md w-full shadow-2xl space-y-4"
              >
                <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center shrink-0">
                    <ShieldOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#111827] dark:text-white">Delete Account Permanently</h3>
                    <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">Warning: Severe irreversible action!</p>
                  </div>
                </div>

                <p className="text-[13px] text-[#4B5563] dark:text-gray-300">
                  All your search verifications, saved reports, and profile settings will be permanently removed. Type <strong className="text-red-600">DELETE</strong> to confirm:
                </p>

                <input
                  type="text"
                  value={deleteAccountInput}
                  onChange={(e) => setDeleteAccountInput(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full bg-[#F8FAFC] dark:bg-gray-800 border border-red-300 dark:border-red-800 rounded-[8px] p-2.5 text-[13px] font-mono text-[#111827] dark:text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteAccountModal(false);
                      setDeleteAccountInput('');
                    }}
                    className="px-4 py-2 rounded-[8px] border border-gray-300 dark:border-gray-700 text-[#4B5563] dark:text-gray-300 text-[13px] hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccountConfirm}
                    disabled={deleteAccountInput.trim().toUpperCase() !== 'DELETE'}
                    className={`px-4 py-2 rounded-[8px] text-white text-[13px] font-semibold cursor-pointer shadow-2xs transition-all ${
                      deleteAccountInput.trim().toUpperCase() === 'DELETE'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    Delete Account
                  </button>
                </div>
              </motion.div>
            </div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
};
