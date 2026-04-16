/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups', // এটি Google Popup কাজ করতে সাহায্য করবে
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;