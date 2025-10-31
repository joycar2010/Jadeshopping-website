import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const ProductFileSchema = z.array(z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  currency: z.string().optional(),
  skus: z.array(z.object({
    skuCode: z.string().min(1),
    price: z.number().nonnegative(),
    stock: z.number().int().nonnegative().optional(),
  })).optional(),
  categories: z.array(z.string()).optional(),
}));

const CategoryFileSchema = z.array(z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  parentSlug: z.string().optional(),
}));

type Report = { passed: boolean; warnings: string[]; errors: string[] };

function loadJson<T>(file: string, schema: z.ZodSchema<T>): T | null {
  const full = path.resolve(process.cwd(), file);
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, 'utf-8');
  const data = JSON.parse(raw);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Schema validation failed for ${file}: ${parsed.error.message}`);
  }
  return parsed.data;
}

function validateProducts(products: z.infer<typeof ProductFileSchema>, categories: string[]): Report {
  const warnings: string[] = [];
  const errors: string[] = [];
  const slugSet = new Set<string>();
  const skuSet = new Set<string>();

  for (const p of products) {
    if (slugSet.has(p.slug)) errors.push(`Duplicate product slug: ${p.slug}`);
    slugSet.add(p.slug);
    if (!p.name) errors.push(`Product missing name for slug: ${p.slug}`);
    if (p.skus) {
      for (const s of p.skus) {
        if (skuSet.has(s.skuCode)) errors.push(`Duplicate SKU code: ${s.skuCode}`);
        skuSet.add(s.skuCode);
        if (s.price < 0) errors.push(`Negative price for sku: ${s.skuCode}`);
      }
    }
    if (p.categories) {
      for (const c of p.categories) {
        if (!categories.includes(c)) warnings.push(`Product '${p.slug}' references non-existent category slug: ${c}`);
      }
    }
  }

  return { passed: errors.length === 0, warnings, errors };
}

function validateCategories(cats: z.infer<typeof CategoryFileSchema>): Report {
  const warnings: string[] = [];
  const errors: string[] = [];
  const slugSet = new Set<string>();

  for (const c of cats) {
    if (slugSet.has(c.slug)) errors.push(`Duplicate category slug: ${c.slug}`);
    slugSet.add(c.slug);
    if (c.parentSlug && !slugSet.has(c.parentSlug)) warnings.push(`Category '${c.slug}' parent not found yet: ${c.parentSlug}`);
  }

  return { passed: errors.length === 0, warnings, errors };
}

async function main() {
  try {
    const productData = loadJson('data/products.json', ProductFileSchema) ?? [];
    const categoryData = loadJson('data/categories.json', CategoryFileSchema) ?? [];
    const catSlugs = categoryData.map(c => c.slug);

    const catReport = validateCategories(categoryData);
    const prodReport = validateProducts(productData, catSlugs);

    const summary = {
      categories: catReport,
      products: prodReport,
    };

    const passed = summary.categories.passed && summary.products.passed;
    console.log(JSON.stringify({ passed, summary }, null, 2));
    process.exit(passed ? 0 : 2);
  } catch (err: any) {
    console.error('Migration validation failed:', err?.message || err);
    process.exit(1);
  }
}

main();