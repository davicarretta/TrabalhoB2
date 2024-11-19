import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'sua_url_supabase_aqui';
const SUPABASE_ANON_KEY = 'sua_chave_supabase_aqui';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
