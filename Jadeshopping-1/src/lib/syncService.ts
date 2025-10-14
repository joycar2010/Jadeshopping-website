import { supabase } from './supabase'
import { createUser, type CreateUserData } from './userService'
import { logUserManagementAction } from './userService'
import type { User } from '../types'

export interface SyncUserData {
  email: string
  username: string
  full_name: string
  phone?: string
  password?: string // 仅用于注册时的密码验证，不会存储到数据库
}

export interface SyncResult {
  success: boolean
  user?: User
  error?: string
}

/**
 * 同步用户注册数据到 Supabase
 * 当用户在前端注册时，自动将用户信息同步到后台管理系统
 */
export async function syncUserRegistration(userData: SyncUserData): Promise<SyncResult> {
  try {
    // 检查邮箱是否已存在
    const { data: existingUser } = await supabase
      .from('frontend_users')
      .select('id, email')
      .eq('email', userData.email)
      .single()

    if (existingUser) {
      return {
        success: false,
        error: '该邮箱已被注册'
      }
    }

    // 创建用户数据对象
    const createUserData: CreateUserData = {
      email: userData.email,
      username: userData.username,
      full_name: userData.full_name,
      phone: userData.phone,
      status: 'active',
      email_verified: false
    }

    // 创建用户
    const user = await createUser(createUserData)

    // 记录用户注册操作到审计日志
    await logUserRegistrationAction(user.id, {
      action: 'USER_REGISTER',
      details: '用户通过前端注册',
      ip_address: await getUserIP(),
      user_agent: navigator.userAgent
    })

    return {
      success: true,
      user
    }
  } catch (error) {
    console.error('同步用户注册失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '同步失败'
    }
  }
}

/**
 * 同步用户信息更新
 * 当用户在前端更新个人信息时，同步到后台管理系统
 */
export async function syncUserUpdate(userId: string, updateData: Partial<SyncUserData>): Promise<SyncResult> {
  try {
    const { data, error } = await supabase
      .from('frontend_users')
      .update({
        username: updateData.username,
        full_name: updateData.full_name,
        phone: updateData.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`更新用户信息失败: ${error.message}`)
    }

    // 记录用户信息更新操作
    await logUserRegistrationAction(userId, {
      action: 'USER_UPDATE',
      details: '用户更新个人信息',
      ip_address: await getUserIP(),
      user_agent: navigator.userAgent
    })

    return {
      success: true,
      user: data
    }
  } catch (error) {
    console.error('同步用户更新失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '同步失败'
    }
  }
}

/**
 * 同步用户登录状态
 * 记录用户登录信息到后台管理系统
 */
export async function syncUserLogin(userId: string): Promise<void> {
  try {
    // 更新最后登录时间
    await supabase
      .from('frontend_users')
      .update({
        last_login_at: new Date().toISOString(),
        last_login_ip: await getUserIP()
      })
      .eq('id', userId)

    // 记录登录操作
    await logUserRegistrationAction(userId, {
      action: 'USER_LOGIN',
      details: '用户登录',
      ip_address: await getUserIP(),
      user_agent: navigator.userAgent
    })
  } catch (error) {
    console.error('同步用户登录失败:', error)
  }
}

/**
 * 记录用户注册相关的审计日志
 */
async function logUserRegistrationAction(
  userId: string,
  actionData: {
    action: string
    details: string
    ip_address: string
    user_agent: string
  }
): Promise<void> {
  try {
    await supabase
      .from('user_audit_logs')
      .insert({
        user_id: userId,
        action: actionData.action,
        details: actionData.details,
        ip_address: actionData.ip_address,
        user_agent: actionData.user_agent,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('记录审计日志失败:', error)
  }
}

/**
 * 获取用户IP地址（简化版本）
 */
async function getUserIP(): Promise<string> {
  try {
    // 在实际应用中，可以使用第三方服务获取IP
    // 这里返回一个占位符
    return 'unknown'
  } catch (error) {
    return 'unknown'
  }
}

/**
 * 检查数据一致性
 * 比较前端存储和后台数据库中的用户数据是否一致
 */
export async function checkDataConsistency(): Promise<{
  consistent: boolean
  issues: string[]
}> {
  const issues: string[] = []

  try {
    // 获取本地存储的用户数据
    const localUsers = localStorage.getItem('jade-shopping-users')
    if (!localUsers) {
      return { consistent: true, issues: [] }
    }

    const localUserList = JSON.parse(localUsers)

    // 获取数据库中的用户数据
    const { data: dbUsers, error } = await supabase
      .from('frontend_users')
      .select('*')

    if (error) {
      issues.push(`无法获取数据库用户数据: ${error.message}`)
      return { consistent: false, issues }
    }

    // 检查本地用户是否都在数据库中
    for (const localUser of localUserList) {
      const dbUser = dbUsers?.find(u => u.email === localUser.email)
      if (!dbUser) {
        issues.push(`本地用户 ${localUser.email} 在数据库中不存在`)
      } else {
        // 检查关键字段是否一致
        if (dbUser.username !== localUser.username) {
          issues.push(`用户 ${localUser.email} 的用户名不一致`)
        }
        if (dbUser.full_name !== localUser.full_name) {
          issues.push(`用户 ${localUser.email} 的全名不一致`)
        }
      }
    }

    return {
      consistent: issues.length === 0,
      issues
    }
  } catch (error) {
    issues.push(`检查数据一致性时发生错误: ${error instanceof Error ? error.message : '未知错误'}`)
    return { consistent: false, issues }
  }
}

/**
 * 修复数据不一致问题
 * 将本地存储的用户数据同步到数据库
 */
export async function repairDataInconsistency(): Promise<{
  success: boolean
  repairedCount: number
  errors: string[]
}> {
  const errors: string[] = []
  let repairedCount = 0

  try {
    const localUsers = localStorage.getItem('jade-shopping-users')
    if (!localUsers) {
      return { success: true, repairedCount: 0, errors: [] }
    }

    const localUserList = JSON.parse(localUsers)

    for (const localUser of localUserList) {
      try {
        const syncResult = await syncUserRegistration({
          email: localUser.email,
          username: localUser.username,
          full_name: localUser.full_name,
          phone: localUser.phone
        })

        if (syncResult.success) {
          repairedCount++
        } else if (syncResult.error && !syncResult.error.includes('已被注册')) {
          errors.push(`修复用户 ${localUser.email} 失败: ${syncResult.error}`)
        }
      } catch (error) {
        errors.push(`修复用户 ${localUser.email} 时发生错误: ${error instanceof Error ? error.message : '未知错误'}`)
      }
    }

    return {
      success: errors.length === 0,
      repairedCount,
      errors
    }
  } catch (error) {
    errors.push(`修复数据不一致时发生错误: ${error instanceof Error ? error.message : '未知错误'}`)
    return { success: false, repairedCount, errors }
  }
}