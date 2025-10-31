import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

export function getSupabaseServiceClient() {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error('缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY，请在 server/.env 填入后重试。')
  }
  return createClient(url, serviceRoleKey)
}