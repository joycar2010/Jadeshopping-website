import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';

const router = Router();

const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.string().optional(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { slug: 'asc' },
    });
    res.json(categories);
  } catch (err: any) {
    res.status(503).json({ message: 'DB unavailable', error: String(err?.message || err) });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const parsed = createCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues });
  }
  try {
    const { name, slug, parentId } = parsed.data;
    const created = await prisma.category.create({
      data: { name, slug, parentId: parentId ?? null },
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ message: 'Create failed', error: String(err?.message || err) });
  }
});

router.get('/tree', async (_req: Request, res: Response) => {
  try {
    const cats = await prisma.category.findMany({ orderBy: { slug: 'asc' } });
    const map = new Map<string, any>();
    const roots: any[] = [];
    for (const c of cats) {
      map.set(c.id, { ...c, children: [] });
    }
    for (const c of cats) {
      const node = map.get(c.id);
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId).children.push(node);
      } else {
        roots.push(node);
      }
    }
    res.json(roots);
  } catch (err: any) {
    res.status(503).json({ message: 'DB unavailable', error: String(err?.message || err) });
  }
});

export default router;