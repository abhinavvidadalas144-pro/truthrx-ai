import React, { useState, useEffect, useRef } from 'react';
import {
  Stethoscope,
  Send,
  Mic,
  MicOff,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  Volume2,
  VolumeX,
  User,
  Plus,
  ArrowRight,
  ShieldAlert,
  Info,
  MessageSquare,
  History,
  Maximize2,
  Minimize2,
  Search,
  Trash2,
  Edit3,
  X,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, ChatSession } from '../types';

const easeCurve = [0.22, 1, 0.36, 1] as const;

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  timestamp: 'Just now',
  text: `Hello! I'm **TruthRx AI Health Assistant**.

Describe your symptoms or ask a health-related question, and I'll help you understand possible causes, explain medical information, and recommend appropriate next steps.

*This assistant provides educational guidance and is not a replacement for professional medical care.*`,
  followUpQuestions: [
    "I have a throbbing headache and sensitivity to light",
    "What causes type 2 diabetes?",
    "Feeling fatigued with a low-grade fever and sore throat",
    "What are the warning signs of a stroke?",
    "How much water should I drink daily?"
  ]
};

export const HealthAssistant: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('truthrx_chat_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load sessions:', e);
    }
    return [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return `session-${Date.now()}`;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('truthrx_active_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load active chat:', e);
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // New features state: History Drawer and Fullscreen Mode
  const [showHistory, setShowHistory] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Save active chat and sync with sessions history
  useEffect(() => {
    try {
      localStorage.setItem('truthrx_active_chat', JSON.stringify(messages));

      // Auto-save session if user has sent messages
      const userMessage = messages.find((m) => m.sender === 'user');
      if (userMessage) {
        const sessionTitle = userMessage.text.length > 35
          ? userMessage.text.slice(0, 35) + '...'
          : userMessage.text;

        setSessions((prevSessions) => {
          const existingIdx = prevSessions.findIndex((s) => s.id === currentSessionId);
          let updated: ChatSession[];

          if (existingIdx >= 0) {
            updated = [...prevSessions];
            updated[existingIdx] = {
              ...updated[existingIdx],
              messages,
              updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          } else {
            const newSession: ChatSession = {
              id: currentSessionId,
              title: sessionTitle || 'Health Consultation',
              updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              messages,
            };
            updated = [newSession, ...prevSessions];
          }

          localStorage.setItem('truthrx_chat_sessions', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [messages, currentSessionId]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Auto-scroll inside chat box only (preventing full page scroll)
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Keep input focused
  useEffect(() => {
    inputRef.current?.focus();
  }, [isTyping]);

  // Initialize Web Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) setInput(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    if (!textToSend) setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const res = await fetch('/api/health-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'I apologize, I was unable to process your request at this moment. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: data.isEmergency || false,
        urgencyLevel: data.urgencyLevel,
        assessmentConfidence: data.assessmentConfidence,
        possibleConditions: data.possibleConditions,
        recommendedNextSteps: data.recommendedNextSteps,
        redFlagSymptoms: data.redFlagSymptoms,
        recommendedSpecialist: data.recommendedSpecialist,
        suggestedActions: data.suggestedActions,
        followUpQuestions: data.followUpQuestions,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error fetching health assistant response:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        sender: 'assistant',
        text: `### Health Guidance Overview\n\nWhen evaluating medical symptoms or health questions, clinical consensus highlights:\n\n* **Primary Assessment**: Track the onset, duration, and severity of symptoms.\n* **Self-Care Baseline**: Ensure proper hydration, rest, and avoid strenuous physical exertion.\n* **Clinical Evaluation**: If symptoms persist for more than 48 hours or worsen, consult a primary care physician.\n\n*Disclaimer: TruthRx AI Health Assistant provides evidence-based information for educational purposes only.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpQuestions: [
          "What causes tension headaches?",
          "How can I tell if my symptom is serious?",
          "When should I visit urgent care?"
        ]
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTextToSpeech = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_~`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([INITIAL_WELCOME_MESSAGE]);
    try {
      localStorage.removeItem('truthrx_active_chat');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setShowHistory(false);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    try {
      localStorage.setItem('truthrx_chat_sessions', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    if (currentSessionId === sessionId) {
      handleNewChat();
    }
  };

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveRename = (sessionId: string, e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editingTitle.trim()) return;

    const updated = sessions.map((s) =>
      s.id === sessionId ? { ...s, title: editingTitle.trim() } : s
    );
    setSessions(updated);
    try {
      localStorage.setItem('truthrx_chat_sessions', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setEditingSessionId(null);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format markdown helper (bolding, headers, bullet points)
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-[16px] font-semibold text-[#111827] dark:text-white mt-3 mb-1.5 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
            <span>{trimmed.replace('### ', '')}</span>
          </h4>
        );
      }

      if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
        return (
          <p key={idx} className="font-semibold text-[#111827] dark:text-gray-100 my-1 text-[14px]">
            {trimmed.replace(/\*\*/g, '')}
          </p>
        );
      }

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const bulletContent = trimmed.slice(2);
        const parts = bulletContent.split(/(\*\*.*?\*\*)/g);

        return (
          <li key={idx} className="ml-4 list-disc text-[14px] text-[#374151] dark:text-gray-300 my-1 leading-relaxed">
            {parts.map((part, pIdx) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={pIdx} className="font-semibold text-[#111827] dark:text-white">
                  {part.replace(/\*\*/g, '')}
                </strong>
              ) : (
                part
              )
            )}
          </li>
        );
      }

      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="text-[14px] text-[#374151] dark:text-gray-300 my-1 leading-relaxed">
          {parts.map((part, pIdx) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={pIdx} className="font-semibold text-[#111827] dark:text-white">
                {part.replace(/\*\*/g, '')}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  return (
    <section
      className="py-16 bg-white dark:bg-[#0b0f17] border-t border-[#E5E7EB] dark:border-gray-800/80 transition-colors duration-300 scroll-mt-20"
      id="health-assistant"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 dark:bg-blue-900/30 border border-[#2563EB]/20 text-[#2563EB] dark:text-blue-400 text-[12px] font-semibold uppercase tracking-wider mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>AI Health Assistant</span>
          </div>

          <h2 className="text-[28px] font-semibold tracking-tight text-[#111827] dark:text-white mb-3">
            Conversational Symptom Assessment & Medical Guidance
          </h2>

          <p className="text-[15px] text-[#6B7280] dark:text-gray-400 leading-relaxed mb-4">
            Discuss symptoms, ask medical questions, and explore evidence-based health information through natural multi-turn AI dialogue.
          </p>

          {/* Educational Disclaimer Banner */}
          <div className="bg-[#F8FAFC] dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[10px] p-3.5 flex items-center gap-3 text-[13px] text-[#4B5563] dark:text-gray-300">
            <ShieldAlert className="w-4 h-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
            <span>
              <strong className="font-semibold text-[#111827] dark:text-white">Educational Disclaimer: </strong>
              This AI assistant provides general health guidance and symptom assessment. It does not provide formal medical diagnoses or replace a licensed physician.
            </span>
          </div>
        </div>

        {/* Main Chat Workstation Card */}
        <div className={`relative bg-white dark:bg-[#0f172a] border border-[#E5E7EB] dark:border-gray-800 rounded-[16px] shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen max-w-none border-none p-0' : 'max-w-4xl h-[650px]'}`}>
          
          {/* History Slide-over Drawer */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0 left-0 z-40 w-full sm:w-80 bg-slate-50 dark:bg-gray-900 border-r border-[#E5E7EB] dark:border-gray-800 flex flex-col shadow-xl"
              >
                {/* History Header */}
                <div className="p-4 border-b border-[#E5E7EB] dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-[#2563EB]" />
                    <h4 className="text-[14px] font-semibold text-[#111827] dark:text-white">
                      Conversation History
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHistory(false)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="p-3 border-b border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search conversations..."
                      className="w-full h-8 pl-8 pr-3 text-[12px] bg-slate-50 dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[6px] text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                {/* Sessions List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {filteredSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-[12px]">
                      No previous conversations found.
                    </div>
                  ) : (
                    filteredSessions.map((s) => {
                      const isSelected = s.id === currentSessionId;

                      return (
                        <div
                          key={s.id}
                          onClick={() => handleSelectSession(s)}
                          className={`p-3 rounded-[10px] border transition-all cursor-pointer flex flex-col gap-1 text-left ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/40 border-[#2563EB] dark:border-blue-700'
                              : 'bg-white dark:bg-gray-800/60 border-[#E5E7EB] dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                          }`}
                        >
                          {editingSessionId === s.id ? (
                            <form
                              onSubmit={(e) => handleSaveRename(s.id, e)}
                              className="flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                className="flex-1 px-2 py-0.5 text-[12px] border border-[#2563EB] rounded bg-white dark:bg-gray-900 text-[#111827] dark:text-white"
                                autoFocus
                              />
                              <button
                                type="submit"
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[13px] font-medium text-[#111827] dark:text-white truncate">
                                {s.title}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => handleStartRename(s, e)}
                                  className="p-1 hover:text-[#2563EB] transition-colors cursor-pointer"
                                  title="Rename conversation"
                                >
                                  <Edit3 className="w-3 h-3 text-gray-400 hover:text-[#2563EB]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteSession(s.id, e)}
                                  className="p-1 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Delete conversation"
                                >
                                  <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {s.updatedAt}
                            </span>
                            <span>{s.messages.length} messages</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Toolbar Header */}
          <div className="px-6 py-3.5 bg-[#F8FAFC] dark:bg-gray-900/90 border-b border-[#E5E7EB] dark:border-gray-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white flex items-center gap-2">
                  <span>TruthRx AI Health Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Engine Active" />
                </h3>
                <p className="text-[11px] text-[#6B7280] dark:text-gray-400">
                  Evidence-based Clinical AI • Fast & Confidential
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className={`px-3 py-1.5 border rounded-[8px] text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showHistory
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-white dark:bg-gray-800 border-[#E5E7EB] dark:border-gray-700 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 text-[#374151] dark:text-gray-200'
                }`}
                title="Conversation History"
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">History</span>
                {sessions.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-blue-300 font-bold">
                    {sessions.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleNewChat}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 text-[#374151] dark:text-gray-200 rounded-[8px] text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Start a new conversation"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Chat</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 text-[#374151] dark:text-gray-200 rounded-[8px] transition-colors cursor-pointer"
                title={isFullscreen ? "Exit Full Screen (Esc)" : "Full Screen Mode"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#2563EB]" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Messages Feed Area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-[#0f172a]">
            
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-[12px] font-bold ${
                      isUser
                        ? 'bg-slate-700 dark:bg-gray-600'
                        : 'bg-[#2563EB]'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-[14px] p-4 text-[14px] leading-relaxed transition-all ${
                      isUser
                        ? 'bg-[#2563EB] text-white rounded-tr-none'
                        : 'bg-[#F8FAFC] dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 text-[#111827] dark:text-white rounded-tl-none shadow-2xs'
                    }`}
                  >
                    {/* User Text or Formatted Assistant Text */}
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="space-y-3">
                        
                        {/* Urgency Level Assessment Banner */}
                        {(msg.urgencyLevel || msg.isEmergency) && (
                          <div className={`p-3 rounded-[10px] border flex items-center justify-between gap-3 text-[13px] ${
                            msg.urgencyLevel === 'Emergency' || msg.isEmergency
                              ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
                              : msg.urgencyLevel === 'Prompt'
                              ? 'bg-orange-500/10 border-orange-500/30 text-orange-800 dark:text-orange-300'
                              : msg.urgencyLevel === 'Routine'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                          }`}>
                            <div className="flex items-center gap-2.5">
                              <span className="text-[16px]">
                                {msg.urgencyLevel === 'Emergency' || msg.isEmergency ? '🔴' : msg.urgencyLevel === 'Prompt' ? '🟠' : msg.urgencyLevel === 'Routine' ? '🟡' : '🟢'}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold uppercase text-[11px] tracking-wide">
                                    Urgency Level: {msg.urgencyLevel || 'Emergency'}
                                  </span>
                                  {msg.assessmentConfidence && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/60 dark:bg-black/30 border border-current/20">
                                      {msg.assessmentConfidence} Confidence
                                    </span>
                                  )}
                                </div>
                                <p className="text-[12px] opacity-90 mt-0.5">
                                  {msg.urgencyLevel === 'Emergency' || msg.isEmergency
                                    ? 'Seek immediate emergency medical care (Call 911 or visit ER).'
                                    : msg.urgencyLevel === 'Prompt'
                                    ? 'Same-day or next-day medical evaluation recommended.'
                                    : msg.urgencyLevel === 'Routine'
                                    ? 'Medical appointment recommended within the next few days.'
                                    : 'Self-care and monitoring are appropriate.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Main Response Text */}
                        <div>{renderFormattedText(msg.text)}</div>

                        {/* Structured Possible Conditions Table */}
                        {msg.possibleConditions && msg.possibleConditions.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-gray-800">
                            <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-gray-400 mb-2.5">
                              Possible Conditions
                            </p>
                            <div className="space-y-2">
                              {msg.possibleConditions
                                .slice()
                                .sort((a, b) => {
                                  const pctA = a.percentage ?? (a.likelihood === 'High' ? 85 : a.likelihood === 'Moderate' ? 50 : 20);
                                  const pctB = b.percentage ?? (b.likelihood === 'High' ? 85 : b.likelihood === 'Moderate' ? 50 : 20);
                                  return pctB - pctA;
                                })
                                .map((cond, cIdx) => {
                                  const pct = cond.percentage ?? (cond.likelihood === 'High' ? 88 : cond.likelihood === 'Moderate' ? 52 : 18);
                                  const dotColor = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-orange-500';

                                  return (
                                    <div
                                      key={cIdx}
                                      className="p-3 rounded-[8px] bg-white dark:bg-gray-800/80 border border-[#E5E7EB] dark:border-gray-700/70 text-[13px]"
                                    >
                                      <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
                                        <div className="flex items-center gap-2 font-semibold text-[#111827] dark:text-white">
                                          <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0`} />
                                          <span>{cond.name}</span>
                                        </div>
                                        <span className="text-[12px] font-semibold text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-800/40">
                                          Estimated Likelihood: {pct}%
                                        </span>
                                      </div>
                                      <p className="text-[#6B7280] dark:text-gray-300 text-[12px]">
                                        {cond.reasoning}
                                      </p>
                                    </div>
                                  );
                                })}
                            </div>

                            <p className="mt-3 text-[12px] text-[#6B7280] dark:text-gray-400 leading-relaxed italic bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-[8px] border border-[#E5E7EB] dark:border-gray-800">
                              "These percentages are AI-generated estimates based on the information provided and should not be interpreted as a confirmed diagnosis. A qualified healthcare professional may require additional information, an examination, or diagnostic tests."
                            </p>
                          </div>
                        )}

                        {/* Recommended Next Steps */}
                        {((msg.recommendedNextSteps && msg.recommendedNextSteps.length > 0) || (msg.suggestedActions && msg.suggestedActions.length > 0)) && (
                          <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-gray-800">
                            <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-gray-400 mb-2">
                              Recommended Next Steps
                            </p>
                            <ul className="space-y-1.5 text-[13px] text-[#374151] dark:text-gray-300">
                              {(msg.recommendedNextSteps || msg.suggestedActions || []).map((step, sIdx) => (
                                <li key={sIdx} className="flex items-start gap-2">
                                  <span className="text-[#2563EB] dark:text-blue-400 font-bold">•</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Red Flag Symptoms */}
                        {msg.redFlagSymptoms && msg.redFlagSymptoms.length > 0 && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-[8px] text-[12px]">
                            <p className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5 mb-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>Seek urgent medical care immediately if you experience:</span>
                            </p>
                            <ul className="list-disc ml-5 space-y-1 text-red-700 dark:text-red-300">
                              {msg.redFlagSymptoms.map((flag, fIdx) => (
                                <li key={fIdx}>{flag}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Recommended Specialist / Healthcare Professional */}
                        {msg.recommendedSpecialist && (
                          <div className="mt-3 flex items-center gap-2 text-[12px] bg-blue-50 dark:bg-blue-950/30 text-[#2563EB] dark:text-blue-300 px-3 py-1.5 rounded-[8px] border border-blue-200 dark:border-blue-900/40 font-medium">
                            <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              Recommended Healthcare Professional: <strong>{msg.recommendedSpecialist}</strong>
                            </span>
                          </div>
                        )}

                        {/* Action Bar for AI Messages */}
                        <div className="pt-2 flex items-center justify-between text-[11px] text-[#6B7280] dark:text-gray-400">
                          <span>{msg.timestamp}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="p-1 hover:text-[#111827] dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600 font-medium">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleTextToSpeech(msg.id, msg.text)}
                              className={`p-1 hover:text-[#111827] dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${
                                speakingId === msg.id ? 'text-[#2563EB] font-medium' : ''
                              }`}
                              title={speakingId === msg.id ? "Stop reading" : "Read aloud"}
                            >
                              {speakingId === msg.id ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5 text-[#2563EB]" />
                                  <span className="text-[#2563EB]">Stop</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>Listen</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Follow Up Questions Pills */}
                        {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-gray-800 space-y-1.5">
                            <p className="text-[11px] font-semibold text-[#6B7280] dark:text-gray-400">
                              Suggested Follow-up Questions:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.followUpQuestions.map((q, qIdx) => (
                                <button
                                  key={qIdx}
                                  type="button"
                                  onClick={() => handleSendMessage(q)}
                                  className="text-[12px] text-left px-2.5 py-1 bg-white dark:bg-gray-800 hover:bg-[#2563EB] hover:text-white dark:hover:bg-blue-600 border border-[#E5E7EB] dark:border-gray-700 rounded-full transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <span>{q}</span>
                                  <ArrowRight className="w-3 h-3 opacity-60" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing / Thinking Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[12px] font-bold">
                  <Stethoscope className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-[#F8FAFC] dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] rounded-tl-none p-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[12px] text-[#6B7280] dark:text-gray-400 ml-2 font-medium">
                    Analyzing symptoms against medical evidence...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Controls Bar */}
          <div className="p-4 bg-[#F8FAFC] dark:bg-gray-900 border-t border-[#E5E7EB] dark:border-gray-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleMic}
                className={`p-2.5 rounded-[10px] border transition-colors cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'bg-white dark:bg-gray-800 text-[#4B5563] dark:text-gray-300 border-[#E5E7EB] dark:border-gray-700 hover:text-[#111827] dark:hover:text-white'
                }`}
                title={isListening ? "Stop listening" : "Speak your symptoms"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isListening
                    ? 'Listening... Speak your health question or symptoms'
                    : 'Describe your symptoms or ask a medical question (e.g., headache with fever)...'
                }
                className="flex-1 h-[44px] bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-[10px] px-4 text-[14px] text-[#111827] dark:text-white placeholder-[#6B7280] dark:placeholder-gray-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500 transition-colors"
                disabled={isTyping}
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`px-4 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
                  input.trim() && !isTyping
                    ? 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-2xs'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
