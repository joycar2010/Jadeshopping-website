import express from 'express';
import cors from 'cors';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import healthRouter from './routes/health';
import categoriesRouter from './routes/categories';
import productsRouter from './routes/products';
import migrationsRouter from './routes/migrations';
import adminRouter from './routes/admin';

// 临时全局异常捕获：用于定位进程退出原因（开发排查用）
process.on('unhandledRejection', (reason) => {
  // 直接输出详细原因，便于在终端或日志中快速定位
  // eslint-disable-next-line no-console
  console.error('unhandledRejection:', reason)
})
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('uncaughtException:', err)
})

const app = express();
const logger = pino();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Serve uploaded assets
const uploadsDir = path.resolve(process.cwd(), 'uploads');
try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch {}
app.use('/uploads', express.static(uploadsDir));

app.use('/health', healthRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/migrations', migrationsRouter);
// 后台管理路由与中间件已移除
app.use('/admin/api', adminRouter);

app.get('/', (_req, res) => {
  res.json({ name: 'jadeshopping-server', version: '0.1.0' });
});

app.listen(config.port, async () => {
  logger.info({ port: config.port }, 'server started');
  // 确保默认后台操作员存在
  try {
    const { ensureDefaultAdminOperator } = await import('./bootstrap/operatorSeed')
    const result = await ensureDefaultAdminOperator()
    if (result.ok) {
      logger.info({ created: result.created }, 'default admin operator ensured')
    }
  } catch (err) {
    logger.warn({ err: String((err as any)?.message || err) }, 'ensure default admin operator skipped')
  }

  // 确保 admin 角色具备基础权限（便于管理操作员与常规后台模块）
  try {
    const { ensureAdminEssentialPermissions } = await import('./bootstrap/rbacSeed')
    const r = await ensureAdminEssentialPermissions()
    if (r.ok) {
      logger.info({ created: r.created }, 'admin role essential permissions ensured')
    } else {
      logger.warn({ reason: r.reason }, 'admin role essential permissions ensure failed')
    }
  } catch (err) {
    logger.warn({ err: String((err as any)?.message || err) }, 'ensure admin role essential permissions skipped')
  }
});