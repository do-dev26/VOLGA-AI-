import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xs text-[#52525b] hover:text-white mb-8 inline-block">← Home</Link>
        <h1 className="text-3xl font-black mb-4">Contact</h1>
        <p className="text-[#71717a] mb-2">For support or inquiries, reach us at:</p>
        <a href="mailto:hello@volga.ai" className="text-[#00f5aa] hover:underline">hello@volga.ai</a>
      </div>
    </div>
  );
}
