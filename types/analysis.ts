export interface AnalysisResult {
  id: string;
  fileName: string;
  fileSize: number;
  rowCount: number;
  columnCount: number;
  analysisDate: Date;
  overallScore: number;
  summary: AnalysisSummary;
  columns: ColumnInsight[];
  findings: Finding[];
  anomalies: Anomaly[];
  recommendations: Recommendation[];
  patterns: Pattern[];
}

export interface AnalysisSummary {
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  nullPercentage: number;
  duplicateRows: number;
  dataTypes: Record<string, number>;
}

export interface ColumnInsight {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'mixed' | 'unknown';
  nullCount: number;
  nullPercentage: number;
  uniqueCount: number;
  uniquePercentage: number;
  sampleValues: string[];
  issues: string[];
  score: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  std?: number;
}

export interface Finding {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'null_values' | 'duplicates' | 'type_mismatch' | 'outliers' | 'formatting' | 'consistency';
  title: string;
  description: string;
  affectedColumns: string[];
  affectedRows: number;
  fixable: boolean;
}

export interface Anomaly {
  id: string;
  type: 'outlier' | 'spike' | 'gap' | 'pattern_break';
  column: string;
  rowIndex: number;
  value: string | number;
  expectedRange?: [number, number];
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  description: string;
  estimatedImpact: string;
  autoFixable: boolean;
  affectedColumns: string[];
}

export interface Pattern {
  id: string;
  type: 'email' | 'phone' | 'date' | 'url' | 'id' | 'currency' | 'percentage' | 'custom';
  column: string;
  matchPercentage: number;
  format: string;
  violations: number;
}

export type AnalysisStatus = 'idle' | 'uploading' | 'parsing' | 'analyzing' | 'complete' | 'error';

export interface UploadedFile {
  file: File;
  preview: ParsedData;
}

export interface ParsedData {
  headers: string[];
  rows: string[][];
  totalRows: number;
}
