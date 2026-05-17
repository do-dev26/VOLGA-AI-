import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xs text-[#52525b] hover:text-white mb-8 inline-block">← Home</Link>
        <h1 className="text-3xl font-black mb-4">Terms of Service</h1>
        <p className="text-[#71717a] leading-relaxed">By using VOLGA AI you agree to use the service responsibly and not upload files containing sensitive personal data without appropriate consent. Full terms coming soon.</p>
      </div>
    </div>
  );
}
