import 'dotenv/config';

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 8080,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  // 默认管理员（用户名+密码），邮箱可选
  adminDefaultUsername: process.env.ADMIN_DEFAULT_USERNAME || 'admin',
  adminDefaultEmail: process.env.ADMIN_DEFAULT_EMAIL || 'admin@example.com',
  adminDefaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || '123456',
};