// pages/confirm-email.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient"; // sesuaikan path jika beda

export default function ConfirmEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "no-token"
  >("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Hanya jalankan di client
    if (typeof window === "undefined") return;

    // Utility: parse both query (?access_token=...) and hash (#access_token=...)
    const parseTokensFromUrl = () => {
      const url = new URL(window.location.href);
      const query = url.searchParams;
      // check query first
      const accessTokenQ = query.get("access_token");
      const refreshTokenQ = query.get("refresh_token");

      // parse hash (if Supabase returns in fragment like #access_token=...&refresh_token=...)
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.substring(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);
      const accessTokenH = hashParams.get("access_token");
      const refreshTokenH = hashParams.get("refresh_token");

      return {
        access_token: accessTokenQ ?? accessTokenH,
        refresh_token: refreshTokenQ ?? refreshTokenH,
      };
    };

    const doConfirm = async () => {
      try {
        const { access_token, refresh_token } = parseTokensFromUrl();

        if (!access_token) {
          setStatus("no-token");
          setMessage(
            "Token tidak ditemukan di URL. Pastikan kamu membuka link konfirmasi yang dikirim lewat email."
          );
          return;
        }

        // setSession expects an object { access_token, refresh_token }
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token: refresh_token || "",
        });

        if (error) {
          console.error("supabase.setSession error:", error);
          setStatus("error");
          setMessage(
            `Gagal mengonfirmasi email: ${error.message}. Coba buka link lagi atau hubungi admin.`
          );
          return;
        }

        // optionally verify user object
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.warn("supabase.getUser warning:", userError);
          // tetap anggap sukses jika session sudah diset
        } else {
          console.log("User after setSession:", userData?.user ?? userData);
        }

        setStatus("success");
        setMessage("Email berhasil dikonfirmasi. Kamu akan diarahkan...");

        // redirect after short delay
        setTimeout(() => {
          router.replace("/dashboard"); // ubah target redirect sesuai rute kamu
        }, 1500);
      } catch (err: any) {
        console.error(err);
        setStatus("error");
        setMessage(
          `Terjadi kesalahan saat memproses konfirmasi: ${err?.message ?? err}`
        );
      }
    };

    doConfirm();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Konfirmasi Email</h1>

        {status === "loading" && (
          <>
            <p className="text-gray-600 mb-6">Memproses konfirmasi... Mohon tunggu.</p>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
          </>
        )}

        {status === "no-token" && (
          <>
            <p className="text-red-600 mb-4">{message}</p>
            <p className="text-sm text-gray-600">
              Jika kamu membuka link dari email tapi tetap mendapat pesan ini, coba salin link penuh dari email dan buka di browser baru.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-red-600 mb-4 font-medium">Terjadi kesalahan</p>
            <p className="text-sm text-gray-700 mb-4">{message}</p>
            <button
              onClick={() => router.replace("/forgot-password")}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white"
            >
              Kirim ulang link reset / konfirmasi
            </button>
          </>
        )}

        {status === "success" && (
          <>
            <p className="text-green-600 mb-4 font-medium">Berhasil!</p>
            <p className="text-sm text-gray-700">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
