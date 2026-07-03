import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const EDITABLE = [
  "name", "brand", "category", "price", "mrp", "rating", "reviews",
  "badge", "inStock", "fitment", "hue", "imageUrl", "short", "description", "specs",
] as const;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const body = await req.json();
  const products = await getProducts();
  const p = products.find((x) => x.slug === slug);
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rec = p as unknown as Record<string, unknown>;
  for (const key of EDITABLE) {
    if (key in body) {
      if (key === "price" || key === "mrp" || key === "rating" || key === "reviews" || key === "hue") {
        rec[key] = Number(body[key]) || 0;
      } else {
        rec[key] = body[key];
      }
    }
  }
  await saveProducts(products);
  return NextResponse.json(p);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const products = await getProducts();
  const next = products.filter((p) => p.slug !== slug);
  if (next.length === products.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await saveProducts(next);
  return NextResponse.json({ ok: true });
}
