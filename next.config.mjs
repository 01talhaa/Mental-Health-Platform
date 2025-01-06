import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],  // Optimize image formats
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,  // Ensure environment variables are passed to the client
  },
  webpack: (config) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname, 'src'),  // Alias for cleaner imports
    };
    return config;
  },
};

export default nextConfig;
