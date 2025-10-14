import { supabase } from './supabase'
import type { User } from '../types'

export interface CreateUserData {
  email: string
  username?: string
  full_name?: string
  phone?: string
  avatar_url?: string
  status?: 'active' | 'inactive' | 'suspended'
  email_verified?: boolean
}

export interface UpdateUserData {
  username?: string
  full_name?: string
  phone?: string
  avatar_url?: string
  status?: 'active' | 'inactive' | 'suspended'
  email_verified?: boolean
}

export interface UserListParams {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive' | 'suspended' | 'all'
  sortBy?: 'created_at' | 'updated_at' | 'last_login_at' | 'email'
  sortOrder?: 'asc' | 'desc'
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 获取用户列表
export async function getUserList(params: UserListParams = {}): Promise<UserListResponse> {
  const {
    page = 1,
    limit = 20,
    search = '',
    status = 'all',
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = params

  let query = supabase
    .from('frontend_users')
    .select('*', { count: 'exact' })

  // 搜索过滤
  if (search) {
    query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  // 状态过滤
  if (status !== 'all') {
    query = query.eq('status', status)
  }

  // 排序
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // 分页
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`获取用户列表失败: ${error.message}`)
  }

  const users: User[] = (data || []).map(user => ({
    id: user.id,
    email: user.email,
    username: user.username || '',
    full_name: user.full_name || '',
    name: user.full_name || user.username || user.email,
    phone: user.phone || '',
    avatar: user.avatar_url || '',
    avatar_url: user.avatar_url || '',
    balance: 0, // 暂时设为0，后续可以从其他表获取
    status: user.status,
    email_verified: user.email_verified || false,
    phone_verified: false, // 暂时设为false，后续可以添加字段
    registration_source: 'email', // 暂时设为email，后续可以添加字段
    last_login_at: user.last_login_at,
    last_login_ip: '', // 暂时为空，后续可以添加字段
    login_count: 0, // 暂时设为0，后续可以从其他表获取
    created_at: user.created_at,
    updated_at: user.updated_at
  }))

  return {
    users,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

// 获取单个用户详情
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('frontend_users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // 用户不存在
    }
    throw new Error(`获取用户详情失败: ${error.message}`)
  }

  return {
    id: data.id,
    email: data.email,
    username: data.username || '',
    full_name: data.full_name || '',
    name: data.full_name || data.username || data.email,
    phone: data.phone || '',
    avatar: data.avatar_url || '',
    avatar_url: data.avatar_url || '',
    balance: 0,
    status: data.status,
    email_verified: data.email_verified || false,
    phone_verified: false,
    registration_source: 'email',
    last_login_at: data.last_login_at,
    last_login_ip: '',
    login_count: 0,
    created_at: data.created_at,
    updated_at: data.updated_at
  }
}

// 创建用户
export async function createUser(userData: CreateUserData): Promise<User> {
  const { data, error } = await supabase
    .from('frontend_users')
    .insert({
      email: userData.email,
      username: userData.username,
      full_name: userData.full_name,
      phone: userData.phone,
      avatar_url: userData.avatar_url,
      status: userData.status || 'active',
      email_verified: userData.email_verified || false
    })
    .select()
    .single()

  if (error) {
    throw new Error(`创建用户失败: ${error.message}`)
  }

  return {
    id: data.id,
    email: data.email,
    username: data.username || '',
    full_name: data.full_name || '',
    name: data.full_name || data.username || data.email,
    phone: data.phone || '',
    avatar: data.avatar_url || '',
    avatar_url: data.avatar_url || '',
    balance: 0,
    status: data.status,
    email_verified: data.email_verified || false,
    phone_verified: false,
    registration_source: 'email',
    last_login_at: data.last_login_at,
    last_login_ip: '',
    login_count: 0,
    created_at: data.created_at,
    updated_at: data.updated_at
  }
}

// 更新用户
export async function updateUser(userId: string, userData: UpdateUserData): Promise<User> {
  const { data, error } = await supabase
    .from('frontend_users')
    .update({
      ...userData,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`更新用户失败: ${error.message}`)
  }

  return {
    id: data.id,
    email: data.email,
    username: data.username || '',
    full_name: data.full_name || '',
    name: data.full_name || data.username || data.email,
    phone: data.phone || '',
    avatar: data.avatar_url || '',
    avatar_url: data.avatar_url || '',
    balance: 0,
    status: data.status,
    email_verified: data.email_verified || false,
    phone_verified: false,
    registration_source: 'email',
    last_login_at: data.last_login_at,
    last_login_ip: '',
    login_count: 0,
    created_at: data.created_at,
    updated_at: data.updated_at
  }
}

// 删除用户
export async function deleteUser(userId: string): Promise<void> {
  const { error } = await supabase
    .from('frontend_users')
    .delete()
    .eq('id', userId)

  if (error) {
    throw new Error(`删除用户失败: ${error.message}`)
  }
}

// 批量更新用户状态
export async function batchUpdateUserStatus(
  userIds: string[], 
  status: 'active' | 'inactive' | 'suspended'
): Promise<void> {
  const { error } = await supabase
    .from('frontend_users')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .in('id', userIds)

  if (error) {
    throw new Error(`批量更新用户状态失败: ${error.message}`)
  }
}

// 记录用户管理操作
export async function logUserManagementAction(
  adminUserId: string,
  frontendUserId: string,
  action: string,
  reason?: string
): Promise<void> {
  const { error } = await supabase
    .from('user_management_actions')
    .insert({
      admin_user_id: adminUserId,
      frontend_user_id: frontendUserId,
      action,
      reason
    })

  if (error) {
    console.error('记录用户管理操作失败:', error)
    // 不抛出错误，避免影响主要操作
  }
}