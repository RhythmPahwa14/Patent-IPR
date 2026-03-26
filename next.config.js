/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backend = (
      process.env.NEXT_PUBLIC_API_URL ||
      "https://express-backend-ajedhzd3h0bfbse5.westindia-01.azurewebsites.net"
    ).replace(/\/+$/, "");

    return [
      {
        source: "/backend/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
