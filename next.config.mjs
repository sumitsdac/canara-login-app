/** @type {import('next').NextConfig} */
import Path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  sassOptions: {
    includePaths: [Path.join(__dirname, "app/styles")],
  },
  // output: "export",
  // distDir: "test-build",
  // serverRuntimeConfig: {
  //   proxy: {
  //     "/recaptcha/": {
  //       target: "http://172.16.223.10:8080",
  //       changeOrigin: true,
  //     },
  //   },
  // },
};

export default nextConfig;
