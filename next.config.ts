import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit", "fontkit", "restructure", "deep-equal"],
};

export default nextConfig;
