import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Добавляем 90 и 100 к стандартным значениям
    qualities: [25, 50, 75, 90, 100],
  },
  /* config options here */
};

export default nextConfig;
