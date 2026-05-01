import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/curriculos/gerador',
        destination: '/sistema/curriculos/gerador',
      },
      {
        source: '/curriculos/visualizar/:id',
        destination: '/sistema/curriculos/detalhes?id=:id',
      },
      {
        source: '/curriculos/visualizar',
        destination: '/sistema/curriculos/lista',
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
