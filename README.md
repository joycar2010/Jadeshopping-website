# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

## Supabase 配置与验证

- 在项目根目录创建或更新 `.env`：
  - `VITE_SUPABASE_URL=https://<你的项目>.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=<你的匿名公钥>`
  - 可选：`VITE_DEBUG_LOGS=false`（默认关闭调试日志）
- 重启开发服务后访问 `http://localhost:5173/data-migration`：
  - 配置缺失时，页面顶部会显示提示且按钮禁用；
  - 配置正确后，“开始迁移/清空数据”按钮可用。
- 如需初始化数据：点击“开始迁移”，观察成功/失败摘要；若失败，请检查：
  - 表结构与字段是否与 `supabase/migrations/*.sql` 和 `src/lib/supabase.ts` 中类型一致；
  - RLS 策略是否允许匿名写入或使用了合适的密钥；
  - 网络环境和 Supabase 项目状态是否正常。

### 部署环境（Vercel）
- 在 Vercel 项目设置中添加环境变量：
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- 建议生产环境保持 `VITE_DEBUG_LOGS=false`，避免冗余日志。
