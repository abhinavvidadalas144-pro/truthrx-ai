export type NavSection = 'home' | 'health-assistant' | 'features' | 'how-it-works' | 'faq' | 'about';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
  urgencyLevel?: 'Low' | 'Routine' | 'Prompt' | 'Emergency';
  assessmentConfidence?: 'High' | 'Moderate' | 'Low';
  possibleConditions?: Array<{
    name: string;
    likelihood: 'High' | 'Moderate' | 'Low';
    percentage?: number;
    reasoning: string;
  }>;
  recommendedNextSteps?: string[];
  redFlagSymptoms?: string[];
  recommendedSpecialist?: string;
  followUpQuestions?: string[];
  suggestedActions?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export type AuthView = 'login' | 'register' | 'forgot-password' | 'verification' | 'account-created';

export interface UserProfile {
  name: string;
  email: string;
  country?: string;
  language?: string;
  role?: string;
}

export type ClaimCategory = 'whatsapp' | 'screenshot' | 'voicenote' | 'text';

export type ClaimVerdict = 'FALSE' | 'MISLEADING' | 'UNPROVEN' | 'VERIFIED';

export interface MedicalCitation {
  title: string;
  source: 'WHO' | 'Mayo Clinic' | 'PubMed / NIH' | 'CDC' | 'The Lancet' | 'FDA';
  year: string;
  summary: string;
  url?: string;
}

export interface VerificationResult {
  claimText: string;
  verdict: ClaimVerdict;
  trustScore: number; // 0 - 100
  verdictTitle: string;
  summaryText: string;
  keyFacts: string[];
  medicalExplanation: string;
  citations: MedicalCitation[];
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  recommendedAction: string;
  category: ClaimCategory;
}

export interface SampleClaim {
  id: string;
  title: string;
  claim: string;
  category: string;
  verdict: ClaimVerdict;
  trustScore: number;
  previewSnippet: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
