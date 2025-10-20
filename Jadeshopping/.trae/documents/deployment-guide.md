# 玉石雅韵电商平台 - 部署指南

## 1. 项目概述

玉石雅韵是一个基于现代前端技术栈构建的电商平台，采用以下技术：
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **样式框架**: Tailwind CSS 3
- **路由管理**: React Router DOM 7
- **状态管理**: Zustand
- **UI组件**: Lucide React Icons

## 2. 构建准备

### 2.1 环境要求
- Node.js 18+ 
- npm 或 yarn 包管理器
- Git 版本控制

### 2.2 构建前检查
```bash
# 检查依赖
npm install

# 类型检查
npm run check

# 代码检查
npm run lint

# 本地构建测试
npm run build
```

## 3. 部署平台选择

### 3.1 推荐部署平台

#### 🚀 Vercel（强烈推荐）
**优势**:
- 零配置部署，完美支持 Vite
- 自动 HTTPS 和 CDN
- 优秀的性能优化
- 免费额度充足

**适用场景**: 个人项目、中小型商业项目

#### 🌐 Netlify
**优势**:
- 简单易用的部署流程
- 内置表单处理和函数
- 良好的静态站点优化

**适用场景**: 静态站点、原型项目

#### 📦 GitHub Pages
**优势**:
- 完全免费
- 与 GitHub 仓库深度集成

**适用场景**: 开源项目、演示站点

#### ☁️ 阿里云/腾讯云
**优势**:
- 国内访问速度快
- 完整的云服务生态

**适用场景**: 企业级项目、需要备案的项目

## 4. Vercel 部署详细步骤

### 4.1 准备工作
1. 将代码推送到 GitHub 仓库
2. 注册 Vercel 账号（推荐使用 GitHub 登录）

### 4.2 部署步骤
```bash
# 1. 安装 Vercel CLI（可选）
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 在项目根目录执行部署
vercel

# 4. 生产环境部署
vercel --prod
```

### 4.3 Web 界面部署
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择 GitHub 仓库
4. 配置项目设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4.4 Vercel 配置文件
创建 `vercel.json` 文件：
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 5. Netlify 部署步骤

### 5.1 配置文件
创建 `netlify.toml` 文件：
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 5.2 部署步骤
1. 访问 [netlify.com](https://netlify.com)
2. 连接 GitHub 仓库
3. 配置构建设置
4. 点击部署

## 6. 环境变量配置

### 6.1 创建环境变量文件
```bash
# .env.production
VITE_APP_TITLE=玉石雅韵
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_PAYMENT_KEY=your_payment_key
VITE_ANALYTICS_ID=your_analytics_id
```

### 6.2 平台环境变量设置

#### Vercel
```bash
# 通过 CLI 设置
vercel env add VITE_API_BASE_URL

# 或在 Vercel Dashboard 中设置
```

#### Netlify
在 Netlify Dashboard > Site settings > Environment variables 中添加

## 7. 域名配置和 SSL

### 7.1 自定义域名
1. **Vercel**: Dashboard > Domains > Add Domain
2. **Netlify**: Site settings > Domain management > Add custom domain

### 7.2 DNS 配置
```
# A 记录示例
Type: A
Name: @
Value: 76.76.19.61 (Vercel IP)

# CNAME 记录示例
Type: CNAME
Name: www
Value: your-project.vercel.app
```

### 7.3 SSL 证书
- Vercel 和 Netlify 自动提供免费 SSL 证书
- 自动续期，无需手动配置

## 8. 性能优化建议

### 8.1 构建优化
```typescript
// vite.config.ts 优化配置
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 8.2 代码分割
```typescript
// 路由懒加载
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Profile = lazy(() => import('./pages/Profile'));
```

### 8.3 图片优化
- 使用 WebP 格式
- 实现图片懒加载
- 配置适当的图片尺寸

### 8.4 缓存策略
```typescript
// 在 vite.config.ts 中配置
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  }
})
```

## 9. 部署后维护和监控

### 9.1 性能监控
```typescript
// 添加性能监控
// src/utils/analytics.ts
export const trackPageView = (page: string) => {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: page
    });
  }
};
```

### 9.2 错误监控
推荐集成 Sentry 进行错误监控：
```bash
npm install @sentry/react @sentry/tracing
```

### 9.3 自动化部署
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 9.4 备份策略
- 定期备份代码仓库
- 备份用户数据（如果有后端）
- 监控网站可用性

## 10. 常见问题解决

### 10.1 路由问题
确保配置了 SPA 重定向规则，所有路由都指向 `index.html`

### 10.2 环境变量不生效
- 确保变量名以 `VITE_` 开头
- 重新构建和部署项目

### 10.3 构建失败
```bash
# 清理缓存重新构建
rm -rf node_modules dist
npm install
npm run build
```

### 10.4 性能问题
- 检查包大小分析
- 优化图片资源
- 启用 gzip 压缩

## 11. 部署检查清单

- [ ] 代码已推送到 Git 仓库
- [ ] 本地构建测试通过
- [ ] 环境变量已配置
- [ ] 域名 DNS 已设置
- [ ] SSL 证书已启用
- [ ] 性能优化已实施
- [ ] 监控工具已集成
- [ ] 备份策略已制定

## 12. 联系支持

如果在部署过程中遇到问题，可以：
1. 查看平台官方文档
2. 检查构建日志
3. 联系技术支持团队

---

**祝您部署顺利！玉石雅韵电商平台即将上线！** 🚀