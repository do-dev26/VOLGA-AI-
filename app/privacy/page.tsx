import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xs text-[#52525b] hover:text-white mb-8 inline-block">← Home</Link>
        <h1 className="text-3xl font-black mb-4">Privacy Policy</h1>
        <p className="text-[#71717a] leading-relaxed">Your data is never sold or shared. Files uploaded for analysis are processed in memory and not stored permanently without your consent. Full policy coming soon.</p>
      </div>
    </div>
  );
}
