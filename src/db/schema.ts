import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  numeric,
  index,
} from "drizzle-orm/pg-core";

/* ─── کاربران (خریدار / فروشنده / ادمین) ───────────────────── */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("buyer"), // buyer | seller | admin
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ─── نشست‌ها ────────────────────────────────────────────────── */
export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    token: text("token").notNull().unique(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("sessions_token_idx").on(t.token)]
);

/* ─── فروشگاه‌های هنرمندان ───────────────────────────────────── */
export const shops = pgTable("shops", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  city: varchar("city", { length: 80 }).notNull(),
  story: text("story").notNull().default(""),
  avatarColor: varchar("avatar_color", { length: 30 }).notNull().default("#b4532a"),
  verified: boolean("verified").notNull().default(false),
  commissionPercent: integer("commission_percent"), // override درصد کمیسیون؛ null = پیش‌فرض پلتفرم
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ─── آدرس‌های کاربر ─────────────────────────────────────────── */
export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 80 }).notNull(),
  province: varchar("province", { length: 80 }).notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  address: text("address").notNull(),
  plaque: varchar("plaque", { length: 20 }),
  unit: varchar("unit", { length: 20 }),
  postalCode: varchar("postal_code", { length: 20 }),
  recipient: varchar("recipient", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ─── دسته‌بندی آثار هنری ───────────────────────────────────── */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  icon: varchar("icon", { length: 60 }).notNull().default("Palette"),
  color: varchar("color", { length: 30 }).notNull().default("#b4532a"),
  sort: integer("sort").notNull().default(0),
});

/* ─── آثار (کالاها) ───────────────────────────────────────────── */
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: varchar("slug", { length: 220 }).notNull().unique(),
    shopId: integer("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    categoryId: integer("category_id").references(() => categories.id),
    price: integer("price").notNull(),
    originalPrice: integer("original_price").notNull(),
    stock: integer("stock").notNull().default(10),
    rating: numeric("rating", { precision: 2, scale: 1 }).notNull().default("4.8"),
    ratingsCount: integer("ratings_count").notNull().default(0),
    salesCount: integer("sales_count").notNull().default(0),
    image: text("image").notNull(),
    description: text("description").notNull().default(""),
    specs: jsonb("specs").$type<Record<string, string>>().notNull().default({}),
    isFeatured: boolean("is_featured").notNull().default(false), // منتخب سردبیر
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("products_shop_idx").on(t.shopId),
    index("products_category_idx").on(t.categoryId),
    index("products_featured_idx").on(t.isFeatured),
  ]
);

/* ─── نظرات ──────────────────────────────────────────────────── */
export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    userName: varchar("user_name", { length: 120 }).notNull(),
    rating: integer("rating").notNull().default(5),
    text: text("text").notNull(),
    likes: integer("likes").notNull().default(0),
    dislikes: integer("dislikes").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("comments_product_idx").on(t.productId)]
);

/* ─── کدهای تخفیف ────────────────────────────────────────────── */
export const promoCodes = pgTable("promo_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  percent: integer("percent").notNull(),
  maxDiscount: integer("max_discount").notNull().default(500000),
  active: boolean("active").notNull().default(true),
});

/* ─── سفارش‌ها ────────────────────────────────────────────────── */
export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 30 }).notNull().default("processing"), // processing | shipped | delivered | cancelled
    total: integer("total").notNull(),
    discount: integer("discount").notNull().default(0),
    shipping: integer("shipping").notNull().default(0),
    commission: integer("commission").notNull().default(0), // سهم پلتفرم
    sellerEarnings: integer("seller_earnings").notNull().default(0), // سهم هنرمندان
    promoCode: varchar("promo_code", { length: 40 }),
    addressSnapshot: jsonb("address_snapshot").$type<Record<string, string>>().notNull().default({}),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("orders_user_idx").on(t.userId)]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
    shopId: integer("shop_id").references(() => shops.id, { onDelete: "set null" }),
    productName: text("product_name").notNull(),
    image: text("image").notNull(),
    quantity: integer("quantity").notNull(),
    price: integer("price").notNull(),
    commissionPercent: integer("commission_percent").notNull().default(10),
    earning: integer("earning").notNull().default(0), // سهم هنرمند از این قلم
    sellerStatus: varchar("seller_status", { length: 20 }).notNull().default("pending"), // pending | shipped
  },
  (t) => [
    index("order_items_order_idx").on(t.orderId),
    index("order_items_shop_idx").on(t.shopId),
  ]
);

/* ─── درخواست‌های تسویه حساب فروشندگان ──────────────────────── */
export const payoutRequests = pgTable("payout_requests", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id")
    .notNull()
    .references(() => shops.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending | paid
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
});

/* ─── تنظیمات پلتفرم (key-value) ────────────────────────────── */
export const settings = pgTable("settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: text("value").notNull(),
});

export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Shop = typeof shops.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Order = typeof orders.$inferSelect;
