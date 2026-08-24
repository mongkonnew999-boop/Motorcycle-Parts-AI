import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Motorcycle Parts AI', description: 'ผู้ช่วยวางแผนขายอะไหล่มอเตอร์ไซค์' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
