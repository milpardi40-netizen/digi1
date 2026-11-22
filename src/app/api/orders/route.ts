import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems, products, addresses, promoCodes, shops } from "@/db/schema";
import { eq, inArray, desc, sql } from "drizzle-orm";
import { getDefaultCommission } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

const FREE_SHIPPING_AT = 2_000_000;
const SHIPPING_COST = 45_000;

/* پیگیری سفارش‌ها */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "وارد نشده‌اید" }, { status: 401 });

  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));

  const ids = myOrders.map((o) => o.id);
  const items = ids.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, ids))
    : [];

  const itemsByOrder = new Map<number, typeof items>();
  for (const item of items) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }

  return NextResponse.json({
    orders: myOrders.map((o) => ({
      ...o,
      items: itemsByOrder.get(o.id) ?? [],
    })),
  });
}

/* ثبت سفارش جدید — با محاسبه کمیسیون پلتفرم و سهم هنرمندان */
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "برای ثبت سفارش ابتدا وارد حساب کاربری شوید" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items = rawItems
    .map((i: { id?: unknown; quantity?: unknown }) => ({
      id: Number(i.id),
      quantity: Math.min(Math.max(Math.floor(Number(i.quantity) || 1), 1), 99),
    }))
    .filter((i: { id: number }) => Number.isFinite(i.id) && i.id > 0);

  if (items.length === 0) {
    return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
  }

  const ids = items.map((i: { id: number }) => i.id);
  const dbProducts = await db.select().from(products).where(inArray(products.id, ids));
  const byId = new Map(dbProducts.map((p) => [p.id, p]));

  const missing = items.filter((i: { id: number }) => !byId.has(i.id));
  if (missing.length) {
    return NextResponse.json({ error: "برخی از آثار دیگر موجود نیستند" }, { status: 409 });
  }

  /* کمیسیون مؤثر برای هر فروشگاه */
  const shopIds = [...new Set(dbProducts.map((p) => p.shopId))];
  const shopRows = await db.select().from(shops).where(inArray(shops.id, shopIds));
  const shopById = new Map(shopRows.map((s) => [s.id, s]));
  const defaultCommission = await getDefaultCommission();

  let subtotal = 0;
  let commissionTotal = 0;
  let earningsTotal = 0;
  const lineItems = (items as Array<{ id: number; quantity: number }>).map((item) => {
    const p = byId.get(item.id)!;
    const shop = shopById.get(p.shopId);
    const pct = shop?.commissionPercent ?? defaultCommission;
    const gross = p.price * item.quantity;
    const commission = Math.round((gross * pct) / 100);
    const earning = gross - commission;
    subtotal += gross;
    commissionTotal += commission;
    earningsTotal += earning;
    return {
      productId: p.id,
      shopId: p.shopId,
      productName: p.name,
      image: p.image,
      quantity: item.quantity,
      price: p.price,
      commissionPercent: pct,
      earning,
    };
  });

  const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_COST;

  /* کد تخفیف */
  let discount = 0;
  let appliedPromo: string | null = null;
  const promoInput = String(body.promoCode ?? "").trim().toUpperCase();
  if (promoInput) {
    const [promo] = await db.select().from(promoCodes).where(eq(promoCodes.code, promoInput)).limit(1);
    if (promo && promo.active) {
      discount = Math.min(Math.floor((subtotal * promo.percent) / 100), promo.maxDiscount);
      appliedPromo = promo.code;
    }
  }

  const total = subtotal - discount + shipping;
  // تخفیف هم به نسبت کمیسیون کسر می‌شود (سهم هنرمند از مبلغ نهایی است)
  const commissionAfterDiscount = discount > 0
    ? Math.round(commissionTotal * ((subtotal - discount) / Math.max(subtotal, 1)))
    : commissionTotal;
  const earningsAfterDiscount = subtotal - discount - commissionAfterDiscount;

  /* آدرس */
  let addressSnapshot: Record<string, string> = {};
  if (body.addressId) {
    const [addr] = await db
      .select()
      .from(addresses)
      .where(eq(addresses.id, Number(body.addressId)))
      .limit(1);
    if (!addr || addr.userId !== user.id) {
      return NextResponse.json({ error: "آدرس انتخاب‌شده نامعتبر است" }, { status: 400 });
    }
    addressSnapshot = {
      title: addr.title,
      province: addr.province,
      city: addr.city,
      address: addr.address,
      plaque: addr.plaque ?? "",
      unit: addr.unit ?? "",
      postalCode: addr.postalCode ?? "",
      recipient: addr.recipient,
      phone: addr.phone,
    };
  } else if (body.address && typeof body.address === "object") {
    const a = body.address as Record<string, unknown>;
    const snap = {
      title: String(a.title ?? "خانه"),
      province: String(a.province ?? "").trim(),
      city: String(a.city ?? "").trim(),
      address: String(a.address ?? "").trim(),
      plaque: String(a.plaque ?? "").trim(),
      unit: String(a.unit ?? "").trim(),
      postalCode: String(a.postalCode ?? "").trim(),
      recipient: String(a.recipient ?? "").trim(),
      phone: String(a.phone ?? "").trim(),
    };
    if (!snap.province || !snap.city || snap.address.length < 8 || !snap.recipient || !/^09\d{9}$/.test(snap.phone)) {
      return NextResponse.json({ error: "مشخصات آدرس کامل نیست" }, { status: 400 });
    }
    addressSnapshot = snap;
  } else {
    return NextResponse.json({ error: "لطفاً آدرس تحویل را مشخص کنید" }, { status: 400 });
  }

  const orderId = await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        userId: user.id,
        status: "processing",
        total,
        discount,
        shipping,
        commission: commissionAfterDiscount,
        sellerEarnings: earningsAfterDiscount,
        promoCode: appliedPromo,
        addressSnapshot,
        note: String(body.note ?? "").trim() || null,
      })
      .returning({ id: orders.id });

    await tx.insert(orderItems).values(
      lineItems.map((li) => ({
        orderId: order.id,
        productId: li.productId,
        shopId: li.shopId,
        productName: li.productName,
        image: li.image,
        quantity: li.quantity,
        price: li.price,
        commissionPercent: li.commissionPercent,
        earning: Math.round(li.earning * ((subtotal - discount) / Math.max(subtotal, 1))),
        sellerStatus: "pending",
      }))
    );

    for (const item of items as Array<{ id: number; quantity: number }>) {
      await tx
        .update(products)
        .set({ stock: sql`greatest(${products.stock} - ${item.quantity}, 0)` })
        .where(eq(products.id, item.id));
    }

    return order.id;
  });

  return NextResponse.json({ id: orderId, total });
}
