/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  // serve modern formats for next/image (logo etc.)
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // long-cache static brand assets served from /public
  async headers() {
    return [
      {
        source: "/:file(unity-performance-logo\\.jpeg|favicon\\.png|ecu-highlight\\.png)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
