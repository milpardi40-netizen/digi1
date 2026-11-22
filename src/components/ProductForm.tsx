"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ImagePlus } from "lucide-react";
import { useToast } from "@/lib/toast";

type Category = { id: number; name: string };

export type ProductFormInitial = {
  id: number;
  name: string;
  description: string;
  categoryId: number | null;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  specs: Record<string, string>;
};

const SPEC_KEYS = ["جنس", "روش ساخت / تکنیک", "ابعاد", "محل ساخت"] as const;

export default function ProductForm({
  mode,
  categories,
  initial,
  suggestedImages,
}: {
  mode: "new" | "edit";
  categories: Category[];
  initial?: ProductFormInitial;
  suggestedImages?: string[];
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [categoryId, setCategoryId] = useState<string>(initial?.categoryId ? String(initial.categoryId) : "");
  const [price, setPrice] = useState(initial?.price ? String(initial.price) : "");
  const [originalPrice, setOriginalPrice] = useState(initial?.originalPrice ? String(initial.originalPrice) : "");
  const [stock, setStock] = useState(initial?.stock !== undefined ? String(initial.stock) : "1");
  const [image, setImage] = useState(initial?.image ?? "");
  const [specs, setSpecs] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    for (const key of SPEC_KEYS) base[key] = initial?.specs?.[key] ?? "";
    return base;
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      name: name.trim(),
      description: description.trim(),
      categoryId: categoryId ? Number(categoryId) : null,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      stock: Number(stock),
      image: image.trim(),
      specs,
    };
    try {
      const res = await fetch(
        mode === "new" ? "/api/seller/products" : `/api/seller/products/${initial!.id}`,
        {
          method: mode === "new" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast(data.error ?? "خطا در ذخیره اثر");
        setSaving(false);
        return;
      }
      toast(mode === "new" ? "اثر شما با موفقیت ثبت شد و در ویترین قرار گرفت" : "اثر با موفقیت ویرایش شد");
      router.push("/seller");
      router.refresh();
    } catch {
      toast("ارتباط با سرور برقرار نشد");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 lg:grid-cols-12">
      {/* ── اطلاعات اصلی ── */}
      <div className="space-y-4 rounded-2xl border border-digi-border/60 bg-white p-5 lg:col-span-7">
        <h2 className="text-[13px] font-extrabold">اطلاعات اثر</h2>

        <div>
          <label htmlFor="p-name" className="digi-label">نام اثر *</label>
          <input
            id="p-name"
            required
            minLength={5}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً: گلدان سفالی لعاب فیروزه‌ای با طرح گل و مرغ"
            className="digi-input"
          />
        </div>

        <div>
          <label htmlFor="p-desc" className="digi-label">توضیحات و داستان اثر</label>
          <textarea
            id="p-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="درباره ساخت، جنس، تکنیک و الهام‌گیری اثر بنویسید…"
            className="digi-input resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="p-cat" className="digi-label">دسته‌بندی</label>
            <select id="p-cat" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="digi-input">
              <option value="">انتخاب دسته‌بندی…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="p-stock" className="digi-label">موجودی (تعداد)</label>
            <input
              id="p-stock"
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              dir="ltr"
              className="digi-input text-left"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="p-price" className="digi-label">قیمت (تومان) *</label>
            <input
              id="p-price"
              type="number"
              min={1000}
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              dir="ltr"
              placeholder="1850000"
              className="digi-input text-left"
            />
          </div>
          <div>
            <label htmlFor="p-original" className="digi-label">قیمت قبل از تخفیف (تومان)</label>
            <input
              id="p-original"
              type="number"
              min={0}
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              dir="ltr"
              placeholder="خالی = بدون تخفیف"
              className="digi-input text-left"
            />
          </div>
        </div>

        {/* مشخصات فنی */}
        <div className="grid grid-cols-2 gap-3">
          {SPEC_KEYS.map((key) => (
            <div key={key} className={key === "روش ساخت / تکنیک" ? "col-span-2" : ""}>
              <label htmlFor={`spec-${key}`} className="digi-label">{key}</label>
              <input
                id={`spec-${key}`}
                value={specs[key]}
                onChange={(e) => setSpecs((s) => ({ ...s, [key]: e.target.value }))}
                placeholder={key === "جنس" ? "مثلاً سفال لعاب‌دار" : key === "ابعاد" ? "مثلاً ۳۵×۳۵ سانتی‌متر" : key === "محل ساخت" ? "مثلاً لالجین، همدان" : "مثلاً چرخ‌کاری دستی"}
                className="digi-input"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── تصویر ── */}
      <div className="space-y-3 rounded-2xl border border-digi-border/60 bg-white p-5 lg:col-span-5">
        <h2 className="flex items-center gap-2 text-[13px] font-extrabold">
          <ImagePlus size={17} className="text-brand" />
          تصویر اثر
        </h2>
        <div className="grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-xl border border-dashed border-digi-border bg-[#faf6ec]">
          {image.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="پیش‌نمایش اثر" className="h-full w-full object-contain" />
          ) : (
            <span className="text-[11px] text-gray-400">پیش‌نمایش تصویر اینجا نمایش داده می‌شود</span>
          )}
        </div>
        <div>
          <label htmlFor="p-image" className="digi-label">آدرس تصویر (https) *</label>
          <input
            id="p-image"
            required
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            dir="ltr"
            placeholder="https://images.pexels.com/photos/…"
            className="digi-input text-left text-[11px]"
          />
          <p className="mt-1.5 text-[9px] leading-4 text-gray-400">
            تصویر را در سرویس‌هایی مثل Pexels یا Imgur آپلود کنید و لینک مستقیم آن را اینجا بگذارید.
          </p>
        </div>
        {suggestedImages && suggestedImages.length > 0 && (
          <div>
            <div className="digi-label">یا از تصاویر پیشنهادی انتخاب کنید</div>
            <div className="grid grid-cols-4 gap-1.5">
              {suggestedImages.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImage(src)}
                  className={`overflow-hidden rounded-lg border-2 transition ${image === src ? "border-brand ring-2 ring-brand/30" : "border-transparent hover:border-brand/50"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="تصویر پیشنهادی" className="h-16 w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[13px] font-extrabold text-white transition hover:bg-brand-deep disabled:opacity-60"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {mode === "new" ? "ثبت اثر در ویترین" : "ذخیره تغییرات"}
        </button>
      </div>
    </form>
  );
}
