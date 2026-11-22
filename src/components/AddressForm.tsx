"use client";

import { useState, type FormEvent } from "react";
import { Loader2, MapPinCheck } from "lucide-react";
import { useToast } from "@/lib/toast";

export type AddressRow = {
  id: number;
  title: string;
  province: string;
  city: string;
  address: string;
  plaque: string | null;
  unit: string | null;
  postalCode: string | null;
  recipient: string;
  phone: string;
};

const PROVINCES = [
  "تهران", "اصفهان", "خراسان رضوی", "فارس", "خوزستان", "آذربایجان شرقی", "مازندران",
  "البرز", "کرمان", "سیستان و بلوچستان", "آذربایجان غربی", "گیلان", "دیگر استان‌ها",
];

export default function AddressForm({
  onSaved,
  submitLabel = "ذخیره آدرس",
}: {
  onSaved: (address: AddressRow) => void;
  submitLabel?: string;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "خانه",
    province: "تهران",
    city: "",
    address: "",
    plaque: "",
    unit: "",
    postalCode: "",
    recipient: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "خطا در ثبت آدرس");
        return;
      }
      toast("آدرس شما با موفقیت ذخیره شد");
      onSaved(data.address);
      setForm((f) => ({ ...f, city: "", address: "", plaque: "", unit: "", postalCode: "" }));
    } catch {
      toast("ارتباط با سرور برقرار نشد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3">
      <div>
        <label className="digi-label" htmlFor="addr-title">عنوان آدرس</label>
        <select id="addr-title" value={form.title} onChange={set("title")} className="digi-input">
          <option value="خانه">خانه</option>
          <option value="محل کار">محل کار</option>
          <option value="سایر">سایر</option>
        </select>
      </div>
      <div>
        <label className="digi-label" htmlFor="addr-province">استان</label>
        <select id="addr-province" value={form.province} onChange={set("province")} className="digi-input">
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="digi-label" htmlFor="addr-city">شهر *</label>
        <input id="addr-city" required value={form.city} onChange={set("city")} placeholder="مثلاً تهران، کرج، اصفهان" className="digi-input" />
      </div>
      <div>
        <label className="digi-label" htmlFor="addr-recipient">گیرنده *</label>
        <input id="addr-recipient" required value={form.recipient} onChange={set("recipient")} placeholder="نام و نام خانوادگی تحویل‌گیرنده" className="digi-input" />
      </div>
      <div className="col-span-2">
        <label className="digi-label" htmlFor="addr-address">نشانی کامل *</label>
        <textarea
          id="addr-address"
          required
          minLength={8}
          rows={2}
          value={form.address}
          onChange={set("address")}
          placeholder="خیابان، کوچه، پلاک…"
          className="digi-input resize-none"
        />
      </div>
      <div>
        <label className="digi-label" htmlFor="addr-plaque">پلاک</label>
        <input id="addr-plaque" value={form.plaque} onChange={set("plaque")} placeholder="۱۲" className="digi-input" />
      </div>
      <div>
        <label className="digi-label" htmlFor="addr-unit">واحد</label>
        <input id="addr-unit" value={form.unit} onChange={set("unit")} placeholder="۳" className="digi-input" />
      </div>
      <div>
        <label className="digi-label" htmlFor="addr-postal">کد پستی</label>
        <input id="addr-postal" value={form.postalCode} onChange={set("postalCode")} inputMode="numeric" placeholder="1418835533" className="digi-input" dir="ltr" />
      </div>
      <div>
        <label className="digi-label" htmlFor="addr-phone">موبایل تحویل *</label>
        <input id="addr-phone" required inputMode="numeric" value={form.phone} onChange={set("phone")} placeholder="09123456789" className="digi-input" dir="ltr" />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-digi-text text-[12px] font-bold text-white transition hover:bg-[#2b2c47] disabled:opacity-60"
      >
        {saving ? <Loader2 size={17} className="animate-spin" /> : <MapPinCheck size={17} />}
        {submitLabel}
      </button>
    </form>
  );
}
