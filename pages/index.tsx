import Layout from "../components/Layout";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.5,
      },
    },
  };

  // ✅ Perbaikan: Gunakan `as const` agar ease dikenali sebagai tuple
  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 0.03, 0.26, 1] as [number, number, number, number], // ✅ Fix: Cast sebagai tuple
      },
    },
  };

  const buttonVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        delay: 1.1,
      },
    },
  };

  return (
    <Layout>
      {/* Background: Gradient lembut + tekstur halus */}
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center overflow-hidden">
        
        {/* Abstrak Dekoratif – Partikel Halus */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mix-blend-multiply blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-indigo-100 to-cyan-100 rounded-full mix-blend-multiply blur-3xl opacity-60 animate-pulse delay-1000"></div>
          {/* Grid halus */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(120, 180, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(120, 180, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>

        {/* Konten Utama – Dengan Animasi Bertahap */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-6xl mx-auto py-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tagline Kecil (Subheading) */}
          <motion.div
            variants={itemVariants}
            className="text-sm md:text-base font-semibold text-blue-600 tracking-wider uppercase mb-4"
          >
            🌐 Where Identity Meets Innovation
          </motion.div>

          {/* Judul Utama – Gradient + Shadow Depth */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6 max-w-4xl mx-auto"
          >
            <span className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 bg-clip-text text-transparent">
              Qyou Bracelet:
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-700 to-blue-600 bg-clip-text text-transparent font-extrabold tracking-tight">
              One Scan, Infinite Connections
            </span>
          </motion.h1>

          {/* Deskripsi – Typo sempurna, breathing space */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed tracking-wide"
          >
            Gelang QR unik yang mengubah identitasmu menjadi pengalaman digital yang hidup.
            Tunjukkan siapa kamu — <span className="font-semibold text-gray-800">tanpa berkata sepatah pun.</span>
            Untuk jaringan, acara, darurat, atau sekadar berbagi diri.
          </motion.p>

          {/* Tombol Aksi – Dengan Animasi Framer Motion */}
          <motion.div
            variants={buttonVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-5 mt-8"
          >
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform tracking-wide"
              >
                Masuk ke Akun
              </motion.button>
            </Link>

            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#f8fafc", borderColor: "#94a3b8" }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-white text-blue-700 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl border border-blue-100 transition-all duration-300 transform tracking-wide"
              >
                🛠️ Buat Gelang Digital
              </motion.button>
            </Link>

            <Link href="/u/demo">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#f1f5f9", color: "#1e293b" }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-5 bg-gray-50 text-gray-700 font-medium text-lg rounded-2xl shadow-md hover:shadow-lg border border-gray-200 transition-colors duration-300 tracking-wide flex items-center justify-center gap-2"
              >
                <span>📱 Lihat Demo Profil</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Badges – Informasi Kunci (Micro UX) */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap justify-center items-center gap-4 text-sm"
          >
            <span className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-green-700 px-4 py-2 rounded-full font-medium shadow-sm border border-green-100">
              ✅ Personal QR Identity
            </span>
            <span className="hidden md:inline text-gray-400">•</span>
            <span className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-purple-700 px-4 py-2 rounded-full font-medium shadow-sm border border-purple-100">
              🔗 Real World & Digital Bridge
            </span>
            <span className="hidden md:inline text-gray-400">•</span>
            <span className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full font-medium shadow-sm border border-blue-100">
              🚀 Instant Networking
            </span>
          </motion.div>
        </motion.div>

        {/* Animasi Scroll Indicator – Halus dan Elegan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs text-gray-500 font-medium tracking-wider">SCROLL TO EXPLORE</p>
            <div className="w-6 h-10 relative border-2 border-gray-300 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-1.5 bg-gray-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Ilustrasi Produk (Opsional – bisa diganti dengan gambar gelang nanti) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute top-16 right-10 w-48 h-48 hidden lg:block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl opacity-30"></div>
            <div className="relative w-48 h-48 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}