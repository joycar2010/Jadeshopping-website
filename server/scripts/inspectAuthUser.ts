import 'dotenv/config'
import { getSupabaseServiceClient } from '../src/services/supabaseClient'

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Usage: ts-node scripts/inspectAuthUser.ts <email>')
    process.exit(2)
  }
  const supabase = getSupabaseServiceClient()
  const admin = (supabase as any).auth.admin
  let u: any = null
  const perPage = 1000
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.listUsers({ page, perPage })
    if (error) {
      console.error('Lookup error:', error.message || error)
      process.exit(1)
    }
    const found = data?.users?.find((x: any) => (x.email || '').toLowerCase() === email.toLowerCase())
    if (found) { u = found; break }
    if (!data?.users?.length || data.users.length < perPage) break
  }
  if (!u) {
    console.log(JSON.stringify({ found: false, email }))
    process.exit(0)
  }
  console.log(JSON.stringify({
    found: true,
    record: {
      id: u.id,
      email: u.email,
      email_confirmed_at: (u as any).email_confirmed_at ?? null,
      last_sign_in_at: (u as any).last_sign_in_at ?? null,
      created_at: (u as any).created_at ?? null,
      identities: (u as any).identities?.length ?? 0,
      phone: (u as any).phone ?? null,
      user_metadata: (u as any).user_metadata ?? null
    }
  }))
}

main().catch(err => {
  console.error(String(err?.message || err))
  process.exit(1)
})