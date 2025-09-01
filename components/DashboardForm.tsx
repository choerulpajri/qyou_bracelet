import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";

interface DashboardFormProps {
  user: any;
}

export default function DashboardForm({ user }: DashboardFormProps) {
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState<number | "">("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [twitter, setTwitter] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("supabase_id", user.id)
        .single();

      if (error) {
        console.error("Fetch user error:", error);
      } else if (data) {
        setNama(data.nama || "");
        setUmur(data.umur || "");
        setBio(data.bio || "");
        setInstagram(data.instagram || "");
        setTiktok(data.tiktok || "");
        setTwitter(data.twitter || "");
        setFotoUrl(data.foto_profil || null);
      }
    };

    getUserData();
  }, [user.id]);

  // Kompres gambar
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (e) => {
        if (!e.target?.result) return;
        img.src = e.target.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const maxWidth = 800;
        const scale = Math.min(maxWidth / img.width, 1);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.9;

        const tryCompress = (): void => {
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          const byteString = atob(dataUrl.split(",")[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: "image/jpeg" });

          if (blob.size > 300 * 1024 && quality > 0.1) {
            quality -= 0.05;
            tryCompress();
          } else {
            resolve(new File([blob], "profile.jpg", { type: "image/jpeg" }));
          }
        };

        tryCompress();
      };
    });
  };

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      let processedFile = file;

      if (file.size > 300 * 1024) {
        setLoading(true);
        processedFile = await compressImage(file);
        setLoading(false);
      }

      setFotoFile(processedFile);

      // Preview langsung
      const objectUrl = URL.createObjectURL(processedFile);
      setFotoUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    let uploadedFotoUrl = fotoUrl;

    if (fotoFile) {
      const fileName = `${user.id}.jpg`;

      const { error: uploadError, data } = await supabase.storage
        .from("profile_pics")
        .upload(fileName, fotoFile, {
          cacheControl: "0",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Gagal upload foto: " + uploadError.message);
        setLoading(false);
        return;
      }

      // Dapatkan URL publik
      const { data: urlData } = supabase.storage
        .from("profile_pics")
        .getPublicUrl(fileName);

      uploadedFotoUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    }

    // Update data user
    const { error: updateError } = await supabase
      .from("users")
      .update({
        nama,
        umur: umur === "" ? null : umur,
        bio,
        instagram,
        tiktok,
        twitter,
        foto_profil: uploadedFotoUrl,
      })
      .eq("supabase_id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      alert("Gagal memperbarui profil: " + updateError.message);
    } else {
      alert("🎉 Profil berhasil diperbarui!");
      setFotoUrl(uploadedFotoUrl);
    }

    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100"
    >
      {/* Judul Form */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Profil Anda</h2>
        <p className="text-gray-500 text-sm">Informasi ini akan muncul saat QR Anda dipindai.</p>
      </div>

      {/* Nama */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Contoh: Budi Santoso"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
            required
          />
          <span className="absolute right-3 top-3.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Umur */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Umur</label>
        <input
          type="number"
          placeholder="Contoh: 25"
          value={umur}
          onChange={(e) =>
            setUmur(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          placeholder="Ceritakan tentang dirimu... (opsional)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white/80"
        />
      </div>

      {/* Sosial Media */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Tautan Sosial Media</h3>
        {[
          { key: 'instagram', label: 'Instagram', icon: 'IG', placeholder: '@username' },
          { key: 'tiktok', label: 'TikTok', icon: 'TT', placeholder: '@username' },
          { key: 'twitter', label: 'X (Twitter)', icon: '𝕏', placeholder: '@username' },
        ].map((social) => (
          <div key={social.key}>
            <label className="block text-sm text-gray-600 mb-1">{social.label}</label>
            <input
              type="text"
              placeholder={social.placeholder}
              value={social.key === 'instagram' ? instagram : social.key === 'tiktok' ? tiktok : twitter}
              onChange={(e) => {
                if (social.key === 'instagram') setInstagram(e.target.value);
                if (social.key === 'tiktok') setTiktok(e.target.value);
                if (social.key === 'twitter') setTwitter(e.target.value);
              }}
              className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
            />
          </div>
        ))}
      </div>

      {/* Foto Profil */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  ?
                </div>
              )}
            </div>
            {loading && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <label className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-sm hover:shadow cursor-pointer transition-all duration-200 flex items-center gap-2 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Pilih Foto
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          JPEG/PNG, maks 300 KB (otomatis dikompresi)
        </p>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Menyimpan...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Simpan Profil</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
}