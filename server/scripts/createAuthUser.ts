import 'dotenv/config'
import { getSupabaseServiceClient } from '../src/services/supabaseClient'

async function main() {
  const email = process.argv[2]
  const password = process.argv[3] || '123456'
  const displayName = process.argv[4] || 'User'
  if (!email) {
    console.error('Usage: ts-node scripts/createAuthUser.ts <email> [password] [displayName]')
    process.exit(2)
  }

  const supabase = getSupabaseServiceClient()

  // Try get by email (admin)
  let existingId: string | null = null
  try {
    const { data: got } = await (supabase as any).auth.admin.getUserByEmail(email)
    if (got?.user) existingId = got.user.id
  } catch (e) {
    // Fallback: ignore if method unavailable
  }

  if (!existingId) {
    const { data, error } = await (supabase as any).auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: displayName }
    })
    if (error) {
      console.error('Create auth user failed:', error.message || error)
      process.exit(1)
    }
    console.log(JSON.stringify({ action: 'created', user: { id: data.user?.id, email: data.user?.email } }))
  } else {
    const { data, error } = await (supabase as any).auth.admin.updateUserById(existingId, {
      password,
      email_confirm: true,
      user_metadata: { name: displayName }
    })
    if (error) {
      console.error('Update auth user failed:', error.message || error)
      process.exit(1)
    }
    console.log(JSON.stringify({ action: 'updated', user: { id: data.user?.id, email: data.user?.email } }))
  }
}

main().catch(err => {
  console.error(String(err?.message || err))
  process.exit(1)
})