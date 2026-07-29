import React from 'react';
import { ShieldCheck, Globe2 } from 'lucide-react';
import { motion } from 'motion/react';

const easeCurve = [0.22, 1, 0.36, 1] as const;

export const About: React.FC = () => {
  const stats = [
    { label: 'Indexed Clinical Papers', value: '150M+' },
    { label: 'Global Languages Supported', value: '12+' },
    { label: 'Average Processing Time', value: '< 3s' },
    { label: 'WHO & Mayo Guideline Alignment', value: '100%' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: easeCurve }}
      className="py-20 bg-[#F8FAFC] border-t border-[#E5E7EB]"
      id="about"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-[56px]">
        
        <div className="grid grid-cols-12 gap-8 items-center">
          
          {/* Left Text */}
          <div className="col-span-12 lg:col-span-7 space-y-5">
            <p className="text-[13px] font-medium text-[#2563EB] uppercase tracking-wider mb-2">
              Mission & Governance
            </p>

            <h2 className="text-[28px] font-semibold tracking-tight text-[#111827] leading-snug">
              Democratizing Evidence-Based Medical Truth
            </h2>

            <p className="text-[15px] font-normal text-[#4B5563] leading-relaxed">
              In an era where unverified health claims spread rapidly across messaging platforms and social networks, TruthRx AI operates as an impartial clinical verification framework.
            </p>

            <p className="text-[14px] text-[#6B7280] leading-relaxed">
              We integrate generative language model reasoning with real-time indexing of peer-reviewed health references to enable healthcare organizations, providers, and consumers to verify health statements with speed and precision.
            </p>

            {/* Mission Pillar Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="ent-card flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[15px] font-semibold text-[#111827]">Clinical Standards</h4>
                  <p className="text-[13px] text-[#6B7280] mt-1 leading-snug">
                    Grounded strictly in peer-reviewed scientific consensus without commercial influence.
                  </p>
                </div>
              </div>

              <div className="ent-card flex items-start gap-3">
                <Globe2 className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[15px] font-semibold text-[#111827]">Plain-Language Synthesis</h4>
                  <p className="text-[13px] text-[#6B7280] mt-1 leading-snug">
                    Translates complex medical literature into clear, actionable summaries for patients and families.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Stats Box */}
          <div className="col-span-12 lg:col-span-5">
            <div className="ent-card space-y-6">
              <h3 className="text-[18px] font-semibold text-[#111827] pb-3 border-b border-[#E5E7EB]">
                Platform Metrics
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-[28px] font-semibold text-[#2563EB] tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-[12px] text-[#6B7280] font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] text-[12px] text-[#6B7280] leading-relaxed">
                TruthRx AI operates as an independent medical informational engine and adheres to global healthcare accuracy standards.
              </div>
            </div>
          </div>

        </div>

      </div>
    </motion.section>
  );
};
