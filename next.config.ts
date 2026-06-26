/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable gzip compression for server responses
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "taqueria.progressionstudios.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lunchbox.progressionstudios.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/courses", destination: "/shop", permanent: true },
      { source: "/refound", destination: "/refund", permanent: true },
      { source: "/become-manager", destination: "/register", permanent: true },
      { source: "/help/:path*", destination: "/", permanent: true },
      { source: "/viewprofile/:path*", destination: "/dashboard/profile", permanent: true },
    ];
  },
  async headers() {
    return [
      // General HTML/pages: ensure COOP and allow stale-while-revalidate for better UX
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, must-revalidate, max-age=0, stale-while-revalidate=59',
          },
        ],
      },
      // _next static files (hashed) - long cache, immutable
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // next/image or other static assets - long cache
      {
        source: '/_next/image/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Public assets (images, fonts, etc.) served from root/public
      {
        source: '/:all*(jpg|jpeg|png|gif|webp|avif|svg|ico|css|js|woff2|woff|ttf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;