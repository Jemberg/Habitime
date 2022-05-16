import React, { useState, Fragment, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { authenticate, checkAuthentication } from "./auth";

import Background from "../assets/layered-waves-haikei.svg";
import Logo from "../assets/logo_transparent.png";

// TODO: Remove transparent border for the form.
const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/users/login", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }
        authenticate(parsed, () => {
          setCredentials({ password: "", email: "" });
        });
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
        setCredentials({ password: "", email: "" });
      });
  };

  return (
    <Fragment>
      <Helmet>
        <style>
          {`body { background-image: url(${Logo}),url(${Background});
            background-color: #1c002b;
            background-repeat: no-repeat, no-repeat;
            background-position: top center, 0 0;
            background-size: 15rem, cover;
            color: white;
            }`}
        </style>
      </Helmet>
      {checkAuthentication() ? <Navigate to="/" /> : null};
      <div>
        <div
          style={{ height: "95vh" }}
          className="ui middle aligned center aligned grid "
        >
          <div style={{ maxWidth: "450px" }} className="column">
            <div
              style={{ backgroundColor: "unset" }}
              className="ui stacked segment loginwindow"
            >
              <form className="ui form">
                <h1>Habitime</h1>
                <div className="field">
                  <div className="ui equal width center aligned grid">
                    <div className="row">
                      <div className="column field left aligned">
                        <label style={{ color: "white" }}>Email</label>
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="field">
                  <div className="ui equal width center aligned grid">
                    <div className="row">
                      <div className="column field left aligned">
                        <label style={{ color: "white" }}>Password</label>
                      </div>
                      <div className="column field right aligned">
                        <div className="field">
                          {/* Currently redirects to register cause no password reset is possible. */}
                          <Link to="/register">Forgot password?</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={handleChange}
                    name="password"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="ui equal width center aligned grid">
                  <div className="row">
                    <div className="column left aligned">
                      <Link to="/register">
                        Don't have an account yet? Sign up!
                      </Link>
                    </div>
                    <ToastContainer />
                    <div className="column right aligned">
                      <button
                        className="ui button"
                        onClick={handleSubmit}
                        type="submit"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
// TODO: Add credits to developer, author of logo, and Haikei background in footer.

export default Login;
