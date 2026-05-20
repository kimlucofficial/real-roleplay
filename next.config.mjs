/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
=======
>>>>>>> 2561dc3f06c7c40e77a2d2b74a02da3a9c9462b8
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.discordapp.net",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },
};

export default nextConfig;