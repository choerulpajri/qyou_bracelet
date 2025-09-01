import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { qrid } = req.query;
  if (!qrid || typeof qrid !== "string") {
    return res.status(400).json({ error: "QR ID tidak valid" });
  }

  // cek di table claim
  const { data: existing, error } = await supabase
    .from("claim")
    .select("*")
    .eq("qrid", qrid)
    .single();

  if (error && error.code !== "PGRST116") {
    // kode PGRST116 = tidak ditemukan (OK)
    return res.status(500).json({ error: error.message });
  }

  if (existing) {
    return res.status(200).json({ ok: false, reason: "QR sudah diklaim" });
  } else {
    return res.status(200).json({ ok: true });
  }
}
