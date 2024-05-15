import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const { secret, token } = await req.json();
  const env = process.env.NEXT_PUBLIC_NODE_ENV;
  try {
    const encodedSecret = encodeURIComponent(secret);
    const encodedToken = encodeURIComponent(token);
    let proxy =
      env !== "test" && env !== ""
        ? {
            proxy: {
              host: "172.16.223.10",
              port: 8080,
              protocol: "http",
            },
          }
        : {};
    const captchaRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${encodedSecret}&response=${encodedToken}`,
      null,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
      }
    );
    const { success, score, action, ...rest } = captchaRes.data;

    const responseData = {
      success,
      score,
      action,
      rest,
    };
    return NextResponse.json({ responseData: responseData }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
