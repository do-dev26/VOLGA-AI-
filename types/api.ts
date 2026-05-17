export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ClaudeAnalysisRequest {
  headers: string[];
  sampleRows: string[][];
  totalRows: number;
  fileName: string;
}

export interface ClaudeAnalysisResponse {
  overallScore: number;
  summary: string;
  findings: import('./analysis').Finding[];
  recommendations: import('./analysis').Recommendation[];
  patterns: import('./analysis').Pattern[];
  columnInsights: import('./analysis').ColumnInsight[];
}

export interface ProxyRequest {
  model: string;
  max_tokens: number;
  system?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}
