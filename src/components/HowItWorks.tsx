import React from 'react';
import { Upload, Search, CheckCircle, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HowItWorksProps {
  onVerifyClick: () => void;
}

const easeCurve = [0.22, 1, 0.36, 1] as const;

export const HowItWorks: React.FC<HowItWorksProps> = ({ onVerifyClick }) => {
  const steps = [
    {
      step: '01',
      icon: <Upload className="w-5 h-5 text-[#2563EB]" />,
      title: 'Submit Health Claim',
      desc: 'Paste a forwarded message from WhatsApp, upload a post screenshot, or input a voice note transcript.',
    },
    {
      step: '02',
      icon: <Search className="w-5 h-5 text-[#2563EB]" />,
      title: 'Clinical Citation Analysis',
      desc: 'TruthRx AI cross-references the claim against peer-reviewed journals, WHO directives, and CDC clinical databases.',
    },
    {
      step: '03',
      icon: <CheckCircle className="w-5 h-5 text-[#2563EB]" />,
      title: 'Evidence Score & Explanation',
      desc: 'Receive a verdict (Verified, Misleading, False) with a 0–100% Medical Trust Score and patient-friendly explanation.',
    },
    {
      step: '04',
      icon: <Share2 className="w-5 h-5 text-[#2563EB]" />,
      title: 'Export Auditable Report',
      desc: 'Export a verified fact card or citation report to communicate findings to clinical teams or patient communities.',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: easeCurve }}
      className="py-20 bg-[#F8FAFC] dark:bg-[#0f172a] border-t border-[#E5E7EB] dark:border-gray-800/80 transition-colors duration-300"
      id="how-it-works"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-[13px] font-medium text-[#2563EB] dark:text-blue-400 uppercase tracking-wider mb-2">
            Workflow Architecture
          </p>
          <h2 className="text-[28px] font-semibold tracking-tight text-[#111827] dark:text-white mb-3">
            How TruthRx AI Cross-References Health Claims
          </h2>
          <p className="text-[15px] font-normal text-[#6B7280] dark:text-gray-400 leading-relaxed">
            A 4-step pipeline designed for rapid verification against global medical reference standards.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeCurve, delay: idx * 0.1 }}
              className="ent-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[14px] font-semibold text-[#6B7280] dark:text-gray-400">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-[18px] font-semibold text-[#111827] dark:text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-[14px] text-[#6B7280] dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="mt-12 flex justify-start">
          <button
            onClick={onVerifyClick}
            className="btn-primary"
          >
            <span>Verify a Health Claim</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </div>
    </motion.section>
  );
};
