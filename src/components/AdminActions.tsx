"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  BadgeCheck,
  BadgeX,
  Sparkles,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/lib/toast";

async function patchJson(url: string, body: unknown, method = "PATCH") {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

/* ── فرم کمیسیون پیش‌فرض پلتفرم ── */
export function AdminSettingsForm({ initial }: { initial: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const [value, setValue] = useState(String(initial));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > 90) {
      toast("کمیسیون باید بین ۰ تا ۹۰ باشد");
      return;
    }
    setSaving(true);
    const { ok, data } = await patchJson("/api/admin/settings", { commissionPercent: n });
    setSaving(false);
    if (!ok) {
      toast(data.error ?? "خطا در ذخیره");
      return;
    }
    toast("کمیسیون پیش‌فرض پلتفرم ذخیره شد");
    router.refresh();
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <label htmlFor="commission" className="digi-label">کمیسیون پیش‌فرض هنربازار (٪)</label>
        <input
          id="commission"
          type="number"
          min={0}
          max={90}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          dir="ltr"
          className="digi-input text-left"
        />
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="flex h-11 items-center gap-1.5 rounded-xl bg-digi-text px-4 text-[11px] font-bold text-white transition hover:bg-black disabled:opacity-60"
      >
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        ذخیره
      </button>
    </div>
  );
}

/* ── تأیید / لغو تأیید فروشگاه ── */
export function AdminVerifyButton({ shopId, verified }: { shopId: number; verified: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const { ok, data } = await patchJson(`/api/admin/shops/${shopId}`, { verified: !verified });
    setLoading(false);
    if (!ok) {
      toast(data.error ?? "خطا");
      return;
    }
    toast(!verified ? "فروشگاه تأیید شد" : "تأیید فروشگاه لغو شد");
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[9.5px] font-bold transition disabled:opacity-60 ${
        verified ? "bg-red-50 text-brand hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      }`}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : verified ? <BadgeX size={13} /> : <BadgeCheck size={13} />}
      {verified ? "لغو تأیید" : "تأیید فروشگاه"}
    </button>
  );
}

/* ── کمیسیون اختصاصی فروشگاه ── */
export function AdminCommissionInput({ shopId, value }: { shopId: number; value: number | null }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pct, setPct] = useState(value === null ? "" : String(value));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const trimmed = pct.trim();
    const n = trimmed === "" ? null : Number(trimmed);
    if (n !== null && (!Number.isFinite(n) || n < 0 || n > 90)) {
      toast("عدد بین ۰ تا ۹۰ وارد کنید (خالی = پیش‌فرض)");
      return;
    }
    setSaving(true);
    const { ok, data } = await patchJson(`/api/admin/shops/${shopId}`, { commissionPercent: n });
    setSaving(false);
    if (!ok) {
      toast(data.error ?? "خطا");
      return;
    }
    toast("کمیسیون اختصاصی فروشگاه ذخیره شد");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min={0}
        max={90}
        placeholder="پیش‌فرض"
        value={pct}
        onChange={(e) => setPct(e.target.value)}
        dir="ltr"
        aria-label="کمیسیون اختصاصی درصد"
        className="h-8 w-16 rounded-lg border border-digi-border px-2 text-center text-[10px] outline-none focus:border-brand"
      />
      <button
        onClick={save}
        disabled={saving}
        aria-label="ذخیره کمیسیون"
        className="grid h-8 w-8 place-items-center rounded-lg bg-digi-text text-white transition hover:bg-black disabled:opacity-60"
      >
        {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
      </button>
    </div>
  );
}

/* ── منتخب سردبیر کردن اثر ── */
export function AdminFeatureButton({ productId, featured }: { productId: number; featured: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const { ok, data } = await patchJson(`/api/admin/products/${productId}`, { isFeatured: !featured });
    setLoading(false);
    if (!ok) {
      toast(data.error ?? "خطا");
      return;
    }
    toast(!featured ? "به منتخب سردبیر اضافه شد" : "از منتخب سردبیر حذف شد");
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={featured ? "حذف از منتخب سردبیر" : "افزودن به منتخب سردبیر"}
      aria-pressed={featured}
      className={`grid h-8 w-8 place-items-center rounded-lg border transition disabled:opacity-60 ${
        featured ? "border-saffron bg-amber-50 text-amber-600" : "border-digi-border text-gray-300 hover:text-amber-600"
      }`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={15} />}
    </button>
  );
}

/* ── حذف اثر ── */
export function AdminDeleteProduct({ productId, name }: { productId: number; name: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const remove = async () => {
    if (!window.confirm(`«${name}» برای همیشه حذف شود؟`)) return;
    setLoading(true);
    const { ok, data } = await patchJson(`/api/admin/products/${productId}`, {}, "DELETE");
    setLoading(false);
    if (!ok) {
      toast(data.error ?? "خطا");
      return;
    }
    toast("اثر حذف شد");
    router.refresh();
  };

  return (
    <button
      onClick={remove}
      disabled={loading}
      aria-label="حذف اثر"
      className="grid h-8 w-8 place-items-center rounded-lg border border-digi-border text-digi-muted transition hover:border-brand hover:bg-orange-50 hover:text-brand disabled:opacity-60"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}

/* ── تغییر وضعیت سفارش ── */
const ORDER_STATUSES = [
  { value: "processing", label: "در حال آماده‌سازی" },
  { value: "shipped", label: "ارسال شد" },
  { value: "delivered", label: "تحویل داده شد" },
  { value: "cancelled", label: "لغو شده" },
];

export function AdminOrderStatusSelect({ orderId, status }: { orderId: number; status: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  const change = async (next: string) => {
    setValue(next);
    setSaving(true);
    const { ok, data } = await patchJson(`/api/admin/orders/${orderId}`, { status: next });
    setSaving(false);
    if (!ok) {
      toast(data.error ?? "خطا در ثبت وضعیت");
      setValue(status);
      return;
    }
    toast("وضعیت سفارش به‌روزرسانی شد");
    router.refresh();
  };

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => change(e.target.value)}
      aria-label="وضعیت سفارش"
      className="h-8 rounded-lg border border-digi-border bg-white px-2 text-[9.5px] font-bold outline-none focus:border-brand disabled:opacity-60"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}

/* ── علامت‌گذاری تسویه به «واریز شد» ── */
export function AdminPayoutPaidButton({ payoutId }: { payoutId: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const markPaid = async () => {
    setLoading(true);
    const { ok, data } = await patchJson(`/api/admin/payouts/${payoutId}`, { status: "paid" });
    setLoading(false);
    if (!ok) {
      toast(data.error ?? "خطا");
      return;
    }
    toast("تسویه با موفقیت واریز شد");
    router.refresh();
  };

  return (
    <button
      onClick={markPaid}
      disabled={loading}
      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[9.5px] font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
      پرداخت شد
    </button>
  );
}
