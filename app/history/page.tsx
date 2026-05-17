'use client';
import { Navbar } from '@/components/navbar/Navbar';
import { HistoryList } from '@/components/dashboard/StatsCards';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/ui/Card';

export default function HistoryPage() {
  const { user, loading } = useAuth(true);
  if (loading) return <Loader fullscreen text="Loading…" />;
  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <main className="pt-14">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-black mb-6">Analysis History</h1>
          <HistoryList userId={user?.uid ?? ''} limit={50} />
        </div>
      </main>
    </div>
  );
}
