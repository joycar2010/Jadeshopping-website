# JadeShopping 后台管理系统（Admin）

本说明文档介绍后台管理系统的基本使用、环境配置与API接口。

## 访问地址

- 开发环境前端：`http://localhost:5178/admin`
- 登录页面：`http://localhost:5178/admin/login`
- 后端 API 基础路径：`http://localhost:8080/admin/api`

## 环境配置

在 `server/.env` 中填写以下变量（示例见 `server/.env.example` 与本项目已有 Supabase 相关配置）：

```
PORT=8080
JWT_SECRET=your-secret

# 默认后台操作员（用于种子）
ADMIN_DEFAULT_USERNAME=admin
ADMIN_DEFAULT_EMAIL=admin@example.com
ADMIN_DEFAULT_PASSWORD=123456

# Supabase 服务端访问密钥
SUPABASE_URL=...           # 你的 Supabase 项目 URL
SUPABASE_SERVICE_ROLE_KEY=...  # Service Role Key（高权限，注意安全）
```

此外在 `supabase/migrations` 目录下新增了 `005_create_admin_operators.sql`，需在你的 Supabase 实例执行，以创建：

- `operators`：后台操作员表（`username`、`password_hash`、`is_active` 等）
- `operator_roles`：操作员与角色的关联表（依赖 `roles`）
- `operator_login_logs`：后台登录日志

RBAC 权限系统定义参考 `003_create_rbac_system.sql`。

## 种子与默认账号

后端启动时会尝试执行默认管理员种子（`ensureDefaultAdminOperator`）：

- 默认用户名：`admin`
- 默认密码：`123456`
- 可在 `server/.env` 中修改上述值

## 认证流程

前端登录页通过以下接口进行登录：

- `POST /admin/api/auth/login`
  - 请求体：`{ username: string, password: string }`
  - 响应：`{ token: string }`（JWT，默认有效期 8 小时）
  - 登录成功与失败都会记录至 `operator_login_logs`

- `POST /admin/api/auth/reset`
  - 请求体：`{ username: string, newPassword: string }`
  - 用于重置后台操作员密码（需由具备相应权限的页面调用，当前示例未加保护，仅供测试）

受保护接口需在请求头包含 `Authorization: Bearer <token>`，示例接口：

- `GET /admin/api/me`：解析并返回当前令牌payload（开发调试用）

## 前端说明

`admin-ui` 工程为独立 Vite + React 项目：

- 启动：在 `admin-ui` 目录执行 `npm install && npm run dev`
- 路由：`/admin` 基础路径（`/admin/login` 登录页）
- 代理：开发环境下 `/admin/api` 会代理到 `http://localhost:8080`

## 后续开发建议

- 在受保护路由中引入 `adminJwt` 中间件，并结合 `operator_roles` 与 `roles/permissions` 表实现更细粒度的权限控制。
- 按产品需求拆分模块：用户、商品、会员、营销、订单、回购、支付、发货、客服与操作员管理等，对应的后端路由与前端页面可分别在 `server/src/routes/admin/*` 与 `admin-ui/src/pages/*` 中扩展。
- 数据同步：可结合 Supabase Realtime 订阅数据变更，或在后端实现事件推送，确保前台与后台数据一致。

## 安全与测试

- 保持 `SUPABASE_SERVICE_ROLE_KEY` 安全，避免在前端暴露。
- 对输入参数使用校验（可用 `zod` 或 `express-validator`）。
- 编写单元测试与端到端测试用例，覆盖登录、权限与关键业务流程。