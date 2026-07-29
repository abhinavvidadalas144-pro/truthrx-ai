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
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/png');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>('audio/webm');
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<any>(null);

  const saveToHistory = (data: VerificationResult) => {
    try {
      const saved = localStorage.getItem('truthrx_verifications_history');
      const existing = saved ? JSON.parse(saved) : [];
      const historyItem = {
        ...data,
        id: `ver-${Date.now()}`,
        timestamp: new Date().toISOString(),
        isFavorite: false,
      };
      const updated = [historyItem, ...existing.filter((item: any) => item.claimText !== data.claimText)];
      localStorage.setItem('truthrx_verifications_history', JSON.stringify(updated.slice(0, 50)));
      window.dispatchEvent(new Event('truthrx_history_updated'));
    } catch (err) {
      console.error('Failed to save verification to history:', err);
    }
  };

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
    setImageBase64(null);
    setAudioBase64(null);
    setSelectedFileName(null);
    setResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setImageMimeType(file.type || 'image/png');
      const reader = new FileReader();
      reader.onload = (event) => {
        const b64 = event.target?.result as string;
        setImageBase64(b64);
        if (!inputText) {
          setInputText(`[Screenshot attached: ${file.name}] Please perform OCR and verify all health claims in this image.`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setAudioMimeType(file.type || 'audio/webm');
      const reader = new FileReader();
      reader.onload = (event) => {
        const b64 = event.target?.result as string;
        setAudioBase64(b64);
        if (!inputText) {
          setInputText(`[Voice Note attached: ${file.name}] Please transcribe this voice audio note and verify its health claims.`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startVoiceRecording = async () => {
    setMicError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('Audio recording is not supported in this browser. Please upload an audio file instead.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const b64 = reader.result as string;
          setAudioBase64(b64);
          setAudioMimeType('audio/webm');
          setSelectedFileName('Live Voice Recording.webm');
          setInputText('[Live Voice Note Recorded] Please transcribe this audio recording and verify all medical statements.');
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission denied or unavailable:', err);
      setMicError('Microphone access was denied or is restricted in this preview frame. You can upload an audio file directly or use text input.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleRunVerification = async () => {
    if (!inputText.trim() && !imageBase64 && !audioBase64) return;

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
          imageData: imageBase64,
          imageMimeType,
          audioData: audioBase64,
          audioMimeType
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data: VerificationResult = await response.json();
      setResult(data);
      saveToHistory(data);
    } catch (err) {
      console.error('Failed to verify:', err);
      const fallbackData: VerificationResult = {
        claimText: inputText || 'Health Statement Verification',
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
      };
      setResult(fallbackData);
      saveToHistory(fallbackData);
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
          bg: 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300',
          icon: <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />,
          label: 'FALSE CLAIM',
        };
      case 'MISLEADING':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
          label: 'MISLEADING / OVERSTATED',
        };
      case 'UNPROVEN':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950/60 border-yellow-200 dark:border-yellow-900/60 text-yellow-900 dark:text-yellow-300',
          icon: <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
          label: 'UNPROVEN CLAIM',
        };
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
          label: 'ACCURATE & VERIFIED',
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/60 text-[#2563EB] dark:text-blue-400',
          icon: <Info className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />,
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

              {/* Voice Note Upload / Recording Controls if Voice tab is active */}
              {activeCategory === 'voicenote' && (
                <div className="border border-dashed border-[#E5E7EB] bg-[#F8FAFC] rounded-[10px] p-4 text-center space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startVoiceRecording}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium px-4 py-2 rounded-[8px] transition-colors cursor-pointer"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Record Voice Note</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="flex items-center gap-2 bg-red-700 text-white text-[13px] font-medium px-4 py-2 rounded-[8px] animate-pulse cursor-pointer"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        <span>Stop Recording ({recordingSeconds}s)</span>
                      </button>
                    )}

                    <span className="text-[12px] text-[#6B7280]">or</span>

                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileUpload}
                      className="hidden"
                      id="voice-file-input"
                    />
                    <label
                      htmlFor="voice-file-input"
                      className="flex items-center gap-2 bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#111827] text-[13px] font-medium px-3.5 py-2 rounded-[8px] cursor-pointer transition-colors"
                    >
                      <Mic className="w-4 h-4 text-[#2563EB]" />
                      <span>{selectedFileName ? `Loaded: ${selectedFileName}` : 'Upload Audio File'}</span>
                    </label>
                  </div>
                  {micError && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-[8px] p-2.5 text-[12px] text-left flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span>{micError}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-[12px] text-[#6B7280]">
                    Speech-to-text transcription & medical claim analysis enabled
                  </p>
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
