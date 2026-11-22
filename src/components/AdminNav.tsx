import Link from "next/link";
import { LayoutDashboard, Store, Package, ShoppingCart, Wallet, ShieldAlert } from "lucide-react";

export default function AdminNav() {
  const items = [
    { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
    { href: "/admin/sellers", label: "فروشگاه‌ها", icon: Store },
    { href: "/admin/products", label: "آثار", icon: Package },
    { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart },
    { href: "/admin/payouts", label: "تسویه‌ها", icon: Wallet },
  ];
  return (
    <div className="mb-3 flex flex-wrap items-center gap-1.5 overflow-x-auto border-b border-digi-border pb-2">
      <span className="me-2 flex items-center gap-1.5 text-[12px] font-black text-digi-text">
        <ShieldAlert size={16} className="text-brand" />
        پنل مدیریت
      </span>
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-1.5 rounded-lg border border-digi-border bg-white px-3 py-2 text-[10.5px] font-bold text-digi-muted transition hover:border-brand hover:text-brand"
        >
          <Icon size={14} />
          {label}
        </Link>
      ))}
    </div>
  );
}
