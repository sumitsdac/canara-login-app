const domain = "apigee-tr-test.digitalapicraft.com";

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
export const SERVER_SIDE_VERIFY_LOGIN_API = "/userauth/login/verify";
export const SERVER_SIDE_VERIFY_OTP_API = "/userauth/otp/verify";
