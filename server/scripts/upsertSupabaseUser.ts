import 'dotenv/config'
import { getSupabaseServiceClient } from '../src/services/supabaseClient'

async function main() {
  const email = process.argv[2]
  const nameArg = process.argv[3]
  if (!email) {
    console.error('Usage: ts-node scripts/upsertSupabaseUser.ts <email> [name]')
    process.exit(2)
  }

  const supabase = getSupabaseServiceClient()
  const safeName = (nameArg && nameArg.trim()) || (email.split('@')[0] || 'User')

  // 根据表结构，name NOT NULL，email UNIQUE NOT NULL，is_active 默认 true
  const payload = {
    email,
    name: safeName,
    is_active: true,
  }

  const { data, error } = await supabase
    .from('users')
    .upsert([payload], { onConflict: 'email' })
    .select('id, email, name, is_active, created_at')

  if (error) {
    console.error('Upsert error:', error.message || error)
    process.exit(1)
  }

  const row = data?.[0]
  if (!row) {
    console.error('Upsert succeeded but no row returned')
    process.exit(1)
  }

  console.log(JSON.stringify({ ok: true, record: row }))
}

main().catch(err => {
  console.error(String(err?.message || err))
  process.exit(1)
})