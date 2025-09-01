
// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';

/**
 * Komponen utama aplikasi Next.js
 * File ini membungkus semua halaman dengan komponen yang sama (seperti Layout, Theme, dll)
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}