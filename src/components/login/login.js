/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

import {
  SERVER_SIDE_VERIFY_LOGIN_API,
  AUTH_CODE_GEN_API,
  client_key,
  client_secret,
  enable_captcha,
} from "../../app/_lib/api";

const Login = (props) => {
  const recaptchaRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [errorMessage, setErrorMessage] = useState(
    "* please fill all the required fields"
  );
  const [captchaValid, setCaptchaValid] = useState(false);
  const [attemptLimitExceeded, setAttemptLimitExceeded] = useState(false);

  const handleUsernameChange = (event) => {
    setUserName(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setUserPassword(event.target.value);
  };

  const handleRecaptchaVerify = async (token) => {
    if (token) {
      try {
        await fetch("/userauth/captcha", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify({ secret: client_secret, token: token }),
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const captchaValue = recaptchaRef.current?.getValue() || "";
    if (userName === "" || userPassword === "") {
      setErrorMessage("* Please fill all the required fields");
      setError(true);
    } else if (!captchaValue && enable_captcha === "TRUE") {
      setErrorMessage("Please verify the captcha");
      setError(true);
      setCaptchaValid(false);
    } else {
      setCaptchaValid(true);

      const headersObj = {
        "Content-type": "application/json",
      };
      const bodyContent = JSON.stringify({
        username: userName,
        password: userPassword,
        session_identifier: props.sessionID,
      });

      try {
        axios(SERVER_SIDE_VERIFY_LOGIN_API, {
          method: "post",
          headers: headersObj,
          data: bodyContent,
        })
          .then((res) => {
            const contentType = res.headers.get("Content-Type");
            if (contentType && contentType.includes("text/html")) {
              setHtmlContent(res.data);
            } else if (contentType && contentType.includes("text/plain")) {
              setHtmlContent(res.data);
            } else {
              if (res?.data?.status) {
                if (res.data.status === "otp") {
                  props.setUserLoginStatus(true);
                } else if (res.data.status === "success") {
                  window.location.replace(
                    AUTH_CODE_GEN_API + "?session_identifier=" + props.sessionID
                  );
                }
              }
            }
          })
          .catch((e) => {
            console.log(e?.response?.status);
            if (e.response?.data?.max_login_attempt_crossed) {
              window.history.replaceState(
                window.history.state,
                "",
                window.location.origin
              );
              setAttemptLimitExceeded(true);
            } else if (
              e?.response?.status === 400 ||
              e?.response?.status === 401
            ) {
              if (
                e?.response?.data.httpMessage === "oauth_flow_status is invalid"
              ) {
                setErrorMessage("* Invalid Session");
              } else {
                setErrorMessage(
                  "Invalid Credentials. Please provide correct username/password"
                );
              }
              setError(true);
            } else if (e?.response?.status === 415) {
              setErrorMessage("Invalid Content or Media Type");
              setError(true);
            } else {
              setErrorMessage("Server Error. Please try again Later");
              setError(true);
            }
          });
      } catch (e) {
        setErrorMessage("Server Error. Please try again Later");
        setError(true);
      }
    }
  };

  useEffect(() => {
    props.validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (htmlContent) {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }

  return !attemptLimitExceeded ? (
    <>
      <form className="form">
        <h1 className="form_title"> Log In </h1>
        <div className="form_div">
          <input
            type="text"
            className={`form_input required ${
              error ? (userName === "" ? "error" : "") : ""
            }`}
            placeholder=" "
            value={userName}
            onChange={handleUsernameChange}
          />
          <label className="form_label">Username</label>
        </div>
        <div className="form_div">
          <input
            type="password"
            className={`form_input required ${
              error ? (userPassword === "" ? "error" : "") : ""
            }`}
            placeholder=" "
            value={userPassword}
            onChange={handlePasswordChange}
          />
          <label className="form_label">Password</label>
        </div>

        {enable_captcha === "TRUE" && (
          <div className={"captch-v2"}>
            <ReCAPTCHA
              sitekey={client_key}
              ref={recaptchaRef}
              onChange={handleRecaptchaVerify}
            />
          </div>
        )}
        <div className="button-wrapper">
          {error ? (
            <div
              className="error"
              dangerouslySetInnerHTML={{ __html: errorMessage }}
            ></div>
          ) : null}
          <input
            type="submit"
            className="form_button login"
            value="Log In"
            onClick={onSubmit}
          />
          <input
            type="submit"
            className="form_button secondary"
            value="Cancel"
            onClick={(e) => props.cancelLogin(e)}
          />
        </div>
      </form>
    </>
  ) : (
    <h1 className="form-wrapper">Login attempt limit has exceeded</h1>
  );
};

export default Login;
