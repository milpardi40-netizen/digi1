import { and, asc, desc, eq, gte, ilike, inArray, lte, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { products, shops, categories } from "@/db/schema";

export type CatalogParams = {
  q?: string;
  category?: string; // slug دسته‌بندی
  shop?: string; // slug فروشگاه‌ها (با کاما)
  featured?: boolean;
  min?: number;
  max?: number;
  sort?: string; // default | price_asc | price_desc | sales | rating | newest | discount
  limit?: number;
  offset?: number;
};

export type ProductRow = {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  stock: number;
  rating: string;
  ratingsCount: number;
  salesCount: number;
  isFeatured: boolean;
  createdAt: Date;
  shopId: number;
  shopName: string;
  shopSlug: string;
  shopCity: string;
  shopVerified: boolean;
  shopAvatarColor: string;
  categoryName: string | null;
  categorySlug: string | null;
  categoryId: number | null;
};

export async function queryProducts(p: CatalogParams): Promise<{ products: ProductRow[]; total: number }> {
  const conditions: SQL[] = [];

  if (p.q?.trim()) {
    const pattern = `%${p.q.trim()}%`;
    conditions.push(
      sql`(${ilike(products.name, pattern)} OR coalesce(${shops.name}, '') ilike ${pattern})`
    );
  }
  if (p.category) conditions.push(eq(categories.slug, p.category));
  if (p.shop) {
    const slugs = p.shop.split(",").map((s) => s.trim()).filter(Boolean);
    if (slugs.length) conditions.push(inArray(shops.slug, slugs));
  }
  if (p.featured) conditions.push(eq(products.isFeatured, true));
  if (p.min !== undefined) conditions.push(gte(products.price, p.min));
  if (p.max !== undefined) conditions.push(lte(products.price, p.max));

  const where = conditions.length ? and(...conditions) : undefined;

  let orderBy: SQL[] = [desc(products.isFeatured), desc(products.salesCount)];
  switch (p.sort) {
    case "price_asc":
      orderBy = [asc(products.price)];
      break;
    case "price_desc":
      orderBy = [desc(products.price)];
      break;
    case "sales":
      orderBy = [desc(products.salesCount)];
      break;
    case "rating":
      orderBy = [desc(products.rating)];
      break;
    case "newest":
      orderBy = [desc(products.createdAt)];
      break;
    case "discount":
      orderBy = [desc(sql`(1 - ${products.price}::numeric / nullif(${products.originalPrice}, 0))`)];
      break;
  }

  const limit = Math.min(Math.max(p.limit ?? 12, 1), 48);
  const offset = Math.max(p.offset ?? 0, 0);

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      image: products.image,
      price: products.price,
      originalPrice: products.originalPrice,
      stock: products.stock,
      rating: products.rating,
      ratingsCount: products.ratingsCount,
      salesCount: products.salesCount,
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
      shopId: shops.id,
      shopName: shops.name,
      shopSlug: shops.slug,
      shopCity: shops.city,
      shopVerified: shops.verified,
      shopAvatarColor: shops.avatarColor,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryId: categories.id,
    })
    .from(products)
    .innerJoin(shops, eq(shops.id, products.shopId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .where(where)
    .orderBy(...orderBy)
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .innerJoin(shops, eq(shops.id, products.shopId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .where(where);

  return { products: rows, total: count };
}

export async function getProductBySlug(slug: string) {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      image: products.image,
      price: products.price,
      originalPrice: products.originalPrice,
      stock: products.stock,
      rating: products.rating,
      ratingsCount: products.ratingsCount,
      salesCount: products.salesCount,
      description: products.description,
      specs: products.specs,
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
      shopId: shops.id,
      shopName: shops.name,
      shopSlug: shops.slug,
      shopCity: shops.city,
      shopVerified: shops.verified,
      shopAvatarColor: shops.avatarColor,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryId: categories.id,
    })
    .from(products)
    .innerJoin(shops, eq(shops.id, products.shopId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .where(eq(products.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}
