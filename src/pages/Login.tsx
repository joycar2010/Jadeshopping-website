import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { supabase } from '@/lib/supabase';
import { validateText, DEFAULT_TEXT_MAX } from '../utils/validation';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useUserStore();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 邮箱字段：移除邮箱格式校验，仅保留必填与长度限制
      const emailError = validateText(formData.email, { required: true, min: 1, max: DEFAULT_TEXT_MAX });
      if (emailError) {
        alert(`邮箱字段错误：${emailError}`);
        return;
      }
      const emailNorm = formData.email.trim().toLowerCase();
      const passwordNorm = formData.password.trim();
      if (isLogin) {
        // 使用 Supabase Auth 登录
        if (emailNorm && passwordNorm) {
          const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
            email: emailNorm,
            password: passwordNorm
          })
          if (authError) {
            alert(`登录失败：${authError.message}`)
            return
          }

          // 优先按 auth.uid() 查询资料（RLS: auth.uid() = id）
          const authedUser = auth.user
          const baseName = emailNorm.includes('@') ? emailNorm.split('@')[0] : emailNorm

          let { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, email, name, phone, avatar_url, birthday, gender, created_at')
            .eq('id', authedUser.id)
            .single()

          // 若不存在，则为首次登录，自动建档（满足 RLS: INSERT with check auth.uid() = id 且 name 非空约束）
          if (profileError || !profile) {
            const { data: created, error: insertError } = await supabase
              .from('users')
              .insert({ id: authedUser.id, email: emailNorm, name: baseName })
              .select('id, email, name, phone, avatar_url, birthday, gender, created_at')
              .single()

            if (insertError || !created) {
              console.error('Auto-create profile failed:', insertError)
              alert('登录成功，但自动创建用户资料失败，请联系管理员。')
              return
            }
            profile = created
          }

          const user = {
            id: profile.id,
            username: profile.name || baseName,
            name: profile.name || baseName,
            email: profile.email,
            phone: profile.phone || undefined,
            avatar: profile.avatar_url || undefined,
            birthday: profile.birthday || undefined,
            gender: profile.gender || undefined,
            createdAt: profile.created_at,
          }
          login(user as any)
          navigate('/')
        }
      } else {
        // 注册逻辑
        if (formData.password !== formData.confirmPassword) {
          alert('两次输入的密码不一致');
          return;
        }
        
        if (formData.name && formData.email && formData.password) {
          // 暂未接入注册后端，这里仅提示
          alert('注册暂未开通，请使用已有账号登录。')
          return;
        }
      }
    } catch {
      alert('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-jade flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gradient">Guaranteed antiques</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {isLogin ? '登录您的账户' : '创建新账户'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? '还没有账户？' : '已有账户？'}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-primary-600 hover:text-primary-500 ml-1"
            >
              {isLogin ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>

        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  姓名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="请输入您的姓名"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  maxLength={DEFAULT_TEXT_MAX}
                  placeholder="请输入邮箱地址"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pl-10 pr-10"
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  确认密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="请再次输入密码"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    记住我
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    忘记密码？
                  </button>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
              </button>
            </div>

            {!isLogin && (
              <div className="text-xs text-gray-500 text-center">
                点击注册即表示您同意我们的
                <button type="button" className="text-primary-600 hover:text-primary-500">
                  服务条款
                </button>
                和
                <button type="button" className="text-primary-600 hover:text-primary-500">
                  隐私政策
                </button>
              </div>
            )}
          </form>

          {/* 第三方登录 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或者使用</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;