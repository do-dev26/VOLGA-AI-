import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xs text-[#52525b] hover:text-white mb-8 inline-block">← Home</Link>
        <h1 className="text-3xl font-black mb-4">About VOLGA AI</h1>
        <p className="text-[#71717a] leading-relaxed mb-4">
          VOLGA AI is a modern data quality platform that uses AI to help teams clean, analyze, and trust their data.
        </p>
        <p className="text-[#71717a] leading-relaxed">
          Built for analysts, engineers, and anyone working with CSV or Excel files who needs fast, accurate quality scoring.
        </p>
      </div>
    </div>
  );
}
