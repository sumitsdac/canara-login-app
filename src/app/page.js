/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";

import Login from "../components/login/login";
import OtpForm from "../components/otp/otp";
import Header from "../components/header/header";

import "./page.scss";
import Loader from "../../public/Rolling.gif";

import { CANCEL_API } from "../app/_lib/api";

const App = () => {
  const [userLoggedIn, setUserLoginStatus] = useState(false);
  const [sessionID, setSessionID] = useState("");
  const [loadingSessionValidity, setLoadingSessionValidity] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);

  const validateSession = () => {
    // const OAuthSessionCookie = Cookies.get("OAuthSession");
    const searchParams = new URLSearchParams(document.location.search);
    const OAuthSessionQueryParam = searchParams.get("session_identifier");
    setSessionValid(true);
    setLoadingSessionValidity(false);
    setSessionID(OAuthSessionQueryParam);
  };

  const cancelLogin = (e) => {
    e.preventDefault();
    window.location.replace(CANCEL_API + "?session_identifier=" + sessionID);
  };

  useEffect(() => {
    validateSession();
  }, []);

  return (
    <div>
      <Header />
      <div className="form-wrapper">
        {!loadingSessionValidity ? (
          sessionValid ? (
            !userLoggedIn ? (
              <Login
                sessionID={sessionID}
                validateSession={validateSession}
                setUserLoginStatus={setUserLoginStatus}
                cancelLogin={cancelLogin}
              />
            ) : (
              <OtpForm
                sessionID={sessionID}
                validateSession={validateSession}
                cancelLogin={cancelLogin}
              />
            )
          ) : (
            <h1 className="form-wrapper">Invalid session</h1>
          )
        ) : (
          <img width="120px" height="120px" src={Loader.src} alt="Loader" />
        )}
      </div>
    </div>
  );
};

export default App;
