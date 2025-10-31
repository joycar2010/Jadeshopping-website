import 'dotenv/config'
import { getSupabaseServiceClient } from '../src/services/supabaseClient'

async function findAuthUserIdByEmail(supabase: any, email: string): Promise<string | null> {
  const admin = (supabase as any).auth.admin
  const perPage = 1000
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.listUsers({ page, perPage })
    if (error) throw error
    const u = data?.users?.find((x: any) => (x.email || '').toLowerCase() === email.toLowerCase())
    if (u) return (u as any).id as string
    if (!data?.users?.length || data.users.length < perPage) break
  }
  return null
}

async function reassignRefs(
  supabase: any,
  table: string,
  column: string,
  fromIds: string[],
  toId: string
) {
  if (!fromIds.length) return { ok: true, table, updated: 0 }
  const { error } = await supabase
    .from(table)
    .update({ [column]: toId })
    .in(column, fromIds)
  if (error) throw new Error(`${table}.${column} reassign failed: ${error.message || error}`)
  return { ok: true, table }
}

async function main() {
  const emailArg = process.argv[2]
  if (!emailArg) {
    console.error('Usage: ts-node scripts/mergeUserByEmail.ts <email>')
    process.exit(2)
  }
  const emailLC = emailArg.trim().toLowerCase()
  const supabase = getSupabaseServiceClient()

  // 1) 查找 Auth 用户ID（作为首选规范ID）
  const authUserId = await findAuthUserIdByEmail(supabase, emailLC)

  // 2) 找出 users 表中所有同邮箱（忽略大小写）的记录
  const { data: userRows, error: qErr } = await supabase
    .from('users')
    .select('id, email, name, created_at')
    .ilike('email', emailLC)
  if (qErr) throw qErr
  const rows: any[] = userRows || []

  let canonicalId: string | null = authUserId

  // 3) 构建索引并确定规范ID
  const rowsById: Record<string, any> = {}
  for (const r of rows) rowsById[r.id as string] = r

  if (!canonicalId) {
    // 无 Auth 用户，选 created_at 最新的一条作为规范ID
    const latest = rows
      .slice()
      .sort((a, b) => new Date(a.created_at as string).getTime() - new Date(b.created_at as string).getTime())
      .pop()
    canonicalId = latest?.id ?? null
  }

  const existingIds = rows.map(r => r.id as string)
  let duplicateIds: string[] = []

  if (!canonicalId) {
    // 既没有 Auth 用户也没有 users 记录，则创建一条规范记录
    const name = (emailLC.split('@')[0] || 'User')
    const { data: created, error: insErr } = await supabase
      .from('users')
      .insert({ email: emailLC, name, is_active: true })
      .select('id')
      .single()
    if (insErr) throw insErr
    canonicalId = created.id as string
    duplicateIds = []
  } else if (rowsById[canonicalId]) {
    // 规范ID已存在于 users 表
    duplicateIds = existingIds.filter(id => id !== canonicalId)
  } else {
    // 规范ID不存在，但该邮箱已有其他记录，需先临时改名以释放唯一约束，再插入规范ID行
    for (const r of rows) {
      const tempEmail = `${emailLC}+dup-${r.id}`
      const { error: tmpErr } = await supabase
        .from('users')
        .update({ email: tempEmail })
        .eq('id', r.id)
      if (tmpErr) throw new Error(`temporary rename email failed for ${r.id}: ${tmpErr.message || tmpErr}`)
    }
    const name = (rows[0]?.name as string) || (emailLC.split('@')[0] || 'User')
    const { error: insErr } = await supabase
      .from('users')
      .insert({ id: canonicalId, email: emailLC, name, is_active: true })
    if (insErr) throw insErr
    duplicateIds = existingIds
  }

  // 4) 识别需要合并的重复ID（与规范ID不同的记录）已在上方设置 duplicateIds

  // 5) 迁移所有外键引用到规范ID
  const mappings: Array<{ table: string; column: string }> = [
    { table: 'orders', column: 'user_id' },
    { table: 'reviews', column: 'user_id' },
    { table: 'favorites', column: 'user_id' },
    { table: 'addresses', column: 'user_id' },
    { table: 'user_coupons', column: 'user_id' },
    { table: 'buyback_applications', column: 'user_id' },
    { table: 'user_roles', column: 'user_id' },
    { table: 'user_login_logs', column: 'user_id' },
  ]

  for (const m of mappings) {
    await reassignRefs(supabase, m.table, m.column, duplicateIds, canonicalId!)
  }
  // user_roles.assigned_by 也可能引用用户
  const { error: abErr } = await supabase
    .from('user_roles')
    .update({ assigned_by: canonicalId })
    .in('assigned_by', duplicateIds)
  if (abErr) throw new Error(`user_roles.assigned_by reassign failed: ${abErr.message || abErr}`)

  // 6) 删除重复 users 记录
  if (duplicateIds.length) {
    const { error: delErr } = await supabase
      .from('users')
      .delete()
      .in('id', duplicateIds)
    if (delErr) throw delErr
  }

  // 7) 规范化邮箱为小写，防止大小写重复
  const { error: upErr } = await supabase
    .from('users')
    .update({ email: emailLC })
    .eq('id', canonicalId)
  if (upErr) throw upErr

  console.log(JSON.stringify({ ok: true, email: emailLC, canonicalId, merged: duplicateIds.length }))
}

main().catch(err => {
  console.error(JSON.stringify({ ok: false, error: String(err?.message || err) }))
  process.exit(1)
})