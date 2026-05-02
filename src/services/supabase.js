import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = 'https://swiecaortfmnqynteyyq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_N5lcjl4NVJ1ltVRbF-rvIw_E0iaFOJO';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;