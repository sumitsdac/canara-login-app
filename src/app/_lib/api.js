const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV;
export const client_key =
  process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID ||
  "6LcyGbQpAAAAAG94mubl5oVHdjkOrAbygzm5MIze";
export const client_secret =
  process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_SECRET ||
  "6LcyGbQpAAAAAFVU6baN5ALmYiKAn3jGyvmJzye";
export const enable_captcha = process.env.NEXT_PUBLIC_ENABLE_CAPTCHA || "TRUE";

var env = NODE_ENV;

export const PROXY = {
  protocol: "http",
  host: "172.16.223.10",
  port: 8080,
};

export const PROXY_URI = "http://172.16.223.10:8080";

export const domain =
  env === "test"
    ? "apigee-tr-test.digitalapicraft.com"
    : env === "dev"
    ? "dev-apibanking.canarabank.in"
    : env === "uat"
    ? "uat-apibanking.canarabank.in"
    : env === "prod"
    ? "apibanking.canarabank.in"
    : env === "sandbox"
    ? "sandbox-apibanking.canarabank.in"
    : "apigee-tr-test.digitalapicraft.com";
export const VERIFY_LOGIN_API = `https://${domain}/v1/user-auth/login/verify`;
export const VERIFY_OTP_API = `https://${domain}/v1/user-auth/otp/verify`;
export const CANCEL_API = `https://${domain}/v1/user-auth/cancel`;
export const AUTH_CODE_GEN_API = `https://${domain}/v1/oauth2/auth-code`;

// dev-apibanking.canarabank.in -> dev
// uat-apibanking.canarabank.in -> UAT
// apigee-tr-test.digitalapicraft.com -> Initial testing
// apibanking.canarabank.in -> prod
// sandbox-apibanking.canarabank.in

// Server Side Api Path
export const portalDomain =
  env === "test"
    ? "https://canarabankfe.digitalapicraft.com"
    : env === "dev"
    ? "https://dev-oneapim.canarabank.in:8443"
    : env === "uat"
    ? "https://uat-login.canarabank.in"
    : env === "prod"
    ? "https://login-corp.canarabank.in"
    : "";

// localhost:- keep it empty
// lab server :- https://canarabankfe.digitalapicraft.com
// dev:- https://dev-apibanking.canarabank.in
// uat:- https://uat-apibanking.canarabank.in
// prod:- https://login-corp.canarabank.in
export const server_side_proxy = `${portalDomain}/userauth/captcha`;
export const SERVER_SIDE_VERIFY_LOGIN_API = `${portalDomain}/userauth/login/verify`;
export const SERVER_SIDE_VERIFY_OTP_API = `${portalDomain}/userauth/otp/verify`;
