import bcrypt from 'bcryptjs'
import { config } from '../config'
import { getSupabaseServiceClient } from '../services/supabaseClient'

export async function ensureDefaultAdminOperator() {
  try {
    const supabase = getSupabaseServiceClient()
    const username = config.adminDefaultUsername
    const email = config.adminDefaultEmail
    const password = config.adminDefaultPassword

    const { data: existing, error: queryErr } = await supabase
      .from('operators')
      .select('id, username')
      .eq('username', username)
      .limit(1)
    if (queryErr) throw queryErr
    let operatorId: string | undefined = existing?.[0]?.id
    let created = false
    if (!operatorId) {
      const saltRounds = 10
      const password_hash = await bcrypt.hash(password, saltRounds)
      const { data: createdRows, error: insertErr } = await supabase
        .from('operators')
        .insert({ username, email, password_hash, is_active: true })
        .select('id')
      if (insertErr) throw insertErr
      operatorId = createdRows?.[0]?.id
      created = true
    }
    // 确保分配 super_admin 角色
    if (operatorId) {
      const { data: superRoleRows, error: roleErr } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'super_admin')
        .limit(1)
      if (roleErr) throw roleErr
      const superRoleId = superRoleRows?.[0]?.id
      if (superRoleId) {
        const { data: hasLink, error: linkErr } = await supabase
          .from('operator_roles')
          .select('operator_id, role_id')
          .eq('operator_id', operatorId)
          .eq('role_id', superRoleId)
          .limit(1)
        if (linkErr) throw linkErr
        if (!hasLink || !hasLink.length) {
          const { error: insLinkErr } = await supabase
            .from('operator_roles')
            .insert({ operator_id: operatorId, role_id: superRoleId })
          if (insLinkErr) throw insLinkErr
        }
      }
    }
    return { ok: true, created, id: operatorId }
  } catch (err) {
    console.error('ensureDefaultAdminOperator failed:', err)
    return { ok: false }
  }
}