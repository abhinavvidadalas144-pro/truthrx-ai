import React, { useState } from 'react';
import { ChevronDown, Search, X, ThumbsUp, ThumbsDown, Check, HelpCircle, MessageSquare, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQItem } from '../types';

const easeCurve = [0.22, 1, 0.36, 1] as const;

interface FAQProps {
  onOpenSupport?: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ onOpenSupport }) => {
  const [openId, setOpenId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Helpfulness Voting state per FAQ item
  const [votes, setVotes] = useState<Record<string, 'yes' | 'no'>>(() => {
    try {
      const saved = localStorage.getItem('truthrx_faq_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleVote = (faqId: string, choice: 'yes' | 'no') => {
    const updated = { ...votes, [faqId]: choice };
    setVotes(updated);
    try {
      localStorage.setItem('truthrx_faq_votes', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save vote to localStorage:', e);
    }
  };

  const faqList: FAQItem[] = [
    {
      id: '1',
      question: 'How does TruthRx AI verify health messages and claims?',
      answer: 'TruthRx AI extracts core medical assertions from text messages, screenshots, audio transcripts, or WhatsApp forwards and cross-references them against indexed clinical trials, peer-reviewed medical journals, and established guidelines from authoritative health agencies like WHO, CDC, Mayo Clinic, and NIH.',
      category: 'General',
    },
    {
      id: '2',
      question: 'How does TruthRx AI prevent AI hallucination in medical verifications?',
      answer: 'TruthRx AI utilizes a multi-pass retrieval-augmented verification framework. It extracts claim entities and queries peer-reviewed medical literature directly (PubMed, PubMed Central, CDC, WHO) before synthesizing responses. Every assertion requires explicit citation back to indexed clinical sources, preventing ungrounded AI generation.',
      category: 'AI Verification',
    },
    {
      id: '3',
      question: 'What trust score threshold indicates a reliable medical claim?',
      answer: 'A Trust Score above 80% indicates strong peer-reviewed consensus and clinical backing. Scores between 40% and 79% represent unproven, preliminary, or contextually misleading claims. Scores below 40% indicate scientifically false or debunked claims with high potential for health risk.',
      category: 'AI Verification',
    },
    {
      id: '4',
      question: 'How does OCR screenshot verification handle handwritten text or low resolution images?',
      answer: 'Our advanced OCR engine employs image pre-processing—including noise reduction, contrast normalization, and neural optical character recognition tailored for medical typography. It accurately extracts text from prescription notes, social media graphics, and compressed chat screenshots.',
      category: 'OCR & Screenshots',
    },
    {
      id: '5',
      question: 'Can TruthRx AI process WhatsApp forwards in non-English languages?',
      answer: 'Yes. TruthRx AI supports over 12 global languages including Spanish, Hindi, French, Arabic, Mandarin, German, Portuguese, and Swahili. It extracts medical claims regardless of the original language and provides simple, plain-language explanations.',
      category: 'WhatsApp Verification',
    },
    {
      id: '6',
      question: 'How do I verify a forward directly from WhatsApp?',
      answer: 'You can copy and paste any received WhatsApp message directly into the TruthRx AI input field, or upload a screenshot of the forward. The engine parses viral formatting, forwards indicators, and embedded links automatically.',
      category: 'WhatsApp Verification',
    },
    {
      id: '7',
      question: 'Does TruthRx AI support audio notes and voice recordings?',
      answer: 'Yes! You can record or upload audio files directly into the verification tool. Our automated voice-to-text pipeline converts spoken health claims into high-fidelity transcripts before running deep clinical evidence cross-checks.',
      category: 'Voice Verification',
    },
    {
      id: '8',
      question: 'Is my uploaded screenshot or message stored on public servers?',
      answer: 'No. TruthRx AI processes uploaded text, audio, and screenshots ephemerally for the sole purpose of real-time clinical verification. We do not store, sell, or index user message contents or personal identifying information on public servers.',
      category: 'Privacy & Security',
    },
    {
      id: '9',
      question: 'How is patient data protected under HIPAA and privacy standards?',
      answer: 'All data transmission uses end-to-end TLS encryption. User sessions are anonymized, and uploaded health claims are stripped of Personal Health Information (PHI) prior to analysis in compliance with modern medical data privacy standards.',
      category: 'Privacy & Security',
    },
    {
      id: '10',
      question: 'Is TruthRx AI a substitute for a licensed doctor or medical diagnosis?',
      answer: 'No. TruthRx AI is an educational fact-checking tool designed to combat health misinformation and unverified rumors. It is not a diagnostic medical service and cannot replace personal consultation with a qualified healthcare professional.',
      category: 'General',
    },
    {
      id: '11',
      question: 'Which medical sources and databases are indexed?',
      answer: 'Our engine references peer-reviewed databases including PubMed, National Institutes of Health (NIH), World Health Organization (WHO), Centers for Disease Control and Prevention (CDC), Mayo Clinic Proceedings, The Lancet, New England Journal of Medicine, and FDA public health notices.',
      category: 'General',
    },
    {
      id: '12',
      question: 'How do I export clinical reports or save verification history?',
      answer: 'Click on your profile avatar in the navigation bar to open the User Dashboard. From the "Verification History" tab, you can view saved claims, filter by verdict, star favorites, export printable PDF clinical reports, or download your complete JSON archive.',
      category: 'Account',
    },
  ];

  const categories = [
    'All',
    'General',
    'AI Verification',
    'OCR & Screenshots',
    'WhatsApp Verification',
    'Voice Verification',
    'Privacy & Security',
    'Account',
  ];

  const filteredFaqs = faqList.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      q === '' ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-amber-200/90 dark:bg-amber-900/60 text-[#111827] dark:text-amber-100 rounded px-1 py-0.5 font-semibold"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: easeCurve }}
      className="py-20 bg-white dark:bg-[#0b0f17] border-t border-[#E5E7EB] dark:border-gray-800/80 transition-colors duration-300"
      id="faq"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <p className="text-[13px] font-medium text-[#2563EB] dark:text-blue-400 uppercase tracking-wider mb-2">
            Frequently Asked Questions
          </p>
          <h2 className="text-[28px] font-semibold tracking-tight text-[#111827] dark:text-white mb-3">
            System Insights & Medical Compliance
          </h2>
          <p className="text-[15px] font-normal text-[#6B7280] dark:text-gray-400 leading-relaxed mb-6">
            Learn more about our clinical source indexing, privacy safeguards, and multi-language verification engine.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#6B7280] dark:text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords (e.g., privacy, OCR, WhatsApp)..."
              className="w-full h-[44px] bg-[#F8FAFC] dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[10px] pl-10 pr-10 text-[14px] text-[#111827] dark:text-white placeholder-[#6B7280] dark:placeholder-gray-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-[#6B7280] hover:text-[#111827] dark:hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 max-w-4xl">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === 'All'
                ? faqList.length
                : faqList.filter((item) => item.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-[#F8FAFC] dark:bg-gray-900 text-[#4B5563] dark:text-gray-300 border border-[#E5E7EB] dark:border-gray-800 hover:bg-[#E5E7EB]/60 dark:hover:bg-gray-800/80'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E5E7EB] dark:bg-gray-800 text-[#6B7280] dark:text-gray-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3 max-w-3xl">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const userVote = votes[faq.id];

            return (
              <div
                key={faq.id}
                className={`bg-white dark:bg-gray-900 border transition-all duration-200 rounded-[14px] overflow-hidden ${
                  isOpen
                    ? 'border-[#2563EB]/40 dark:border-blue-500/40 shadow-2xs'
                    : 'border-[#E5E7EB] dark:border-gray-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] dark:hover:bg-gray-800/60 transition-colors cursor-pointer group"
                >
                  <div className="pr-4 flex flex-col gap-1">
                    <span className="text-[16px] font-medium text-[#111827] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                      {highlightMatch(faq.question, searchQuery)}
                    </span>
                    <span className="text-[11px] text-[#6B7280] dark:text-gray-400 font-normal">
                      Category: {faq.category}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#2563EB] dark:text-blue-400 flex-shrink-0 transition-transform duration-300 ease-out ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: easeCurve }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-[14px] text-[#4B5563] dark:text-gray-300 leading-relaxed border-t border-[#E5E7EB] dark:border-gray-800 pt-4">
                        <p>{highlightMatch(faq.answer, searchQuery)}</p>

                        {/* Helpfulness Voting Bar */}
                        <div className="mt-5 pt-3 border-t border-[#E5E7EB]/80 dark:border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#6B7280] dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <span>Was this answer helpful?</span>
                            {userVote ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
                                <Check className="w-3.5 h-3.5" />
                                <span>Thank you for your feedback! ({userVote === 'yes' ? 'Yes' : 'No'})</span>
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleVote(faq.id, 'yes')}
                                  className="px-2.5 py-1 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:bg-[#E5E7EB]/60 dark:hover:bg-gray-700 text-[#111827] dark:text-white rounded-[6px] flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <ThumbsUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  <span>Yes</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleVote(faq.id, 'no')}
                                  className="px-2.5 py-1 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:bg-[#E5E7EB]/60 dark:hover:bg-gray-700 text-[#111827] dark:text-white rounded-[6px] flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <ThumbsDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                                  <span>No</span>
                                </button>
                              </div>
                            )}
                          </div>

                          <span className="text-[11px] text-[#6B7280] dark:text-gray-400">
                            Indexed Source: Peer-Reviewed Clinical Evidence
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="p-8 bg-[#F8FAFC] dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] text-center space-y-3">
              <p className="text-[#111827] dark:text-white text-[15px] font-medium">
                No matching FAQs found for "{searchQuery}" in category "{selectedCategory}"
              </p>
              <p className="text-[#6B7280] dark:text-gray-400 text-[13px]">
                Try adjusting your search terms or choosing "All" categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] text-white text-[13px] font-medium rounded-[8px] hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset FAQ Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Contact Support CTA */}
        <div className="mt-10 p-6 bg-[#F8FAFC] dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-3xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 dark:bg-blue-900/30 flex items-center justify-center text-[#2563EB] dark:text-blue-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-[#111827] dark:text-white">
                Still have questions or need assistance?
              </h4>
              <p className="text-[13px] text-[#6B7280] dark:text-gray-400">
                Our clinical compliance & technical support team is available to assist you.
              </p>
            </div>
          </div>
          {onOpenSupport && (
            <button
              type="button"
              onClick={onOpenSupport}
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[8px] text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Support</span>
            </button>
          )}
        </div>

      </div>
    </motion.section>
  );
};
