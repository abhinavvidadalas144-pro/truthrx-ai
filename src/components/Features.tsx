import React from 'react';
import { MessageSquare, FileImage, Mic, BookOpen, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'motion/react';

const easeCurve = [0.22, 1, 0.36, 1] as const;

export const Features: React.FC = () => {
  const featuresList = [
    {
      icon: <MessageSquare className="w-5 h-5 text-[#2563EB]" />,
      title: 'Message & Claim Ingestion',
      description: 'Ingest forwarded health claims, consumer posts, or clinical notes. TruthRx AI isolates health assertions from noise to evaluate underlying medical claims.',
    },
    {
      icon: <FileImage className="w-5 h-5 text-[#2563EB]" />,
      title: 'Multimodal OCR Extraction',
      description: 'Upload screenshots of social posts, infographics, or medical documents. Optical character recognition extracts embedded text for immediate evaluation.',
    },
    {
      icon: <Mic className="w-5 h-5 text-[#2563EB]" />,
      title: 'Voice Note Audio Parsing',
      description: 'Convert voice recordings and spoken advice into structured text before cross-referencing against clinical databases and global health guidelines.',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-[#2563EB]" />,
      title: 'Peer-Reviewed Source Matching',
      description: 'Every statement is validated against indexed medical literature including PubMed, WHO, CDC, Mayo Clinic, and peer-reviewed journals.',
    },
    {
      icon: <Globe className="w-5 h-5 text-[#2563EB]" />,
      title: 'Multi-Language Synthesis',
      description: 'Translates complex medical terminology into clear executive summaries and 12+ languages for patient and provider communication.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#2563EB]" />,
      title: 'Auditable Evidence Reports',
      description: 'Generate standardized verification cards and downloadable audit reports with full citations to reference in clinical or compliance workflows.',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: easeCurve }}
      className="py-20 bg-white dark:bg-[#0b0f17] border-t border-[#E5E7EB] dark:border-gray-800/80 transition-colors duration-300"
      id="features"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-[13px] font-medium text-[#2563EB] dark:text-blue-400 uppercase tracking-wider mb-2">
            System Capabilities
          </p>
          <h2 className="text-[28px] font-semibold tracking-tight text-[#111827] dark:text-white mb-3">
            Built for Clinical Accuracy, Scale & Compliance
          </h2>
          <p className="text-[15px] font-normal text-[#6B7280] dark:text-gray-400 leading-relaxed">
            TruthRx AI bridges the gap between peer-reviewed medical research and everyday health communication.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeCurve, delay: idx * 0.08 }}
              className="ent-card flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 flex items-center justify-center mb-5">
                  {feat.icon}
                </div>
                <h3 className="text-[18px] font-semibold text-[#111827] dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-[14px] text-[#6B7280] dark:text-gray-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-[#E5E7EB] dark:border-gray-800 flex items-center text-[12px] font-medium text-[#6B7280] dark:text-gray-400">
                <span>Enterprise Medical Standard</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.section>
  );
};
