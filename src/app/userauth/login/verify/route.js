import { VERIFY_LOGIN_API } from "../../../_lib/api";

export async function POST(req) {
  try {
    const { username, password, session_identifier } = await req.json();

    const headersObj = {
      "Content-type": "application/json",
    };

    const bodyContent = JSON.stringify({
      username,
      password,
      session_identifier,
    });
    return await new Promise((resolve, reject) => {
      fetch(VERIFY_LOGIN_API, {
        method: "post",
        headers: headersObj,
        body: bodyContent,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((e) => {
          reject(e);
        });
    });
  } catch (err) {
    new Response(err);
  }
}
