import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'VOLGA AI — Intelligent Data Cleaning',
  description: 'AI-powered CSV & Excel data cleaning, analysis, and quality scoring platform.',
  icons: { icon: '/icons/favicon.svg' },
  openGraph: {
    title: 'VOLGA AI',
    description: 'AI-powered data cleaning platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111113',
                color: '#ffffff',
                border: '0.5px solid #1f1f22',
                borderRadius: '10px',
                fontSize: '13px',
                fontFamily: 'Space Grotesk, system-ui, sans-serif',
              },
              success: {
                iconTheme: { primary: '#00f5aa', secondary: '#09090b' },
              },
              error: {
                iconTheme: { primary: '#f87171', secondary: '#09090b' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
