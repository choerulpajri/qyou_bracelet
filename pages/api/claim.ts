import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { qrid, user_id } = req.body;
  if (!qrid || !user_id)
    return res.status(400).json({ error: "QR ID dan user_id wajib diisi" });

  // cek apakah QR sudah diklaim
  const { data: existing } = await supabase
    .from("claim")
    .select("*")
    .eq("qrid", qrid)
    .single();

  if (existing) return res.status(409).json({ error: "QR sudah diklaim" });

  // insert claim
  const { data, error } = await supabase.from("claim").insert([
    { qrid, claimed_by: user_id },
  ]);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ ok: true, message: "QR berhasil diklaim", data });
}
