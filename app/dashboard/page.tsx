'use client'
import { useState } from 'react'
import { Navbar } from '@/components/navbar/Navbar'
import { UploadBox } from '@/components/upload/UploadBox'
import { UploadProgress } from '@/components/upload/UploadProgress'
import { FilePreview } from '@/components/upload/FilePreview'
import { AnalysisPanel } from '@/components/analysis/AnalysisPanel'
import { StatsCards, UsageCard, HistoryList } from '@/components/dashboard/StatsCards'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useUpload } from '@/hooks/useUpload'
import { useAnalysis } from '@/hooks/useAnalysis'
import { Loader } from '@/components/ui/Card'
import { Sparkles, RotateCcw, Lock } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, backendUser, loading: authLoading } = useAuth(true)
  const {
    file, parsedData, uploadResult,
    status: uploadStatus, progress, error: uploadError,
    upload, reset: resetUpload,
  } = useUpload()
  const { result, loading: analyzing, error: analysisError, analyze, reset: resetAnalysis } = useAnalysis()
  const [view, setView] = useState<'upload' | 'preview' | 'analysis'>('upload')

  if (authLoading) return <Loader fullscreen text="Loading…" />

  const isPro   = backendUser?.plan === 'pro'
  const limits  = backendUser?.limits
  const canAnalyze = limits?.ai_analysis ?? false

  const handleFile = async (f: File) => {
    resetAnalysis()
    await upload(f)
    setView('preview')
  }

  const handleAnalyze = async () => {
    if (!parsedData || !file) return
    if (!canAnalyze) return
    setView('analysis')
    await analyze(parsedData, file.name, uploadResult?.file_id)
  }

  const handleReset = () => {
    resetUpload(); resetAnalysis(); setView('upload')
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <main className="pt-14">
        <div className="max-w-screen-xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black mb-1">
                Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
              </h1>
              <p className="text-sm text-[#71717a]">
                Upload a CSV or Excel file to analyze data quality.
              </p>
            </div>
            {backendUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1f1f22] bg-[#111113]">
                <span className="text-[10px] text-[#52525b]">Plan</span>
                <span className={`text-xs font-bold ${isPro ? 'text-[#00f5aa]' : 'text-[#71717a]'}`}>
                  {backendUser.plan.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-4">

              {view === 'upload' && (
                <div className="card p-5 space-y-4">
                  <h2 className="font-semibold text-sm">Analyze a file</h2>
                  <UploadBox onFile={handleFile} maxSizeMB={limits?.max_rows === -1 ? 50 : 10} />
                  {!isPro && (
                    <p className="text-[11px] text-[#52525b] text-center">
                      Free plan: up to {backendUser?.limits.files_per_month ?? 5} files/month ·{' '}
                      <Link href="/pricing" className="text-[#00f5aa] hover:underline">Upgrade for unlimited</Link>
                    </p>
                  )}
                </div>
              )}

              {(view === 'preview' || view === 'analysis') && (
                <>
                  <UploadProgress
                    status={analyzing ? 'analyzing' : uploadStatus}
                    progress={progress}
                    fileName={file?.name}
                  />

                  {view === 'preview' && parsedData && (
                    <div className="space-y-4 animate-in">
                      <FilePreview data={parsedData} />
                      <div className="flex gap-3">
                        {canAnalyze ? (
                          <Button
                            onClick={handleAnalyze}
                            loading={analyzing}
                            icon={<Sparkles size={14} />}
                            size="lg"
                            className="flex-1"
                          >
                            Analyze with AI
                          </Button>
                        ) : (
                          <Link href="/pricing" className="flex-1">
                            <button className="w-full h-11 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-[rgba(0,245,170,0.3)] bg-[rgba(0,245,170,0.06)] text-[#00f5aa] hover:bg-[rgba(0,245,170,0.12)] transition-colors">
                              <Lock size={14} /> Upgrade for AI Analysis
                            </button>
                          </Link>
                        )}
                        <Button variant="ghost" onClick={handleReset} icon={<RotateCcw size={14} />}>
                          Reset
                        </Button>
                      </div>
                    </div>
                  )}

                  {view === 'analysis' && (
                    <>
                      {analyzing && <Loader text="AI is analyzing your data…" />}
                      {result && (
                        <div className="space-y-4 animate-in">
                          <AnalysisPanel result={result} />
                          <Button variant="ghost" onClick={handleReset} icon={<RotateCcw size={14} />}>
                            Analyze another file
                          </Button>
                        </div>
                      )}
                      {analysisError && (
                        <div className="card border-[rgba(248,113,113,0.2)] bg-[rgba(248,113,113,0.05)] p-4">
                          <p className="text-sm text-[#f87171]">{analysisError}</p>
                          <Button variant="ghost" onClick={handleReset} className="mt-3" size="sm">
                            Try again
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <StatsCards userId={user?.uid ?? ''} />
              {backendUser && (
                <UsageCard
                  filesUsedMonth={backendUser.files_used_month}
                  limit={backendUser.limits.files_per_month}
                  plan={backendUser.plan}
                />
              )}
              <HistoryList userId={user?.uid ?? ''} limit={5} compact />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
