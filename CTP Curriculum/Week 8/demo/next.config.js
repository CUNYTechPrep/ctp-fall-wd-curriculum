/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4566',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
