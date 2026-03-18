import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
      {
        hostname: "ae8v8ta0oaszavs8.public.blob.vercel-storage.com",
      },
      {
        hostname: "logo.clearbit.com",
      },
    ],
  },
};

export default nextConfig;
