import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_CLOUDINARY_UPLOAD_PRESET,
  },
};

export default nextConfig;
