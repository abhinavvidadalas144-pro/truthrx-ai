import React from 'react';
import { Activity, Shield, HeartHandshake } from 'lucide-react';
import { NavSection } from '../types';

interface FooterProps {
  onNavigate: (section: NavSection) => void;
  onOpenVerifyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenVerifyModal }) => {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] pt-16 pb-12 text-[#6B7280] text-[14px]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-[56px] space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-[#2563EB] flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-[18px] font-semibold text-[#111827] tracking-tight">
                TruthRx AI
              </span>
            </div>
            
            <p className="text-[13px] text-[#6B7280] max-w-sm leading-relaxed">
              Democratizing evidence-based health fact-checking. Cross-referencing health claims against WHO, Mayo Clinic, PubMed, and CDC literature.
            </p>

            <div className="pt-1">
              <button
                onClick={onOpenVerifyModal}
                className="btn-secondary cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Verify a Claim</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[12px] font-semibold text-[#111827] uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#111827] transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-[#111827] transition-colors cursor-pointer">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-[#111827] transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#111827] transition-colors cursor-pointer">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#111827] transition-colors cursor-pointer">
                  About TruthRx AI
                </button>
              </li>
            </ul>
          </div>

          {/* Medical Sources */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[12px] font-semibold text-[#111827] uppercase tracking-wider">Indexed References</h4>
            <ul className="space-y-1.5 text-[13px] text-[#6B7280]">
              <li>• World Health Organization (WHO) Guidelines</li>
              <li>• Mayo Clinic Clinical Index</li>
              <li>• PubMed / National Institutes of Health (NIH)</li>
              <li>• Centers for Disease Control and Prevention (CDC)</li>
              <li>• The Lancet & FDA Health Bulletins</li>
            </ul>
          </div>

        </div>

        {/* Medical Disclaimer Callout */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[10px] p-4 flex items-start gap-3 text-[13px] text-[#6B7280] leading-relaxed">
          <HeartHandshake className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#111827]">Medical Disclaimer: </span>
            TruthRx AI is an automated informational engine designed to analyze health claims against clinical literature. It is not a substitute for formal medical advice, diagnosis, or treatment. Always consult a licensed healthcare provider regarding personal medical conditions.
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5E7EB] text-[12px] text-[#6B7280]">
          <div>
            &copy; {new Date().getFullYear()} TruthRx AI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#111827] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#111827] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#111827] cursor-pointer">Clinical Governance</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
