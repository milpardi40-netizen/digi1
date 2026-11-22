import Link from "next/link";
import { CATEGORY_IMAGES, px } from "@/lib/images";
import {
  Sparkles,
  Amphora,
  Scroll,
  Scissors,
  Handbag,
  Brush,
  Gem,
  TreePine,
  Hammer,
  Gift,
  Shapes,
  Layers,
  LampCeiling,
  type LucideIcon,
} from "lucide-react";

type Story = { label: string; href: string; icon: LucideIcon; hot?: boolean };

const STORIES: Story[] = [
  { label: "منتخب سردبیر", href: "/featured", icon: Sparkles, hot: true },
  { label: "سفال لالجین", href: "/category/pottery", icon: Amphora },
  { label: "گلیم کردستان", href: "/category/carpet", icon: Scroll },
  { label: "سوزن‌دوزی بلوچ", href: "/category/textile", icon: Scissors },
  { label: "چرم میزان", href: "/category/leather", icon: Handbag },
  { label: "نگارستان", href: "/category/painting", icon: Brush },
  { label: "فیروزه نیشابور", href: "/category/jewelry", icon: Gem },
  { label: "خاتم اصفهان", href: "/category/wood", icon: TreePine },
  { label: "قلمزنی", href: "/category/metal", icon: Hammer },
  { label: "سوغات شیراز", href: "/category/decor", icon: Gift },
  { label: "باتیک ترنج", href: "/category/pattern", icon: Shapes },
  { label: "نمدینه", href: "/category/felt", icon: Layers },
  { label: "چراغ‌چی", href: "/category/lighting", icon: LampCeiling },
];

/** ردیف فروشگاه‌های ویژه — استوری هنرمندان */
export default function Stories() {
  return (
    <div className="scrollbar-hide flex gap-4 overflow-x-auto rounded-2xl border border-digi-border/60 bg-white px-4 py-3 md:justify-between">
      {STORIES.map(({ label, href, icon: Icon, hot }) => (
        <Link key={label} href={href} className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5">
          <span
            className={`grid h-[68px] w-[68px] place-items-center rounded-full p-[3px] transition-transform duration-200 group-hover:scale-105 ${
              hot
                ? "bg-gradient-to-tr from-saffron via-brand to-amber-800"
                : "bg-gradient-to-tr from-brand/60 via-saffron/70 to-accent/60"
            }`}
          >
            <span className="relative block h-full w-full overflow-hidden rounded-full border-2 border-white bg-[#efe7d8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hot ? px(28271468, 200, 200) : CATEGORY_IMAGES[href.split("/").pop() ?? ""] ?? px(38528781, 200, 200)}
                alt={label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute bottom-0.5 left-1/2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full bg-white/90 text-digi-text shadow">
                <Icon size={11} strokeWidth={2.2} className={hot ? "text-brand" : ""} />
              </span>
            </span>
          </span>
          <span className="text-center text-[10px] font-medium leading-4 text-digi-text">{label}</span>
        </Link>
      ))}
    </div>
  );
}
