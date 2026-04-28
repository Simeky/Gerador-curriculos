import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/curriculos/gerador',
        destination: '/sistema/curriculos/gerador',
        permanent: true,
      },
      {
        source: '/curriculos/detalhes',
        destination: '/sistema/curriculos/detalhes',
        permanent: true,
      },
      {
        source: '/curriculos/lista',
        destination: '/sistema/curriculos/lista',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
};

export default nextConfig;
