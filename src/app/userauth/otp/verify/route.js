import { VERIFY_OTP_API } from "../../../_lib/api";

export async function POST(req) {
  const { session_identifier, otp } = await req.json();

  const headersObj = {
    "Content-type": "application/json",
  };

  const bodyContent = JSON.stringify({
    otp,
    session_identifier,
  });

  return await new Promise((resolve, reject) => {
    fetch(VERIFY_OTP_API, {
      method: "post",
      headers: headersObj,
      body: bodyContent,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
