import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/", destination: "/components/sistema/home" },
      { source: "/curriculos/cadastro", destination: "/components/sistema/paginas/Cadastro" },
      { source: "/curriculos/visualizar", destination: "/components/sistema/paginas/listaCurriculo" },
      { source: "/curriculos/visualizar/:id", destination: "/components/sistema/paginas/Detalhes/[id]" },
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
