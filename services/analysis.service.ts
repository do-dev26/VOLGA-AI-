import { getToken } from '@/lib/token'
import type { AnalysisResult, ParsedData } from '@/types/analysis'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

function computeColStats(headers: string[], rows: string[][]): Record<string, object> {
  const stats: Record<string, object> = {}
  headers.forEach((name, i) => {
    const values   = rows.map(r => r[i] ?? '')
    const nonEmpty = values.filter(Boolean)
    const nums     = nonEmpty.map(Number).filter(n => !isNaN(n))
    const isNum    = nums.length > nonEmpty.length * 0.8
    stats[name] = {
      dtype:        isNum ? 'numeric' : 'string',
      null_count:   values.length - nonEmpty.length,
      unique_count: new Set(nonEmpty).size,
      ...(isNum && nums.length > 0 ? {
        mean: parseFloat((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)),
        min: Math.min(...nums), max: Math.max(...nums),
      } : { top_values: [...new Set(nonEmpty)].slice(0, 5) }),
    }
  })
  return stats
}

class AnalysisService {
  async analyze(data: ParsedData, fileName: string, fileId = 'local'): Promise<AnalysisResult> {
    const token    = await getToken()
    const sample   = data.rows.slice(0, 5)
    const colStats = computeColStats(data.headers, data.rows)
    const csvSample = [data.headers, ...sample].map(r => r.join(',')).join('\n')

    const res = await fetch(`${BACKEND_URL}/api/analyse/run`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_id:    fileId,
        csv_sample: csvSample,
        col_stats:  colStats,
        total_rows: data.totalRows,
        total_cols: data.headers.length,
        file_name:  fileName,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail ?? 'Analysis fail ho gayi')
    }

    const { parsed } = await res.json()

    // Backend response → frontend AnalysisResult type
    return {
      id:           Math.random().toString(36).slice(2),
      fileName,
      fileSize:     0,
      rowCount:     data.totalRows,
      columnCount:  data.headers.length,
      analysisDate: new Date(),
      overallScore: parsed.data_quality_score ?? 70,
      summary: {
        totalIssues:    parsed.anomalies?.length ?? 0,
        criticalIssues: parsed.anomalies?.filter((a: any) => a.severity === 'high').length ?? 0,
        warningIssues:  parsed.anomalies?.filter((a: any) => a.severity === 'medium').length ?? 0,
        infoIssues:     parsed.anomalies?.filter((a: any) => a.severity === 'low').length ?? 0,
        nullPercentage: 0,
        duplicateRows:  0,
        dataTypes:      {},
      },
      columns: parsed.column_insights?.map((c: any) => ({
        name: c.column, type: c.type ?? 'string',
        nullCount: 0, nullPercentage: 0,
        uniqueCount: 0, uniquePercentage: 0,
        sampleValues: [], issues: [c.insight ?? ''],
        score: c.health === 'good' ? 90 : c.health === 'warning' ? 60 : 30,
      })) ?? [],
      findings: parsed.key_findings?.map((f: string, i: number) => ({
        id: `f${i}`, severity: 'info' as const, category: 'general',
        title: f, description: f, affectedColumns: [], affectedRows: 0, fixable: false,
      })) ?? [],
      anomalies: parsed.anomalies?.map((a: any, i: number) => ({
        id: `a${i}`, type: a.type ?? 'outlier',
        column: a.columns_affected?.[0] ?? '',
        rowIndex: 0, value: '',
        description: a.description,
        severity: a.severity === 'high' ? 'high' : a.severity === 'medium' ? 'medium' : 'low',
      })) ?? [],
      recommendations: parsed.business_recommendations?.map((r: any, i: number) => ({
        id: `r${i}`, priority: r.priority ?? 'medium',
        action: r.title, description: r.description,
        estimatedImpact: r.impact, autoFixable: false, affectedColumns: [],
      })) ?? [],
      patterns: parsed.patterns_detected?.map((p: any, i: number) => ({
        id: `p${i}`, type: 'custom' as const,
        column: p.columns?.[0] ?? '',
        matchPercentage: 100, format: p.pattern,
        violations: 0,
      })) ?? [],
    }
  }
}

export const analysisService = new AnalysisService()
