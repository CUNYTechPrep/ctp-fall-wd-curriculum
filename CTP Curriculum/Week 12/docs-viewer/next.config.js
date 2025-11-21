/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabled static export to enable API routes for Monaco type resolution
  // output: 'export',
  images: {
    unoptimized: true,
  },
  // basePath only for static export
  // basePath: process.env.NODE_ENV === 'production' ? '/ctp-fall-wd-curriculum/week12' : '',
}

module.exports = nextConfig
