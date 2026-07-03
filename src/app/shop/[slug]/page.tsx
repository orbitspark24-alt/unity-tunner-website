import { notFound } from "next/navigation";
import { getProducts, getProductBySlug, getReviews } from "@/lib/db";
import { relatedFrom } from "@/lib/products";
import ProductDetail from "./ProductDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return { title: p.name, description: p.short };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, all, reviews] = await Promise.all([getProductBySlug(slug), getProducts(), getReviews()]);
  if (!product) notFound();

  const related = relatedFrom(all, product);
  const productReviews = reviews
    .filter((r) => r.slug === slug && r.approved)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.short,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <ProductDetail product={product} related={related} reviews={productReviews} />
    </>
  );
}
