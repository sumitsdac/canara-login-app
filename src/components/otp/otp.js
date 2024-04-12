"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  SERVER_SIDE_VERIFY_OTP_API,
  AUTH_CODE_GEN_API,
} from "../../app/_lib/api";

const OtpForm = (props) => {
  const [otp, setOtp] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "* please fill all the required fields"
  );
  const [attemptLimitExceeded, setAttemptLimitExceeded] = useState(false);

  const handleOTPChange = (event) => {
    setOtp(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (otp === "") {
      setError(true);
      setErrorMessage("* Please fill all the required fields");
    } else {
      const headersObj = {
        "Content-type": "application/json",
      };

      const bodyContent = JSON.stringify({
        otp,
        session_identifier: props.sessionID,
      });

      try {
        axios(SERVER_SIDE_VERIFY_OTP_API, {
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
            } else if (res.status === 200) {
              window.location.replace(
                AUTH_CODE_GEN_API + "?session_identifier=" + props.sessionID
              );
            }
          })
          .catch((e) => {
            console.log(e?.response?.status);
            if (e.response?.data?.max_login_attempt_crossed) {
              setAttemptLimitExceeded(true);
            } else if (e.response.status === 400 || e.response.status === 401) {
              setErrorMessage("Invalid or expired OTP");
              setError(true);
            } else if (e.response.status === 415) {
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
    <form className="form">
      <h1 className="form_title"> OTP Validation </h1>
      <div className="form_div">
        <input
          type="text"
          className={`form_input required ${
            error ? (otp === "" ? "error" : "") : ""
          }`}
          placeholder=" "
          value={otp}
          onChange={handleOTPChange}
        />
        <label className="form_label">OTP</label>
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
          className="form_button"
          value="Submit"
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
    <h1 className="form-wrapper">OTP attempt limit has exceeded</h1>
  );
};

export default OtpForm;
