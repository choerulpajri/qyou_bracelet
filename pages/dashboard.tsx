import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import DashboardForm from "../components/DashboardForm";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push("/login");
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/login");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes (jika logout dari tempat lain)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard Anda...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-800">
      {/* Navbar/Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
              Qyou Dashboard
            </h1>
            <p className="text-sm text-gray-500">Halo, {user?.email?.split('@')[0]} 👋</p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Kelola Identitas Digital Anda
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Atur informasi yang muncul saat seseorang <strong>memindai QR gelang Anda</strong>. 
              Tunjukkan jati diri, jejaring, atau pesan penting — dengan satu sentuhan.
            </p>
          </div>

          {/* Dashboard Form Card */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="p-8">
              {user ? (
                <DashboardForm user={user} />
              ) : (
                <p className="text-gray-500 text-center py-6">Tidak ada pengguna yang ditemukan.</p>
              )}
            </div>
          </div>

          {/* Quick Stats / Info Badge */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <div className="bg-white/60 backdrop-blur-sm border border-green-100 rounded-xl px-5 py-3 shadow-sm">
              <span className="text-green-700 font-medium text-sm">✅ QR Anda aktif</span>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-xl px-5 py-3 shadow-sm">
              <span className="text-blue-700 font-medium text-sm">🔗 Akses instan 24/7</span>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-purple-100 rounded-xl px-5 py-3 shadow-sm">
              <span className="text-purple-700 font-medium text-sm">🔐 Terenkripsi & Aman</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-500 text-sm pb-6">
        © {new Date().getFullYear()} Qyou Bracelet. Semua hak dilindungi.
      </footer>
    </div>
  );
}