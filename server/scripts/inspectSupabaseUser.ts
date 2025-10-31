import 'dotenv/config'
import { getSupabaseServiceClient } from '../src/services/supabaseClient'

async function main() {
  const emailArg = process.argv[2]
  if (!emailArg) {
    console.error('Usage: ts-node scripts/inspectSupabaseUser.ts <email>')
    process.exit(2)
  }
  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, member_level, points, is_active, created_at')
    .eq('email', emailArg)
    .limit(1)

  if (error) {
    console.error('Query error:', error.message || error)
    process.exit(1)
  }
  if (!data || !data.length) {
    console.log(JSON.stringify({ found: false, email: emailArg }))
    process.exit(0)
  }
  const row = data[0] as any
  console.log(JSON.stringify({
    found: true,
    record: {
      id: row.id,
      email: row.email,
      name: row.name ?? null,
      member_level: row.member_level ?? null,
      points: row.points ?? null,
      is_active: row.is_active ?? null,
      created_at: row.created_at,
    }
  }))
}

main().catch(err => {
  console.error(String(err?.message || err))
  process.exit(1)
})