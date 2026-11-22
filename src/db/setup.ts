/**
 * راه‌اندازی خودکار دیتابیس روی سرور جدید (هاست واقعی)
 * - اگر جداول وجود نداشته باشند، deploy/schema.sql اجرا می‌شود
 * - اگر هیچ اثری در دیتابیس نباشد، داده‌های نمونه (seed) وارد می‌شود
 * اجرا: npx tsx src/db/setup.ts
 */
import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";
import { Pool } from "pg";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL تنظیم نشده است");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: url });
  try {
    const { rows } = await pool.query<{ exists: boolean }>(
      "SELECT to_regclass('public.users') IS NOT NULL AS exists"
    );

    if (!rows[0]?.exists) {
      console.log("🧱 ساخت جداول دیتابیس…");
      const sql = readFileSync(join(process.cwd(), "deploy", "schema.sql"), "utf8");
      await pool.query(sql);
      console.log("✅ جداول ساخته شد");
    } else {
      console.log("✔ جداول از قبل وجود دارند");
    }

    const { rows: countRows } = await pool.query<{ n: number }>(
      "SELECT count(*)::int AS n FROM products"
    );
    if ((countRows[0]?.n ?? 0) === 0) {
      await pool.end();
      console.log("🌱 دیتابیس خالی است؛ ورود داده‌های نمونه…");
      const result = spawnSync("npx", ["tsx", "src/db/seed.ts"], { stdio: "inherit", env: process.env });
      process.exit(result.status ?? 0);
    } else {
      console.log(`✔ ${countRows[0].n} اثر در دیتابیس موجود است؛ seed لازم نیست`);
    }
  } finally {
    await pool.end().catch(() => {});
  }
}

main().catch((e) => {
  console.error("❌ خطا در راه‌اندازی دیتابیس:", e);
  process.exit(1);
});
