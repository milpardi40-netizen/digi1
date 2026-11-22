"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { toFaDigits } from "@/lib/format";

export default function AddToCartButton({
  product,
  stock,
}: {
  product: {
    id: number;
    slug: string;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
  };
  stock: number;
}) {
  const { add } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    toast(`${qty > 1 ? `${toFaDigits(qty)} عدد ` : ""}کالا به سبد خرید اضافه شد`);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex items-stretch gap-2">
      {/* انتخاب تعداد */}
      <div className="flex items-center rounded-xl border border-digi-border">
        <button
          onClick={() => setQty((q) => Math.min(q + 1, Math.min(stock, 99)))}
          aria-label="افزایش تعداد"
          className="grid h-full w-9 place-items-center text-digi-muted transition hover:text-brand"
        >
          <Plus size={16} />
        </button>
        <span className="w-8 text-center text-sm font-extrabold tabular-nums">{toFaDigits(qty)}</span>
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="کاهش تعداد"
          className="grid h-full w-9 place-items-center text-digi-muted transition hover:text-brand"
        >
          <Minus size={16} />
        </button>
      </div>
      <button
        onClick={handleAdd}
        disabled={stock <= 0}
        className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[13px] font-extrabold text-white shadow-sm transition-all active:scale-[0.98] ${
          added ? "bg-emerald-dig" : "bg-brand hover:bg-brand-deep"
        } disabled:cursor-not-allowed disabled:bg-gray-300`}
      >
        {added ? (
          <>
            <Check size={19} />
            به سبد اضافه شد
          </>
        ) : (
          <>
            <ShoppingCart size={19} />
            افزودن به سبد خرید
          </>
        )}
      </button>
    </div>
  );
}
