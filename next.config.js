/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/greasy-man',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
