"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Loader2, Clock, CheckCircle2, Wallet } from "lucide-react";
import { useToast } from "@/lib/toast";
import { formatPrice, formatDateFa, toFaDigits } from "@/lib/format";

export type PayoutRow = {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
};

export default function PayoutSection({
  available,
  requests,
}: {
  available: number;
  requests: PayoutRow[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const requestPayout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seller/payout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "خطا در ثبت درخواست");
        return;
      }
      toast("درخواست تسویه ثبت شد؛ پس از تأیید ادمین واریز می‌شود");
      router.refresh();
    } catch {
      toast("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-digi-border/60 bg-white p-5">
      <h2 className="flex items-center gap-2 text-[13px] font-extrabold">
        <Wallet size={17} className="text-brand" />
        تسویه حساب با هنرمند
      </h2>

      {/* مانده قابل برداشت */}
      <div className="mt-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-4 text-white">
        <div className="text-[9.5px] text-white/75">مانده قابل برداشت (سفارش‌های تحویل‌شده)</div>
        <div className="mt-1 text-2xl font-black tabular-nums">
          {formatPrice(available)} <span className="text-[11px] font-medium">تومان</span>
        </div>
        <button
          onClick={requestPayout}
          disabled={loading || available <= 0}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-[12px] font-extrabold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Banknote size={17} />}
          درخواست تسویه {available > 0 ? `(${formatPrice(available)})` : ""}
        </button>
      </div>

      {/* تاریخچه تسویه‌ها */}
      {requests.length > 0 && (
        <div className="mt-3">
          <div className="mb-1.5 text-[10px] font-bold text-digi-muted">درخواست‌های تسویه</div>
          <ul className="max-h-44 space-y-1.5 overflow-y-auto thin-scroll">
            {requests.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-digi-border/60 px-3 py-2 text-[10px]"
              >
                <span className="flex items-center gap-1.5">
                  {r.status === "paid" ? (
                    <CheckCircle2 size={14} className="text-emerald-dig" />
                  ) : (
                    <Clock size={14} className="text-amber-600" />
                  )}
                  <span>
                    <span className="block font-bold tabular-nums">{formatPrice(r.amount)} تومان</span>
                    <span className="text-[8.5px] text-gray-400">{formatDateFa(r.createdAt)}</span>
                  </span>
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[8.5px] font-bold ${
                    r.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {r.status === "paid" ? "واریز شد" : "در انتظار تأیید"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 text-[8.5px] leading-4 text-gray-400">
        پس از تأیید ادمین، مبلغ به حساب بانکی ثبت‌شده در پروفایل شما واریز می‌شود. تسویه‌ها هر هفته انجام می‌شود.
      </p>
    </section>
  );
}
