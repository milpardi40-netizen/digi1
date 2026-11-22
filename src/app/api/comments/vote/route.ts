import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const id = Number(body.id);
  const vote = body.vote === "dislike" ? "dislike" : body.vote === "like" ? "like" : null;

  if (!Number.isFinite(id) || !vote) {
    return NextResponse.json({ error: "درخواست نامعتبر است" }, { status: 400 });
  }

  const [updated] = await db
    .update(comments)
    .set(vote === "like" ? { likes: sql`${comments.likes} + 1` } : { dislikes: sql`${comments.dislikes} + 1` })
    .where(eq(comments.id, id))
    .returning({ likes: comments.likes, dislikes: comments.dislikes });

  if (!updated) {
    return NextResponse.json({ error: "نظر یافت نشد" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
