/** @type {import('next').NextConfig} */

const nextConfig = {
  // basePath: "/CREaiVE",
  reactStrictMode: false,
  staticPageGenerationTimeout: 1000,
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
