import React from 'react';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import anatomyImage from '../assets/images/human_anatomy_hero_1785308184791.jpg';

interface HeroProps {
  onVerifyClick: () => void;
  onLearnMoreClick: () => void;
}

const easeCurve = [0.22, 1, 0.36, 1] as const;

export const Hero: React.FC<HeroProps> = ({ onVerifyClick, onLearnMoreClick }) => {
  return (
    <section className="relative pt-[120px] pb-[80px] bg-white dark:bg-[#0b0f17] transition-colors duration-300 overflow-hidden min-h-[640px] flex items-center" id="home">
      {/* Subtle Background Anatomy Image Integration */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.20, x: 0 }}
        transition={{ duration: 1, ease: easeCurve }}
        className="absolute top-0 right-0 w-full lg:w-[58%] xl:w-[56%] h-full pointer-events-none opacity-[0.20] lg:opacity-[0.25] overflow-hidden flex items-center justify-start lg:justify-center"
      >
        <img
          src={anatomyImage}
          alt=""
          className="h-full w-auto object-cover object-center max-w-none transform -translate-x-6 lg:-translate-x-16 xl:-translate-x-20 filter grayscale contrast-125 mix-blend-multiply dark:mix-blend-lighten transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#0b0f17] dark:via-[#0b0f17]/80" />
      </motion.div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full relative z-10">
        <div className="grid grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Content (Text-focused, clean, calm) */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-7 space-y-6">
            
            {/* Enterprise Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeCurve, delay: 0.05 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC] dark:bg-gray-800/80 border border-[#E5E7EB] dark:border-gray-700 text-[13px] font-medium text-[#4B5563] dark:text-gray-300"
            >
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>Enterprise Medical Claim Verification Engine</span>
            </motion.div>

            {/* Hero Heading: 42px, SemiBold, line-height 1.15, max-width 540px */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeCurve, delay: 0.15 }}
              className="text-[42px] font-semibold text-[#111827] dark:text-white leading-[1.15] max-w-[540px] tracking-tight"
              id="hero-headline"
            >
              Verify Health Information Before You Share It
            </motion.h1>

            {/* Hero Description: 17px, Regular, max-width 560px */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeCurve, delay: 0.25 }}
              className="text-[17px] font-normal text-[#4B5563] dark:text-gray-300 leading-relaxed max-w-[560px]"
              id="hero-supporting-text"
            >
              TruthRx AI cross-references medical claims, clinical trial notes, and health messages against peer-reviewed literature and WHO guidelines in seconds.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeCurve, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3 pt-2"
              id="hero-actions"
            >
              <button
                onClick={onVerifyClick}
                className="btn-primary"
                id="hero-primary-verify-btn"
              >
                <Shield className="w-4 h-4" />
                <span>Verify a Claim</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onLearnMoreClick}
                className="btn-secondary"
                id="hero-secondary-learn-btn"
              >
                <span>Learn More</span>
              </button>
            </motion.div>

            {/* Trust Markers */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeCurve, delay: 0.45 }}
              className="pt-6 border-t border-[#E5E7EB] dark:border-gray-800 flex flex-wrap items-center gap-6 text-[14px] text-[#4B5563] dark:text-gray-300"
              id="hero-trust-badges"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                <span>PubMed & WHO Indexed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                <span>Multi-language Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                <span>HIPAA-Compliant Auditing</span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};
