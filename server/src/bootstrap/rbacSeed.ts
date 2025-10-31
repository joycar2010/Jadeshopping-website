import { getSupabaseServiceClient } from '../services/supabaseClient'

type EnsureResult = { ok: boolean; created?: boolean; reason?: string }

/**
 * 确保给指定角色授予指定权限（若不存在则插入 role_permissions）。
 */
export async function ensureRoleHasPermission(roleName: string, permissionName: string): Promise<EnsureResult> {
  try {
    const supabase = getSupabaseServiceClient()

    // 查角色ID
    const { data: roleRows, error: rErr } = await supabase
      .from('roles')
      .select('id, name')
      .eq('name', roleName)
      .limit(1)
    if (rErr) throw rErr
    const role = roleRows?.[0]
    if (!role) return { ok: false, reason: `role ${roleName} not found` }

    // 查权限ID
    const { data: permRows, error: pErr } = await supabase
      .from('permissions')
      .select('id, name')
      .eq('name', permissionName)
      .limit(1)
    if (pErr) throw pErr
    const perm = permRows?.[0]
    if (!perm) return { ok: false, reason: `permission ${permissionName} not found` }

    // 检查是否已有关联
    const { data: linkRows, error: lErr } = await supabase
      .from('role_permissions')
      .select('role_id, permission_id')
      .eq('role_id', (role as any).id)
      .eq('permission_id', (perm as any).id)
      .limit(1)
    if (lErr) throw lErr
    if (linkRows && linkRows.length) {
      return { ok: true, created: false }
    }

    // 创建关联
    const { error: iErr } = await supabase
      .from('role_permissions')
      .insert({ role_id: (role as any).id, permission_id: (perm as any).id })
    if (iErr) throw iErr
    return { ok: true, created: true }
  } catch (err) {
    console.warn('ensureRoleHasPermission failed:', err)
    return { ok: false, reason: String((err as any)?.message || err) }
  }
}

/**
 * 确保 admin 角色具备 roles.write 权限，便于操作员管理与角色分配。
 */
export async function ensureAdminRoleWritePermission(): Promise<EnsureResult> {
  return ensureRoleHasPermission('admin', 'roles.write')
}

/**
 * 扩展：确保 admin 角色具备多项常用权限
 * 当前包含：users.write、system.logs
 */
export async function ensureAdminRoleExtraPermissions(): Promise<EnsureResult> {
  const targets = ['users.write', 'system.logs']
  let anyCreated = false
  for (const perm of targets) {
    const r = await ensureRoleHasPermission('admin', perm)
    if (!r.ok) return r
    if (r.created) anyCreated = true
  }
  return { ok: true, created: anyCreated }
}

/**
 * 扩展：确保 admin 角色具备一组基础权限（覆盖常见后台操作）
 */
export async function ensureAdminEssentialPermissions(): Promise<EnsureResult> {
  const essentials = [
    'roles.read', 'roles.write',
    'users.read', 'users.write',
    'products.read', 'products.write',
    'categories.read', 'categories.write',
    'orders.read', 'orders.write',
    'content.read', 'content.write',
    'system.logs',
  ]
  let anyCreated = false
  for (const perm of essentials) {
    const r = await ensureRoleHasPermission('admin', perm)
    if (!r.ok) return r
    if (r.created) anyCreated = true
  }
  return { ok: true, created: anyCreated }
}