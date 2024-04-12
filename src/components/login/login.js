/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";

import RefreshIcon from "../../../public/Refresh-icon.svg";
import { GenerateCaptcha } from "../../app/_lib/captcha";

import {
  SERVER_SIDE_VERIFY_LOGIN_API,
  AUTH_CODE_GEN_API,
} from "../../app/_lib/api";

const Login = (props) => {
  const recaptchaRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loginCaptcha, setLoginCaptcha] = useState("");
  const [error, setError] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [errorMessage, setErrorMessage] = useState(
    "* please fill all the required fields"
  );
  const [actualCaptcha, setActualCaptcha] = useState("");
  const [captchaHTMLString, setCaptchaHTMLString] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [attemptLimitExceeded, setAttemptLimitExceeded] = useState(false);

  const handleUsernameChange = (event) => {
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setUserPassword(event.target.value);
  };

  const handleLoginCaptchaChange = (event) => {
    setLoginCaptcha(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (userName === "" || userPassword === "" || loginCaptcha === "") {
      setErrorMessage("* Please fill all the required fields");
      setError(true);
    } else if (!validCaptcha(loginCaptcha)) {
      setErrorMessage("Please verify the captcha");
      setError(true);
      setCaptchaValid(false);
      initCaptcha();
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
            if (e.response?.data?.max_login_attempt_crossed) {
              setAttemptLimitExceeded(true);
            } else if (
              e?.response?.status === 400 ||
              e?.response?.status === 401
            ) {
              setErrorMessage(
                "Invalid Credentials. Please provide correct username/password"
              );
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

  const initCaptcha = () => {
    const captcha = GenerateCaptcha();
    setCaptchaHTMLString(captcha.html);
    setActualCaptcha(captcha.captchaValue);
  };

  const validCaptcha = (input) => {
    if (input === actualCaptcha) {
      return true;
    } else {
      return false;
    }
    return true;
  };

  useEffect(() => {
    props.validateSession();
    initCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (htmlContent) {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }
  return !attemptLimitExceeded ? (
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

      <div id="captcha" className="form_div">
        <div
          className="preview"
          dangerouslySetInnerHTML={{ __html: captchaHTMLString }}
        ></div>
        <div className="captcha_form">
          <input
            type="text"
            id="captcha_form"
            className={`form_input form_input_captcha required ${
              error ? (loginCaptcha === "" || !captchaValid ? "error" : "") : ""
            }`}
            placeholder=" "
            value={loginCaptcha}
            onChange={handleLoginCaptchaChange}
          />
          <label className="form_label form_label_captcha">Enter Captcha</label>
          <button
            className="captcha_refersh"
            onClick={(e) => {
              e.preventDefault();
              initCaptcha();
            }}
          >
            <img
              width={28}
              height={28}
              src={RefreshIcon.src}
              alt="refresh icon"
            />
          </button>
        </div>
      </div>
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
  ) : (
    <h1 className="form-wrapper">Login attempt limit has exceeded</h1>
  );
};

export default Login;
