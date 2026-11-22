"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  MessageSquareText,
  Loader2,
} from "lucide-react";
import Rating from "@/components/Rating";
import { useToast } from "@/lib/toast";
import { toFaDigits, formatDateFa } from "@/lib/format";

export type SerializedComment = {
  id: number;
  userName: string;
  rating: number;
  text: string;
  likes: number;
  dislikes: number;
  createdAt: string;
};

type Tab = "specs" | "desc" | "comments";

const AVATAR_COLORS = ["#ef394e", "#2f54eb", "#722ed1", "#00a049", "#fa8c16", "#13c2c2"];

export default function ProductTabs({
  productId,
  description,
  specs,
  comments: initialComments,
  rating,
  ratingsCount,
}: {
  productId: number;
  description: string;
  specs: Record<string, string>;
  comments: SerializedComment[];
  rating: number;
  ratingsCount: number;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("specs");
  const [comments, setComments] = useState(initialComments);
  const [voted, setVoted] = useState<Record<number, "like" | "dislike">>({});
  const [text, setText] = useState("");
  const [myRating, setMyRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const specEntries = Object.entries(specs);
  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    for (const c of comments) dist[Math.min(5, Math.max(1, c.rating)) - 1]++;
    return dist;
  }, [comments]);
  const maxDist = Math.max(1, ...distribution);

  const vote = async (id: number, type: "like" | "dislike") => {
    if (voted[id]) return;
    setVoted((v) => ({ ...v, [id]: type }));
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, likes: c.likes + (type === "like" ? 1 : 0), dislikes: c.dislikes + (type === "dislike" ? 1 : 0) }
          : c
      )
    );
    try {
      await fetch("/api/comments/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, vote: type }),
      });
    } catch {
      /* بی‌اثر */
    }
  };

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 3) {
      toast("متن نظر را کامل‌تر بنویسید");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: myRating, text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "خطا در ثبت نظر");
        return;
      }
      setText("");
      setMyRating(5);
      toast("نظر شما با موفقیت ثبت شد");
      router.refresh();
    } catch {
      toast("ارتباط با سرور برقرار نشد");
    } finally {
      setSubmitting(false);
    }
  };

  const tabBtn = (id: Tab, label: string) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      role="tab"
      aria-selected={tab === id}
      className={`relative border-b-2 px-4 pb-3 pt-1 text-[13px] font-bold transition-colors ${
        tab === id ? "border-brand text-brand" : "border-transparent text-digi-muted hover:text-digi-text"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section className="rounded-2xl border border-digi-border/60 bg-white">
      {/* تب‌ها */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-digi-border px-3 pt-3" role="tablist">
        {tabBtn("specs", "مشخصات فنی")}
        {tabBtn("desc", "توضیحات تکمیلی")}
        {tabBtn("comments", `نظرات کاربران (${toFaDigits(comments.length)})`)}
      </div>

      <div className="p-4 md:p-5">
        {/* ── مشخصات فنی ── */}
        {tab === "specs" && (
          <div className="overflow-hidden rounded-xl border border-digi-border/70">
            <table className="w-full text-right text-[12px]">
              <tbody>
                {specEntries.map(([key, value], i) => (
                  <tr key={key} className={i % 2 ? "bg-[#fafafa]" : "bg-white"}>
                    <th className="w-40 border-l border-digi-border/60 bg-[#f5f5f6] px-3 py-2.5 align-top font-bold text-digi-text">
                      {key}
                    </th>
                    <td className="px-3 py-2.5 leading-6 text-digi-text">{value}</td>
                  </tr>
                ))}
                {specEntries.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-digi-muted">مشخصاتی ثبت نشده است.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── توضیحات ── */}
        {tab === "desc" && (
          <div className="max-w-none leading-8 text-digi-text">
            <p className="text-[13px]">{description}</p>
            <ul className="mt-4 list-disc space-y-1.5 ps-5 text-[12px] text-digi-muted">
              <li>کالای ارسالی با برگ گارانتی شرکتی معتبر و هولوگرام اصالت کالا تحویل داده می‌شود.</li>
              <li>۷ روز مهلت تست و در صورت مغایرت، بازگشت کالا وجود دارد.</li>
              <li>ارسال اکسپرس در تهران و ارسال پستی دو روزه سراسر کشور.</li>
            </ul>
          </div>
        )}

        {/* ── نظرات ── */}
        {tab === "comments" && (
          <div className="grid gap-6 md:grid-cols-12">
            {/* خلاصه امتیازها */}
            <div className="md:col-span-4">
              <div className="rounded-xl border border-digi-border/70 bg-[#fafafa] p-4 text-center">
                <div className="text-4xl font-black tabular-nums text-digi-text">{toFaDigits(rating.toFixed(1))}</div>
                <div className="mt-1 flex justify-center">
                  <Rating rating={rating} size={16} showNumber={false} />
                </div>
                <div className="mt-1 text-[10.5px] text-digi-muted">
                  از مجموع {toFaDigits(ratingsCount)} امتیاز کاربران
                </div>
                <div className="mt-4 space-y-1.5" dir="ltr">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const value = distribution[star - 1];
                    return (
                      <div key={star} className="flex items-center gap-2 text-[10px]">
                        <span className="w-3 text-right tabular-nums text-digi-muted">{star}</span>
                        <Star size={10} className="text-[#ffb400]" fill="currentColor" strokeWidth={0} />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-[#ffb400] transition-all duration-500"
                            style={{ width: `${(value / maxDist) * 100}%` }}
                          />
                        </div>
                        <span className="w-5 tabular-nums text-digi-muted">{toFaDigits(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* فرم ثبت نظر */}
              <form onSubmit={submitComment} className="mt-4 rounded-xl border border-digi-border/70 p-4">
                <h3 className="text-[12px] font-extrabold">نظر شما چیست؟</h3>
                <div className="mt-2 flex items-center gap-1" dir="ltr">
                  {[1, 2, 3, 4, 5].map((s) => {
                    const active = (hoverRating || myRating) >= s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setMyRating(s)}
                        aria-label={`امتیاز ${s}`}
                      >
                        <Star
                          size={22}
                          className={active ? "text-[#ffb400]" : "text-gray-300"}
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      </button>
                    );
                  })}
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  placeholder="تجربه‌تان از خرید این کالا را بنویسید…"
                  className="digi-input mt-2 resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[12px] font-bold text-white transition hover:bg-brand-deep disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  ثبت نظر
                </button>
                <p className="mt-1.5 text-center text-[9px] text-gray-400">
                  برای ثبت نظر باید وارد حساب کاربری خود باشید.
                </p>
              </form>
            </div>

            {/* لیست نظرات */}
            <div className="space-y-3 md:col-span-8">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-digi-border py-12 text-center">
                  <MessageSquareText size={36} className="text-gray-300" />
                  <p className="text-[12px] font-bold text-digi-muted">هنوز نظری ثبت نشده است؛ اولین نفر باشید!</p>
                </div>
              ) : (
                comments.map((c) => (
                  <article key={c.id} className="rounded-xl border border-digi-border/70 p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-10 w-10 place-items-center rounded-full text-[15px] font-black text-white"
                        style={{ backgroundColor: AVATAR_COLORS[c.id % AVATAR_COLORS.length] }}
                      >
                        {c.userName.trim().charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <span className="text-[12px] font-extrabold">{c.userName}</span>
                          <Rating rating={c.rating} size={11} showNumber={false} />
                          <span className="text-[9.5px] text-gray-400">{formatDateFa(c.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-[12px] leading-6 text-digi-text">{c.text}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-[10px] text-digi-muted">آیا این نظر مفید بود؟</span>
                      <button
                        onClick={() => vote(c.id, "like")}
                        disabled={!!voted[c.id]}
                        className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] transition ${
                          voted[c.id] === "like"
                            ? "border-emerald-dig bg-emerald-50 text-emerald-dig"
                            : "border-digi-border text-digi-muted hover:border-emerald-dig hover:text-emerald-dig"
                        }`}
                      >
                        <ThumbsUp size={12} />
                        {toFaDigits(c.likes)}
                      </button>
                      <button
                        onClick={() => vote(c.id, "dislike")}
                        disabled={!!voted[c.id]}
                        className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] transition ${
                          voted[c.id] === "dislike"
                            ? "border-brand bg-red-50 text-brand"
                            : "border-digi-border text-digi-muted hover:border-brand hover:text-brand"
                        }`}
                      >
                        <ThumbsDown size={12} />
                        {toFaDigits(c.dislikes)}
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
