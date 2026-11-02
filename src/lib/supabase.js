import { createClient } from "@supabase/supabase-js";

// Same Supabase project as the original Sam'Art site. The publishable key is designed to be
// public (access is enforced by the RLS policies on the tables). Override via Netlify env vars if needed.
const URL = import.meta.env.VITE_SUPABASE_URL || "https://tytxvwndshhvmbdzalao.supabase.co";
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_UkOf17oN1aGnCaGNvS3Guw_a8ttwkjK";

export const supabase = createClient(URL, KEY);
