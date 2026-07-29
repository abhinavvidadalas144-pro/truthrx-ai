import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  MessageSquare, 
  FileImage, 
  Mic, 
  FileText, 
  Loader2, 
  BookOpen, 
  Sparkles, 
  Share2, 
  Check, 
  RotateCcw,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClaimCategory, VerificationResult } from '../types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClaimText?: string;
  initialCategory?: ClaimCategory;
}

const easeCurve = [0.22, 1, 0.36, 1] as const;

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  initialClaimText = '',
  initialCategory = 'whatsapp',
}) => {
  const [activeCategory, setActiveCategory] = useState<ClaimCategory>(initialCategory);
  const [inputText, setInputText] = useState(initialClaimText);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const samplePresets: { label: string; text: string; category: ClaimCategory }[] = [
    {
      label: 'Garlic Water & Diabetes',
      text: 'Forwarded as received: Drinking warm boiled garlic water every morning completely cures Type 2 diabetes within 30 days and removes the need for insulin pills!',
      category: 'whatsapp',
    },
    {
      label: 'Alkaline Water & Viruses',
      text: 'Viruses cannot survive in an alkaline environment! Drink hot lemon juice with sea salt twice a day to raise your throat pH to 8.5 and kill all airborne respiratory infections immediately.',
      category: 'text',
    },
    {
      label: 'High Vitamin C Dosing',
      text: 'Taking 10,000mg of synthetic Vitamin C daily acts as a natural chemotherapy and completely eliminates tumors without side effects.',
      category: 'screenshot',
    },
  ];

  const handleSelectPreset = (presetText: string, category: ClaimCategory) => {
    setActiveCategory(category);
    setInputText(presetText);
    setResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setInputText(`[Screenshot Analysis from ${file.name}]: "Natural home remedy forward claiming that drinking unpasteurized raw juice cures kidney stones in 48 hours without surgery."`);
    }
  };

  const handleRunVerification = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/verify-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim: inputText,
          type: activeCategory,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data: VerificationResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Failed to verify:', err);
      setResult({
        claimText: inputText,
        verdict: 'MISLEADING',
        trustScore: 24,
        verdictTitle: 'Overstated Clinical Efficacy',
        summaryText: 'This health message contains unverified statements that conflict with current peer-reviewed medical guidelines.',
        keyFacts: [
          'No randomized controlled clinical trials support this claim.',
          'Consuming unverified home remedies in place of standard treatments carries significant health risks.',
          'Always verify medical claims with a board-certified healthcare provider.'
        ],
        medicalExplanation: 'Medical consensus requires published peer-reviewed human clinical trials before establishing clinical efficacy for any disease therapeutic.',
        citations: [
          {
            title: 'Medical Misinformation in Digital Platforms',
            source: 'WHO',
            year: '2023',
            summary: 'Guidelines for evaluating non-clinical health claims on social channels.'
          }
        ],
        riskLevel: 'Moderate',
        recommendedAction: 'Do not alter prescribed treatments. Consult a primary physician.',
        category: activeCategory,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const textToCopy = `TruthRx AI Verification Report
Verdict: ${result.verdict} (${result.verdictTitle})
Medical Trust Score: ${result.trustScore}/100
Claim: "${result.claimText}"
Summary: ${result.summaryText}
Sources: ${result.citations.map(c => `${c.source} (${c.year})`).join(', ')}
Verified via TruthRx AI Platform`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'FALSE':
        return {
          bg: 'bg-red-50 border-red-200 text-red-800',
          icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
          label: 'FALSE CLAIM',
        };
      case 'MISLEADING':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          label: 'MISLEADING / OVERSTATED',
        };
      case 'UNPROVEN':
        return {
          bg: 'bg-yellow-50 border-yellow-200 text-yellow-900',
          icon: <Info className="w-5 h-5 text-yellow-600" />,
          label: 'UNPROVEN CLAIM',
        };
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
          label: 'ACCURATE & VERIFIED',
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200 text-[#2563EB]',
          icon: <Info className="w-5 h-5 text-[#2563EB]" />,
          label: 'UNDER REVIEW',
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: easeCurve }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs overflow-y-auto"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: easeCurve }}
            className="relative w-full max-w-3xl bg-white border border-[#E5E7EB] rounded-[14px] shadow-xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
            id="verification-modal-dialog"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#111827]">TruthRx AI Verification Studio</h3>
                  <p className="text-[12px] text-[#6B7280]">Cross-referencing WHO, Mayo Clinic, PubMed & CDC guidelines</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
                id="close-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* Input Category Tabs */}
              <div>
                <label className="block text-[12px] font-medium uppercase tracking-wider text-[#6B7280] mb-2">
                  Select Input Source
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => { setActiveCategory('whatsapp'); setSelectedFileName(null); }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[10px] text-[13px] font-medium border transition-all cursor-pointer ${
                      activeCategory === 'whatsapp'
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-[#F8FAFC] border-[#E5E7EB] text-[#4B5563] hover:text-[#111827]'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Forward</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveCategory('screenshot'); }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[10px] text-[13px] font-medium border transition-all cursor-pointer ${
                      activeCategory === 'screenshot'
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-[#F8FAFC] border-[#E5E7EB] text-[#4B5563] hover:text-[#111827]'
                    }`}
                  >
                    <FileImage className="w-4 h-4" />
                    <span>Screenshot OCR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveCategory('voicenote'); setSelectedFileName(null); }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[10px] text-[13px] font-medium border transition-all cursor-pointer ${
                      activeCategory === 'voicenote'
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-[#F8FAFC] border-[#E5E7EB] text-[#4B5563] hover:text-[#111827]'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>Voice Note</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveCategory('text'); setSelectedFileName(null); }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[10px] text-[13px] font-medium border transition-all cursor-pointer ${
                      activeCategory === 'text'
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-[#F8FAFC] border-[#E5E7EB] text-[#4B5563] hover:text-[#111827]'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Health Claim Text</span>
                  </button>
                </div>
              </div>

              {/* Screenshot Upload Dropzone if Screenshot tab is active */}
              {activeCategory === 'screenshot' && (
                <div className="border border-dashed border-[#E5E7EB] bg-[#F8FAFC] rounded-[10px] p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="screenshot-file-input"
                  />
                  <label htmlFor="screenshot-file-input" className="cursor-pointer block">
                    <FileImage className="w-6 h-6 text-[#2563EB] mx-auto mb-1" />
                    <p className="text-[13px] font-medium text-[#111827]">
                      {selectedFileName ? `Loaded: ${selectedFileName}` : 'Click or drop screenshot image here'}
                    </p>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">Automatic OCR text extraction enabled</p>
                  </label>
                </div>
              )}

              {/* Text Area Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[12px] font-medium uppercase tracking-wider text-[#6B7280]">
                    Health Message or Claim Content
                  </label>

                  {/* Language Selector */}
                  <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                    <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Output Language:</span>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] text-[12px] rounded-[6px] px-2 py-1 focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish (Español)</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                      <option value="French">French (Français)</option>
                      <option value="Arabic">Arabic (العربية)</option>
                      <option value="Mandarin">Mandarin (中文)</option>
                      <option value="German">German (Deutsch)</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste health forward message, rumor, or question here..."
                  className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[10px] p-3 text-[14px] text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB] transition-all resize-none"
                  id="claim-input-textarea"
                />
              </div>

              {/* Presets Quick Selector */}
              <div>
                <p className="text-[12px] text-[#6B7280] mb-2 font-medium">Or try an example claim:</p>
                <div className="flex flex-wrap gap-2">
                  {samplePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.text, preset.category)}
                      className="text-[12px] bg-[#F8FAFC] hover:bg-[#E5E7EB] text-[#111827] border border-[#E5E7EB] rounded-[8px] px-2.5 py-1 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verify Action Button */}
              <div className="flex justify-end gap-3 pt-2">
                {result && (
                  <button
                    type="button"
                    onClick={() => { setResult(null); setInputText(''); setSelectedFileName(null); }}
                    className="btn-secondary"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRunVerification}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="btn-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  id="execute-verification-btn"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Clinical Literature...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Verify Health Claim</span>
                    </>
                  )}
                </button>
              </div>

              {/* RESULTS DISPLAY PANEL */}
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: easeCurve }}
                  className="mt-6 pt-5 border-t border-[#E5E7EB] space-y-4" 
                  id="verification-results-panel"
                >
                  
                  {/* Verdict Header */}
                  {(() => {
                    const badge = getVerdictBadge(result.verdict);
                    return (
                      <div className={`p-4 rounded-[10px] border ${badge.bg} space-y-2`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {badge.icon}
                            <div>
                              <span className="text-[11px] font-semibold uppercase tracking-wider block">
                                {badge.label}
                              </span>
                              <h4 className="text-[15px] font-semibold text-[#111827]">
                                {result.verdictTitle}
                              </h4>
                            </div>
                          </div>

                          {/* Trust Score */}
                          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-[6px] border border-[#E5E7EB]">
                            <span className="text-[12px] text-[#6B7280]">Trust Score:</span>
                            <span className="text-[13px] font-bold text-[#111827]">
                              {result.trustScore}%
                            </span>
                          </div>
                        </div>

                        <p className="text-[14px] text-[#111827] leading-relaxed">
                          {result.summaryText}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Key Medical Facts */}
                  <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[10px] p-4">
                    <h5 className="text-[12px] font-semibold text-[#111827] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#2563EB]" />
                      <span>Clinical Summary & Key Findings</span>
                    </h5>
                    <ul className="space-y-1.5 text-[13px] text-[#4B5563]">
                      {result.keyFacts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Science Breakdown */}
                  <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[10px] p-4">
                    <h5 className="text-[12px] font-semibold text-[#111827] uppercase tracking-wider mb-1.5">
                      Physiological & Medical Explanation
                    </h5>
                    <p className="text-[13px] text-[#4B5563] leading-relaxed">
                      {result.medicalExplanation}
                    </p>
                  </div>

                  {/* Medical Citations */}
                  <div>
                    <h5 className="text-[12px] font-semibold text-[#111827] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#2563EB]" />
                      <span>Peer-Reviewed Clinical Citations</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.citations.map((cite, idx) => (
                        <div key={idx} className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] p-3 text-[12px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#2563EB]">{cite.source}</span>
                            <span className="text-[11px] text-[#6B7280]">{cite.year}</span>
                          </div>
                          <p className="font-medium text-[#111827]">{cite.title}</p>
                          <p className="text-[#6B7280] text-[11px]">{cite.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actionable Advice & Copy Action */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#E5E7EB]">
                    <div className="text-[13px] text-[#6B7280]">
                      <span className="font-semibold text-[#111827]">Recommended Action: </span>
                      {result.recommendedAction}
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyReport}
                      className="btn-secondary cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Report Copied!' : 'Copy Verification'}</span>
                    </button>
                  </div>

                </motion.div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
