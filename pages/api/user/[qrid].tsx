import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { qrid } = req.query;

  if (!qrid || typeof qrid !== "string") {
    return res.status(400).json({ error: "QR ID tidak valid" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("qrid", qrid)
      .single();

    if (error) return res.status(404).json({ error: "User tidak ditemukan" });

    return res.status(200).json({ ok: true, user: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
