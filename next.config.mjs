/** @type {import('next').NextConfig} */

const nextConfig = {
  // Emits a self-contained server bundle so the Docker image does not have to
  // ship the whole node_modules tree.
  output: 'standalone',
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
