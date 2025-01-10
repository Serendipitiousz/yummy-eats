import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  // async rewrites() {
  //   return [
  //     { source: '/create', destination: '/views/create' },
  //     { source: '/blog', destination: '/views/blog' },
  //     { source: '/user', destination: '/views/user' },
  //   ];
  // },
 

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      }
    ],
  },
}
