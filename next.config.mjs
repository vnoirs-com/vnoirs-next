import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(import.meta.dirname || process.cwd()),
  async redirects() {
    return [
      {
        source: "/terms",
        destination: "/terms-of-service",
        permanent: true,
      },
      {
        source: "/delete-data",
        destination: "/data-deletion",
        permanent: true,
      },
      {
        source: "/user-data-deletion",
        destination: "/data-deletion",
        permanent: true,
      },
      {
        source: "/data-deletion-instructions",
        destination: "/data-deletion",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
