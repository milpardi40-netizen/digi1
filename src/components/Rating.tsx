import { Star } from "lucide-react";
import { toFaDigits } from "@/lib/format";

export default function Rating({
  rating,
  count,
  size = 13,
  showNumber = true,
}: {
  rating: number;
  count?: number;
  size?: number;
  showNumber?: boolean;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;

  return (
    <span className="flex items-center gap-1" dir="ltr">
      <span className="flex items-center gap-0.5 text-[#ffb400]">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <Star key={i} size={size} fill="currentColor" strokeWidth={0} />;
          if (i === full && half)
            return (
              <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
                <Star size={size} className="absolute inset-0 text-gray-300" fill="currentColor" strokeWidth={0} />
                <span className="absolute inset-0 overflow-hidden" style={{ width: size / 2 }}>
                  <Star size={size} fill="#ffb400" strokeWidth={0} />
                </span>
              </span>
            );
          return <Star key={i} size={size} className="text-gray-300" fill="currentColor" strokeWidth={0} />;
        })}
      </span>
      {showNumber && (
        <span className="text-[11px] font-bold text-digi-muted">
          {toFaDigits(rating.toFixed(1))}
          {count !== undefined && (
            <span className="font-normal text-gray-400"> ({toFaDigits(count)})</span>
          )}
        </span>
      )}
    </span>
  );
}
