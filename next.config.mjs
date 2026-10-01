import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(import.meta.dirname || process.cwd()),
};

export default nextConfig;
