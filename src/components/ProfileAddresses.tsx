"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MapPin, Home, Building2, X } from "lucide-react";
import AddressForm, { type AddressRow } from "@/components/AddressForm";

export default function ProfileAddresses({ initialAddresses }: { initialAddresses: AddressRow[] }) {
  const router = useRouter();
  const [list, setList] = useState(initialAddresses);
  const [adding, setAdding] = useState(false);

  return (
    <section className="rounded-2xl border border-digi-border/60 bg-white p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[13px] font-extrabold">
          <MapPin size={17} className="text-brand" />
          آدرس‌های من
        </h2>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1 rounded-lg border border-digi-border px-3 py-1.5 text-[10.5px] font-bold transition hover:border-brand hover:text-brand"
        >
          {adding ? <X size={13} /> : <Plus size={13} />}
          {adding ? "بستن" : "افزودن آدرس"}
        </button>
      </div>

      {list.length === 0 && !adding && (
        <p className="rounded-xl border border-dashed border-digi-border py-6 text-center text-[11px] text-digi-muted">
          هنوز آدرسی ثبت نکرده‌اید.
        </p>
      )}

      <ul className="space-y-2">
        {list.map((addr) => (
          <li key={addr.id} className="rounded-xl border border-digi-border/70 p-3">
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 font-bold">
                {addr.title === "خانه" ? <Home size={10} /> : <Building2 size={10} />}
                {addr.title}
              </span>
              <span className="font-extrabold text-digi-text">{addr.recipient}</span>
              <span className="text-digi-muted" dir="ltr">{addr.phone}</span>
            </div>
            <p className="mt-1.5 text-[10.5px] leading-5 text-digi-muted">
              {addr.province}، {addr.city} — {addr.address}
              {addr.plaque ? `، پلاک ${addr.plaque}` : ""}
              {addr.unit ? `، واحد ${addr.unit}` : ""}
              {addr.postalCode ? ` — کد پستی ${addr.postalCode}` : ""}
            </p>
          </li>
        ))}
      </ul>

      {adding && (
        <div className="mt-3 border-t border-digi-border pt-3">
          <AddressForm
            onSaved={(addr) => {
              setList((prev) => [addr, ...prev]);
              setAdding(false);
              router.refresh();
            }}
          />
        </div>
      )}
    </section>
  );
}
