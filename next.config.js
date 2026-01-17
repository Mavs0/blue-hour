/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desabilitar cache do webpack em desenvolvimento se houver problemas
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Em caso de problemas com cache, descomente a linha abaixo:
      // config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
