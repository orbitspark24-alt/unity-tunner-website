import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/db";
import { slugify, type Product } from "@/lib/products";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getProducts());
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body?.name || body.price == null) {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  const products = await getProducts();
  let slug = body.slug ? slugify(body.slug) : slugify(body.name);
  if (products.some((p) => p.slug === slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const price = Number(body.price) || 0;
  const product: Product = {
    slug,
    name: body.name,
    brand: body.brand || "Unity Performance",
    category: body.category || "Merchandise",
    price,
    mrp: Number(body.mrp) || price,
    rating: Number(body.rating) || 5,
    reviews: Number(body.reviews) || 0,
    badge: body.badge || "",
    inStock: body.inStock !== false,
    fitment: Array.isArray(body.fitment) && body.fitment.length ? body.fitment : ["Universal"],
    hue: Number(body.hue) || 0,
    imageUrl: body.imageUrl || undefined,
    short: body.short || "",
    description: body.description || "",
    specs: Array.isArray(body.specs) ? body.specs : [],
  };
  products.unshift(product);
  await saveProducts(products);
  return NextResponse.json(product, { status: 201 });
}
