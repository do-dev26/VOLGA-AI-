export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  plan: UserPlan;
  credits: number;
  usage: UserUsage;
}

export interface UserPlan {
  id: string;
  name: string;
  uploadLimit: number;
  monthlyAnalyses: number;
  maxFileSizeMB: number;
  features: string[];
}

export interface UserUsage {
  analysesThisMonth: number;
  totalAnalyses: number;
  storageUsedMB: number;
  lastAnalysisDate: Date | null;
}

export interface HistoryItem {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  rowCount: number;
  columnCount: number;
  overallScore: number;
  analysisDate: Date;
  status: 'complete' | 'error' | 'processing';
  resultId: string;
}

// Backend (MongoDB) user response type
export interface BackendUser {
  id: string
  firebase_uid: string
  email: string
  name: string
  plan: 'free' | 'pro'
  subscription_status: 'created' | 'authenticated' | 'active' | 'halted' | 'cancelled' | null
  razorpay_subscription_id: string | null
  files_used_month: number
  has_cloudinary: boolean
  pro_since: string | null
  last_renewal_at: string | null
  limits: {
    files_per_month: number   // -1 = unlimited
    max_rows: number          // -1 = unlimited
    cloud: boolean
    pdf: boolean
    ai_analysis: boolean
  }
  created_at: string | null
}
