// pages/u/[qrid].tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Layout from "../../components/Layout";

interface User {
  nama: string;
  bio: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  foto_profil?: string;
}

interface SocialPreview {
  platform: "instagram" | "tiktok" | "twitter";
  username: string;
  url: string;
  status: "active" | "error" | "unavailable";
  message: string;
  icon: JSX.Element;
}

const PublicProfile: React.FC = () => {
  const router = useRouter();
  const { qrid } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [previews, setPreviews] = useState<SocialPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!qrid) return;

    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase
      .from("users") // jangan pakai generic kalau bikin error
      .select("*")
      .eq("qrid", qrid)
      .single<User>(); //

      if (error || !data) {
        setUser(null);
      } else {
        setUser(data);

        const socials: SocialPreview[] = [];

        if (data.instagram) {
          socials.push({
            platform: "instagram",
            username: data.instagram,
            url: `https://instagram.com/${data.instagram}`,
            status: "active",
            message: "See their Instagram stories and posts",
            icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C15.85 0 16.014.006 21.377.141 22.537.17 23.339 1.012 23.37 2.176c.032 1.164.024 1.86.024 6.914 0 5.076.008 5.77-.024 6.93-.03.98-.81 2.06-1.97 2.12-1.16.06-1.44.06-6.87.06h-5.53c-5.43 0-5.71 0-6.87-.06-1.16-.06-1.94-1.14-1.97-2.12-.03-1.16-.04-1.86-.04-6.93s.008-5.77.039-6.914c.031-1.164.814-2.006 1.974-2.035C6.164.006 6.328 0 12.017 0zm0 2.418c-5.6 0-6.11.02-8.19.126-1.21.06-1.79.67-1.85 1.87-.06 1.19-.07 1.72-.07 6.86s.01 5.67.07 6.86c.06 1.2.64 1.81 1.85 1.87 2.08.106 2.59.126 8.19.126 5.6 0 6.11-.02 8.19-.126 1.21-.06 1.79-.67 1.85-1.87.06-1.19.07-1.72.07-6.86s-.01-5.67-.07-6.86c-.06-1.2-.64-1.81-1.85-1.87-2.08-.106-2.59-.126-8.19-.126zM12.017 5.998a6.02 6.02 0 100 12.04 6.02 6.02 0 000-12.04zm0 10.44a4.42 4.42 0 110-8.84 4.42 4.42 0 010 8.84zm6.56-7.408a1.42 1.42 0 11-2.84 0 1.42 1.42 0 012.84 0z" />
              </svg>
            ),
          });
        }

        if (data.tiktok) {
          socials.push({
            platform: "tiktok",
            username: data.tiktok,
            url: `https://tiktok.com/@${data.tiktok}`,
            status: "unavailable",
            message: "TikTok is no longer available in this region",
            icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.52 0C12.22 2.45 10.76 4.48 8.53 5.28 10.17 7.11 12.52 8.09 15.04 7.84v3.32c-2.42.24-5.32 1.99-6.53 4.52-1.84 4.03-.5 8.77 2.01 10.92 1.22.99 2.74 1.5 4.33 1.5 1.71 0 3.41-.57 4.77-1.65.6-.48 1.44-.49 2.04-.02.6.48.83 1.34.51 2.13-1.7 4.02-6.18 6.16-10.47 5.13-6.5-1.56-9.87-8.63-7.93-15.11C2.84 10.84.75 8.18.12 5.07c-.6-2.95.83-5.93 3.53-7.48C6.15-.9 10.27-.48 12.52 2.48V0z" />
              </svg>
            ),
          });
        }

        if (data.twitter) {
          socials.push({
            platform: "twitter",
            username: data.twitter,
            url: `https://twitter.com/${data.twitter}`,
            status: "error",
            message: "Twitter may not load due to privacy extensions",
            icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.25 2.25h5.651l4.506 6.115L18.244 2.25zm-1.161 17.52h1.833L7.048 4.126h-1.833l11.866 15.648z" />
              </svg>
            ),
          });
        }

        setPreviews(socials);
      }
      setLoading(false);
    };

    fetchUser();
  }, [qrid]);

  if (loading)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );

  if (!user)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-sm">
            <h2 className="text-2xl font-bold text-gray-700">User Not Found</h2>
            <p className="text-gray-500 mt-2">The profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-md mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:shadow-2xl">
            {/* Cover-like Top */}
            <div className="h-20 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600"></div>

            <div className="text-center -mt-16 relative">
              {/* Profile Picture */}
              {user.foto_profil ? (
                <img
                  src={user.foto_profil}
                  alt={user.nama}
                  className="w-32 h-32 mx-auto border-4 border-white rounded-full shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 mx-auto border-4 border-white rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user.nama.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Name & Bio */}
              <div className="mt-6 px-6 pb-6">
                <h1 className="text-3xl font-extrabold text-gray-800">{user.nama}</h1>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">{user.bio || "No bio provided"}</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="px-6 pb-6 space-y-4">
              {previews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No social media linked.</p>
              ) : (
                previews.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      block p-4 rounded-xl border transition-all duration-300 transform hover:scale-105 hover:shadow-md
                      ${
                        social.status === "active"
                          ? "border-gray-200 hover:border-transparent hover:ring-2 hover:ring-opacity-30"
                          : social.status === "error"
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-red-200 bg-red-50"
                      }
                      ${
                        social.platform === "instagram"
                          ? "hover:ring-pink-300 border-pink-100"
                          : social.platform === "tiktok"
                          ? "hover:ring-black border-gray-100"
                          : "hover:ring-blue-300 border-blue-100"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`
                            p-2 rounded-full text-white
                            ${social.platform === "instagram" ? "bg-pink-500" : ""}
                            ${social.platform === "tiktok" ? "bg-black" : ""}
                            ${social.platform === "twitter" ? "bg-blue-500" : ""}
                          `}
                        >
                          {social.icon}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                          </p>
                          <p className="text-sm text-gray-500">@{social.username}</p>
                        </div>
                      </div>

                      {/* Status Icon */}
                      <div className="text-right">
                        {social.status === "active" && (
                          <span className="text-green-500 text-sm font-medium">Live</span>
                        )}
                        {social.status === "error" && (
                          <span className="text-yellow-600 text-xs">⚠️</span>
                        )}
                        {social.status === "unavailable" && (
                          <span className="text-red-500 text-xs">⛔</span>
                        )}
                      </div>
                    </div>

                    <p
                      className={`
                        text-xs mt-2
                        ${social.status === "active" ? "text-green-600" : ""}
                        ${social.status === "error" ? "text-yellow-600" : ""}
                        ${social.status === "unavailable" ? "text-red-600" : ""}
                      `}
                    >
                      {social.message}
                    </p>
                  </a>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Shared via QR Profile • Click to connect
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PublicProfile;
