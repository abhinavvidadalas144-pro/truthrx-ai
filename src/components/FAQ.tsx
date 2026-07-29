import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQItem } from '../types';

const easeCurve = [0.22, 1, 0.36, 1] as const;

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');

  const faqList: FAQItem[] = [
    {
      id: '1',
      question: 'How does TruthRx AI verify health messages and claims?',
      answer: 'TruthRx AI extracts core medical assertions from text messages, screenshots, or transcripts and cross-references them against indexed clinical trials, peer-reviewed medical journals, and established guidelines from organizations like WHO, CDC, Mayo Clinic, and NIH.',
      category: 'General',
    },
    {
      id: '2',
      question: 'Can TruthRx AI process WhatsApp forwards in non-English languages?',
      answer: 'Yes. TruthRx AI supports over 12 global languages including Spanish, Hindi, French, Arabic, Mandarin, and German. It extracts health claims regardless of the original language and provides simple, plain-language explanations.',
      category: 'Sources',
    },
    {
      id: '3',
      question: 'Is my uploaded screenshot or message stored on public servers?',
      answer: 'No. TruthRx AI processes uploaded text and screenshots ephemerally for the sole purpose of real-time clinical verification. We do not store, track, or sell user message content or personal information.',
      category: 'Privacy',
    },
    {
      id: '4',
      question: 'Is TruthRx AI a substitute for a licensed doctor or medical diagnosis?',
      answer: 'No. TruthRx AI is an educational fact-checking tool designed to combat health misinformation and unverified rumors. It is not a diagnostic medical service and cannot replace personal consultation with a qualified medical professional.',
      category: 'Accuracy',
    },
    {
      id: '5',
      question: 'Which medical sources and databases are indexed?',
      answer: 'Our engine references peer-reviewed databases including PubMed, National Institutes of Health (NIH), World Health Organization (WHO), Centers for Disease Control and Prevention (CDC), Mayo Clinic Proceedings, The Lancet, and FDA public health notices.',
      category: 'Sources',
    },
  ];

  const filteredFaqs = faqList.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: easeCurve }}
      className="py-20 bg-white border-t border-[#E5E7EB]"
      id="faq"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-[56px]">
        
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <p className="text-[13px] font-medium text-[#2563EB] uppercase tracking-wider mb-2">
            Frequently Asked Questions
          </p>
          <h2 className="text-[28px] font-semibold tracking-tight text-[#111827] mb-3">
            System Insights & Medical Compliance
          </h2>
          <p className="text-[15px] font-normal text-[#6B7280] leading-relaxed mb-6">
            Learn more about our clinical source indexing, privacy safeguards, and multi-language verification engine.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., privacy, sources)..."
              className="w-full h-[44px] bg-[#F8FAFC] border border-[#E5E7EB] rounded-[10px] pl-10 pr-4 text-[14px] text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 max-w-3xl">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-[#E5E7EB] rounded-[14px] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <span className="text-[16px] font-medium text-[#111827] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#2563EB] flex-shrink-0 transition-transform duration-300 ease-out ${
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
                      transition={{ duration: 0.3, ease: easeCurve }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-[14px] text-[#4B5563] leading-relaxed border-t border-[#E5E7EB] pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="py-8 text-[#6B7280] text-[14px]">
              No matching questions found. Try searching for "sources" or "privacy".
            </div>
          )}
        </div>

      </div>
    </motion.section>
  );
};
