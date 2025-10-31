import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';

const router = Router();

const skuSchema = z.object({
  skuCode: z.string().min(1),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative().default(0),
  attributes: z.record(z.any()).optional(),
});

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  currency: z.string().default('CNY'),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
  skus: z.array(skuSchema).default([]),
  categoryIds: z.array(z.string()).default([]),
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  currency: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const includeSkus = (req.query.include as string)?.includes('skus');
    const includeCategories = (req.query.include as string)?.includes('categories');

    // 查询参数
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limitRaw = Number(req.query.limit ?? 20);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 20;
    const offsetParam = req.query.offset !== undefined ? Number(req.query.offset) : undefined;
    const search = (req.query.search as string) || '';
    const categoryId = (req.query.category as string) || '';
    const minPriceRaw = req.query.minPrice as string | undefined;
    const maxPriceRaw = req.query.maxPrice as string | undefined;
    const minRatingRaw = req.query.minRating as string | undefined;
    const sort = (req.query.sort as string) || 'created_at';

    // 构建 where 条件
    const whereBase: any = {};
    if (search) {
      whereBase.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) {
      whereBase.categories = { some: { categoryId } };
    }
    const minPriceNum = minPriceRaw !== undefined && minPriceRaw !== '' ? Number(minPriceRaw) : undefined;
    const maxPriceNum = maxPriceRaw !== undefined && maxPriceRaw !== '' ? Number(maxPriceRaw) : undefined;
    const minRatingNum = minRatingRaw !== undefined && minRatingRaw !== '' ? Number(minRatingRaw) : undefined;
    const where: any = { ...whereBase };
    if (typeof minPriceNum === 'number' || typeof maxPriceNum === 'number') {
      const cond: any = {};
      if (typeof minPriceNum === 'number') {
        cond.price = { ...(cond.price || {}), gte: minPriceNum };
      }
      if (typeof maxPriceNum === 'number') {
        cond.price = { ...(cond.price || {}), lte: maxPriceNum };
      }
      where.skus = { some: cond };
    }
    if (typeof minRatingNum === 'number') {
      where.rating = { gte: minRatingNum };
    }

    // 先查询（按创建时间降序），在内存层做必要排序与分页
    const foundBase = await prisma.product.findMany({
      where: whereBase,
      include: {
        skus: true,
        categories: includeCategories ? { include: { category: true } } : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    const found = await prisma.product.findMany({
      where,
      include: {
        skus: includeSkus,
        categories: includeCategories ? { include: { category: true } } : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    // 将 Decimal 转为 number
    const toNumber = (d: any) => {
      if (typeof d === 'number') return d;
      if (typeof d === 'string') return Number(d);
      if (d && typeof d.toNumber === 'function') return d.toNumber();
      return Number(d);
    };

    // 价格范围（基于未应用价格筛选的结果）
    let priceMin: number | null = null;
    let priceMax: number | null = null;
    for (const p of foundBase as any[]) {
      if (Array.isArray(p?.skus)) {
        for (const s of p.skus as any[]) {
          const val = toNumber(s?.price ?? 0);
          if (!Number.isFinite(val)) continue;
          priceMin = priceMin === null ? val : Math.min(priceMin, val);
          priceMax = priceMax === null ? val : Math.max(priceMax, val);
        }
      }
    }
    if (priceMin === null) priceMin = 0;
    if (priceMax === null) priceMax = 0;

    // 排序
    let products = [...found];
    if (sort === 'price_asc' || sort === 'price_desc') {
      const dir = sort === 'price_asc' ? 1 : -1;
      products.sort((a: any, b: any) => {
        const aPrice = Array.isArray(a.skus) && a.skus.length ? toNumber(a.skus[0].price) : 0;
        const bPrice = Array.isArray(b.skus) && b.skus.length ? toNumber(b.skus[0].price) : 0;
        return (aPrice - bPrice) * dir;
      });
    } else if (sort === 'created_at' || sort === 'newest') {
      products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'rating') {
      products.sort((a: any, b: any) => {
        const ar = Number((a as any).rating ?? 0);
        const br = Number((b as any).rating ?? 0);
        return br - ar;
      });
    }

    // 分页
    const total = products.length;
    const start = offsetParam !== undefined ? Math.max(0, offsetParam) : (page - 1) * limit;
    const end = start + limit;
    const paged = products.slice(start, end);

    res.json({ success: true, data: paged, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)), priceMin, priceMax });
  } catch (err: any) {
    res.status(503).json({ message: 'DB unavailable', error: String(err?.message || err) });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues });
  }
  try {
    const { name, slug, description, currency, skus, categoryIds } = parsed.data;
    const created = await prisma.product.create({
      data: {
        name, slug, description, currency,
        rating: (parsed.data as any).rating ?? undefined,
        reviewCount: (parsed.data as any).reviewCount ?? undefined,
        skus: skus.length ? { create: skus.map(s => ({
          skuCode: s.skuCode,
          price: s.price,
          stock: s.stock ?? 0,
          attributes: s.attributes ?? undefined,
        })) } : undefined,
        categories: categoryIds.length ? { create: categoryIds.map(id => ({ categoryId: id })) } : undefined,
      },
      include: { skus: true, categories: { include: { category: true } } },
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ message: 'Create failed', error: String(err?.message || err) });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { skus: true, categories: { include: { category: true } } },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err: any) {
    res.status(503).json({ message: 'DB unavailable', error: String(err?.message || err) });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues });
  }
  try {
    const { id } = req.params;
    const updated = await prisma.product.update({
      where: { id },
      data: parsed.data,
      include: { skus: true, categories: { include: { category: true } } },
    });
    res.json(updated);
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (msg.includes('Record to update not found')) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (msg.includes('Unique constraint') || msg.includes('P2002')) {
      return res.status(409).json({ message: 'Duplicate field', error: msg });
    }
    res.status(500).json({ message: 'Update failed', error: msg });
  }
});

export default router;