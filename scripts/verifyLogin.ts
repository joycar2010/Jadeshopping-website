import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

async function main() {
  const email = process.argv[2] || 'joycar2010@gmail.com'
  const password = process.argv[3] || '123456'

  // Try read from process.env first, then fallback to project .env
  let url = process.env.VITE_SUPABASE_URL
  let anon = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anon) {
    const envPath = path.resolve(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      const raw = fs.readFileSync(envPath, 'utf-8')
      const lines = raw.split(/\r?\n/)
      for (const line of lines) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
        if (!m) continue
        const key = m[1]
        let val = m[2]
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
        if (key === 'VITE_SUPABASE_URL') url = val
        if (key === 'VITE_SUPABASE_ANON_KEY') anon = val
      }
    }
  }
  if (!url || !anon) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY from .env at project root')
    process.exit(2)
  }

  const supabase = createClient(url, anon)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    console.error('Sign-in error:', error.message)
    process.exit(1)
  }
  console.log(JSON.stringify({ ok: true, user: { id: data.user?.id, email: data.user?.email } }))
}

main().catch((e) => { console.error(String(e?.message || e)); process.exit(1) })