/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backend = (process.env.NEXT_PUBLIC_API_URL || "https://patent-ipr-backend-express.onrender.com").replace(/\/+$/, "");

    return [
      {
        source: "/backend/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
