import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pastikan .well-known files di-serve dengan Content-Type yang benar
  // Apple (AASA) dan Google (assetlinks) membutuhkan application/json
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://hora-7394b.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.vorce.id",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      }
    ],
  },
};

export default nextConfig;
