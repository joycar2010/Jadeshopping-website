# 玉石雅韵电商平台 - 备份与恢复指南

## 📋 概述

本项目已配置完整的 GitHub Actions 自动备份系统，确保代码、构建产物和配置文件的安全性。

## 🔄 备份策略

### 自动备份触发条件
- **定时备份**: 每天凌晨 2:00 UTC (北京时间 10:00) 自动执行
- **推送备份**: 当代码推送到 `main` 分支时自动备份
- **标签备份**: 创建新标签时自动备份并创建 Release
- **手动备份**: 可在 GitHub Actions 页面手动触发

### 备份内容
1. **源代码备份** (`backup-source-*.tar.gz`)
   - 完整项目源代码
   - 排除 `node_modules`、`.git`、`dist`、`build` 目录
   
2. **构建产物备份** (`backup-build-*.tar.gz`)
   - Vite 构建输出 (`dist/` 目录)
   - 生产环境优化文件
   
3. **依赖配置备份** (`backup-deps-*.tar.gz`)
   - `package.json` 和 `package-lock.json`
   - TypeScript 配置 (`tsconfig.json`)
   - 构建工具配置 (Vite, Tailwind, PostCSS, ESLint)
   - 部署配置 (`vercel.json`, `.vercelignore`)
   - Git 配置 (`.gitignore`)

4. **备份信息文件** (`backup-info/`)
   - 备份时间和提交信息
   - 项目结构快照
   - 依赖版本信息
   - 构建产物清单

## 📁 备份存储

### 备份分支
- **命名规则**: `backup-YYYY-MM-DD`
- **保留策略**: 自动保留最近 7 天的备份分支
- **内容**: 备份文件 + 备份信息

### Release 备份
- **触发条件**: 推送标签时自动创建
- **命名规则**: `backup-{标签名}-YYYYMMDD`
- **附件**: 完整源代码压缩包

## 🔍 监控系统

### 备份状态监控
- **监控频率**: 每天凌晨 3:00 UTC 检查
- **监控内容**:
  - 最近备份工作流状态
  - 备份分支数量统计
  - 备份健康状态评估

### 故障报警
- **自动创建 Issue**: 备份失败时自动创建问题报告
- **报警标签**: `backup-alert`, `bug`, `high-priority`
- **防重复**: 避免创建重复的故障报告

## 🛠️ 手动操作指南

### 手动触发备份
1. 访问 [GitHub Actions](https://github.com/你的用户名/Jadeshopping/actions)
2. 选择 "自动备份" 工作流
3. 点击 "Run workflow" 按钮
4. 选择分支并点击 "Run workflow"

### 查看备份状态
1. 访问 [Actions 页面](https://github.com/你的用户名/Jadeshopping/actions)
2. 查看 "自动备份" 和 "备份状态监控" 工作流运行记录
3. 检查备份分支: `git branch -r | grep backup-`

### 下载备份文件
1. **从备份分支下载**:
   ```bash
   git fetch origin
   git checkout backup-2024-01-15
   # 备份文件位于根目录
   ```

2. **从 Release 下载**:
   - 访问项目的 [Releases 页面](https://github.com/你的用户名/Jadeshopping/releases)
   - 下载对应的备份附件

3. **从 Artifacts 下载**:
   - 在 Actions 运行详情页面下载构建产物

## 🔧 恢复操作

### 完整项目恢复
```bash
# 1. 下载并解压源代码备份
tar -xzf backup-source-20240115-100000.tar.gz

# 2. 安装依赖
npm install

# 3. 恢复构建产物 (可选)
tar -xzf backup-build-20240115-100000.tar.gz

# 4. 验证项目
npm run dev
```

### 部分文件恢复
```bash
# 1. 检出备份分支
git fetch origin
git checkout backup-2024-01-15

# 2. 复制需要的文件
cp backup-info/backup-info.md ./
cp specific-file.js ../current-project/

# 3. 返回主分支
git checkout main
```

### 依赖配置恢复
```bash
# 1. 解压依赖配置备份
tar -xzf backup-deps-20240115-100000.tar.gz

# 2. 恢复 package.json
cp package.json ../current-project/
cp package-lock.json ../current-project/

# 3. 重新安装依赖
cd ../current-project
npm install
```

## ⚙️ 配置说明

### 工作流文件位置
- 主备份工作流: `.github/workflows/backup.yml`
- 监控工作流: `.github/workflows/backup-monitor.yml`

### 环境变量
- `GITHUB_TOKEN`: GitHub Actions 自动提供，用于 API 访问
- 无需额外配置环境变量

### 权限要求
- `contents: write` - 创建分支和提交
- `actions: read` - 读取工作流状态
- `issues: write` - 创建故障报告

## 🚨 故障排除

### 常见问题

1. **备份失败 - 权限不足**
   - 检查仓库的 Actions 权限设置
   - 确保 `GITHUB_TOKEN` 有足够权限

2. **备份失败 - 存储空间不足**
   - 清理旧的备份分支
   - 检查仓库存储限制

3. **构建失败**
   - 检查 `package.json` 中的构建脚本
   - 确保所有依赖都已正确安装

4. **分支推送失败**
   - 检查分支保护规则
   - 确保没有命名冲突

### 调试步骤
1. 查看 Actions 运行日志
2. 检查备份文件是否生成
3. 验证 Git 配置和权限
4. 测试手动备份流程

## 📞 支持

如果遇到备份相关问题:
1. 查看 [Issues 页面](https://github.com/你的用户名/Jadeshopping/issues) 的备份警报
2. 检查 Actions 运行日志
3. 参考本文档的故障排除部分
4. 创建新的 Issue 寻求帮助

---

**最后更新**: 2024年1月
**版本**: 1.0.0