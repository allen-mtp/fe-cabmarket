/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Proxy API requests trong development để tránh CORS.
  // Ở production, frontend được deploy cùng domain với backend (hoặc backend
  // đã cấu hình CORS cho domain frontend trong CLIENT_URL).
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

    // Chỉ dùng proxy nếu NEXT_PUBLIC_API_URL không phải là relative path "/api"
    if (apiUrl.startsWith("http")) {
      const apiOrigin = new URL(apiUrl);
      return [
        {
          source: "/api/:path*",
          destination: `${apiOrigin.origin}/api/:path*`,
        },
      ];
    }

    return [];
  },
};

export default nextConfig;