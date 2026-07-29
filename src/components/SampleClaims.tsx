import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRight, MessageSquare, Image as ImageIcon, Mic } from 'lucide-react';
import { motion } from 'motion/react';
import { SampleClaim } from '../types';

interface SampleClaimsProps {
  onSelectClaim: (claimText: string, category: 'whatsapp' | 'screenshot' | 'voicenote' | 'text') => void;
}

const easeCurve = [0.22, 1, 0.36, 1] as const;

export const SampleClaims: React.FC<SampleClaimsProps> = ({ onSelectClaim }) => {
  const sampleClaims: SampleClaim[] = [
    {
      id: '1',
      title: 'Garlic Water for Type 2 Diabetes',
      claim: 'Boiled garlic water drank every morning cures Type 2 diabetes in 30 days.',
      category: 'whatsapp',
      verdict: 'MISLEADING',
      trustScore: 28,
      previewSnippet: 'Allicin possesses antioxidant properties, but zero randomized clinical trials support garlic water as a replacement for glycemic control or insulin therapy.',
    },
    {
      id: '2',
      title: 'Alkaline Water and Viral Neutralization',
      claim: 'Drinking hot lemon water raises body pH to 8.5 and neutralizes respiratory viruses.',
      category: 'text',
      verdict: 'FALSE',
      trustScore: 12,
      previewSnippet: 'Renal and respiratory physiology strictly regulate systemic blood pH at 7.35–7.45. Gastric acid immediately neutralizes ingested beverage pH.',
    },
    {
      id: '3',
      title: 'High Vitamin C Dosing for Tumors',
      claim: 'Taking 10,000mg synthetic Vitamin C daily acts as a natural chemotherapy.',
      category: 'screenshot',
      verdict: 'FALSE',
      trustScore: 15,
      previewSnippet: 'Megadosing Vitamin C does not resolve tumor progression and presents clinical risks of hyperoxaluria, nephrolithiasis, and gastrointestinal distress.',
    },
    {
      id: '4',
      title: 'Raw Honey Application on Severe Burns',
      claim: 'Applying raw unpasteurized honey directly to third-degree open burns prevents all infection.',
      category: 'voicenote',
      verdict: 'MISLEADING',
      trustScore: 42,
      previewSnippet: 'Medical-grade sterile honey is utilized in specialized burn wound dressings, but raw unsterilized honey introduces Clostridium botulinum spore risks.',
    },
  ];

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'FALSE':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
        };
      case 'MISLEADING':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
        };
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          bg: 'bg-blue-50 text-[#2563EB] border-blue-200',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'whatsapp': return <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'screenshot': return <ImageIcon className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'voicenote': return <Mic className="w-3.5 h-3.5 text-[#2563EB]" />;
      default: return <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />;
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: easeCurve }}
      className="py-16 bg-[#F8FAFC] dark:bg-[#0f172a] border-t border-[#E5E7EB] dark:border-gray-800/80 transition-colors duration-300"
      id="sample-claims-section"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <p className="text-[13px] font-medium text-[#2563EB] dark:text-blue-400 uppercase tracking-wider mb-2">
            Verification Library
          </p>
          <h2 className="text-[28px] font-semibold tracking-tight text-[#111827] dark:text-white mb-3">
            Recent Medical Claim Analyses
          </h2>
          <p className="text-[15px] font-normal text-[#6B7280] dark:text-gray-400 leading-relaxed">
            Select an archived claim below to examine clinical literature sources, physiological mechanisms, and WHO reference citations.
          </p>
        </div>

        {/* Claims Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleClaims.map((item, idx) => {
            const verdictBadge = getVerdictBadge(item.verdict);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: easeCurve, delay: idx * 0.08 }}
                onClick={() => onSelectClaim(item.claim, item.category as any)}
                className="ent-card cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Category & Verdict Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#6B7280] dark:text-gray-300 bg-[#F8FAFC] dark:bg-gray-800/80 px-2.5 py-1 rounded-md border border-[#E5E7EB] dark:border-gray-700">
                      {getCategoryIcon(item.category)}
                      <span className="capitalize">{item.category} Input</span>
                    </div>

                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[12px] font-medium ${verdictBadge.bg}`}>
                      {verdictBadge.icon}
                      <span>{item.verdict} ({item.trustScore}%)</span>
                    </div>
                  </div>

                  <h3 className="text-[18px] font-semibold text-[#111827] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors duration-200 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-[13px] text-[#4B5563] dark:text-gray-300 bg-[#F8FAFC] dark:bg-gray-800/60 p-3 rounded-lg border border-[#E5E7EB] dark:border-gray-700/80 mb-4">
                    "{item.claim}"
                  </p>

                  <p className="text-[14px] text-[#6B7280] dark:text-gray-400 leading-relaxed">
                    {item.previewSnippet}
                  </p>
                </div>

                {/* Bottom Action Line */}
                <div className="pt-4 mt-6 border-t border-[#E5E7EB] dark:border-gray-800 flex items-center justify-between text-[13px] font-medium text-[#2563EB] dark:text-blue-400">
                  <span>Review Clinical Evidence</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200 ease-out" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </motion.section>
  );
};
