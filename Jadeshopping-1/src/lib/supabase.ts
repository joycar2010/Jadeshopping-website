import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ikahgymkezvwrzrjgtte.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrYWhneW1rZXp2d3J6cmpndHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNzQ0NTEsImV4cCI6MjA3NTg1MDQ1MX0.Zpr_-encjcdwuAWtSm916971dN5c8jVS1N2f-iiIqUk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for backend operations (only use in secure contexts)
export const createAdminClient = () => {
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('Missing Supabase service role key')
  }
  return createClient(supabaseUrl, serviceRoleKey)
}

// Database types
export interface AdminUser {
  id: string
  username: string
  email: string
  role: 'admin' | 'operator'
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  last_login_at?: string
}

export interface AdminSession {
  id: string
  admin_user_id: string
  token: string
  expires_at: string
  created_at: string
  ip_address?: string
  user_agent?: string
}

export interface AdminLog {
  id: string
  admin_user_id: string
  action: string
  resource_type: string
  resource_id?: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface FrontendUser {
  id: string
  email: string
  username?: string
  full_name?: string
  phone?: string
  avatar_url?: string
  status: 'active' | 'inactive' | 'suspended'
  email_verified: boolean
  created_at: string
  updated_at: string
  last_login_at?: string
}