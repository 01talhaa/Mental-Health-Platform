// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      enabled: true
    },
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;
