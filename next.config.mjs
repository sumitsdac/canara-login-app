/** @type {import('next').NextConfig} */
import Path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apidomain = `https://apigee-tr-test.digitalapicraft.com`;

const nextConfig = {
  sassOptions: {
    includePaths: [Path.join(__dirname, "app/styles")],
  },
  async headers() {
    return [
      {
        source: "/userauth/login/verify",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "false" },
          {
            key: "Access-Control-Allow-Origin",
            value: apidomain,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date",
          },
        ],
      },
      {
        source: "/userauth/otp/verify",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "false" },
          {
            key: "Access-Control-Allow-Origin",
            value: apidomain,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/userauth/login/verify",
        destination: `${apidomain}/user-auth/login/verify`,
      },
    ];
  },
  output: "export",
};

export default nextConfig;
