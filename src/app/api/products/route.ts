import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

// Public storefront catalogue.
export async function GET() {
  return NextResponse.json(await getProducts());
}
