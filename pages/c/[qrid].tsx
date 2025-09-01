import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";

export default function ClaimQR() {
  const router = useRouter();
  const { qrid } = router.query;
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false); // tetap pakai state ini seperti aslinya

  useEffect(() => {
    if (!qrid) return;

    const checkClaim = async () => {
      // Cek apakah QR ID sudah ada di tabel users
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("qrid", qrid)
        .single();

      if (!error && data) {
        // Sudah diklaim → redirect ke halaman publik
        router.replace(`/u/${qrid}`);
      } else {
        // Belum diklaim → tampilkan tombol klaim
        setClaimed(false);
      }
      setLoading(false);
    };

    checkClaim();
  }, [qrid, router]);

  const handleClaim = () => {
    // Redirect ke halaman register dengan QR ID
    router.push(`/register?qrid=${qrid}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Memeriksa QR Code...</p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* === DESAIN PREMIUM, LOGIKA TETAP ASLI === */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-6 text-white text-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 5, 0] }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 4 }}
              className="inline-block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-black">Klaim QR Anda</h1>
            <p className="opacity-90">Aktifkan identitas digital Anda</p>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">ID QR</p>
              <code className="inline-block px-4 py-2 bg-gray-100 text-gray-800 rounded-xl font-mono text-lg border border-gray-200 shadow-sm">
                {qrid}
              </code>
            </div>

            <p className="text-gray-600 text-center leading-relaxed">
              QR ini <strong>belum diklaim</strong>. Dengan mengklaim, Anda bisa:
            </p>

            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Menautkan identitas digital Anda
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Menampilkan bio, sosial media, dan kontak
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Digunakan untuk jaringan, acara, atau darurat
              </li>
            </ul>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClaim}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Klaim Sekarang
            </motion.button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Dimiliki oleh Qyou Bracelet • Aman & Terenkripsi
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}