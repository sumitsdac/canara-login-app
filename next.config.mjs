/** @type {import('next').NextConfig} */
import Path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  sassOptions: {
    includePaths: [Path.join(__dirname, "app/styles")],
  },
  output: "export",
  distDir: "build",
};

export default nextConfig;
