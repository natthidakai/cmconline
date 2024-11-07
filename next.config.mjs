/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // อนุญาตโดเมนนี้
  },
  distDir: '_next',
};

export default nextConfig;
