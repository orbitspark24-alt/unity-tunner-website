import { NextRequest, NextResponse } from "next/server";
import { getReviews, saveReviews, makeId, type Review } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET approved reviews (optionally filtered by ?slug=)
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const reviews = (await getReviews())
    .filter((r) => r.approved && (!slug || r.slug === slug))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(reviews);
}

// Public review submission — lands unapproved for moderation.
export async function POST(req: NextRequest) {
  const { slug, name, rating, text } = await req.json();
  if (!slug || !name || !text || !rating) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const review: Review = {
    id: makeId("REV"),
    slug,
    name: String(name).slice(0, 60),
    rating: Math.min(5, Math.max(1, Number(rating) | 0)),
    text: String(text).slice(0, 800),
    approved: false,
    createdAt: new Date().toISOString(),
  };
  const reviews = await getReviews();
  reviews.push(review);
  await saveReviews(reviews);
  return NextResponse.json(review, { status: 201 });
}
