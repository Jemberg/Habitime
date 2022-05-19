import React, { Fragment, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { checkAuthentication } from "../auth/auth";
import Layout from "../components/layout";
import Cookies from "js-cookie";

const Settings = () => {
  const [categoryList, setCategoryList] = useState({});
  const [user, setUser] = useState({});

  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:3000/categories", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(parsed.categories);
        setCategoryList(parsed.categories);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  }, []);

  const handleChange = (event) => {
    console.log(event.target.name, " ", event.target.value);
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const renderList = categoryList.map((category) => (
    <Fragment>
      <div class="ui middle aligned divided list">
        <div class="item">
          <div class="right floated content">
            <div class="ui button red">Delete</div>
          </div>
          {/* TODO: Add editing option as well. */}
          <div class="content">{category.name}</div>
        </div>
      </div>
    </Fragment>
  ));

  return (
    <Layout>
      <Fragment>
        {!checkAuthentication() ? <Navigate to="/login" /> : null};
        <div className="ui grid container stackable equal width">
          <div className="row">
            <div className="column">
              <h2 class="ui header">Change Username</h2>
              <form className="ui form">
                <div className="field">
                  <label>Username</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    placeholder={user.name}
                  />
                </div>
                <button className="ui button green" onClick={() => {}}>
                  Confirm New Username
                </button>
              </form>

              <h2 class="ui header">Change E-mail Address</h2>
              <form className="ui form">
                <div className="field">
                  <label>Old E-mail Address</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="name"
                    placeholder={user.name}
                  />
                  <label>New E-mail Address</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="name"
                    placeholder={user.name}
                  />
                </div>
                <button className="ui button green" onClick={() => {}}>
                  Confirm New E-mail Address
                </button>
              </form>

              <h2 class="ui header">Change Password</h2>
              <form className="ui form">
                <div className="field">
                  <label>Old Password</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="name"
                    placeholder={user.name}
                  />
                  <label>New Password</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="name"
                    placeholder={user.name}
                  />
                  <label>Confirm New Password</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="name"
                    placeholder={user.name}
                  />
                </div>
                <button className="ui button green" onClick={() => {}}>
                  Confirm New Password
                </button>
              </form>
            </div>
            <div className="column">
              <h2 class="ui header">Category Options</h2>
              <form className="ui form" action="">
                <label>Add New Category</label>
                <input
                  onChange={handleChange}
                  type="password"
                  name="name"
                  placeholder={user.name}
                />
              </form>
              <h2 class="ui header">Currently Available Categories:</h2>
              {renderList}
            </div>
            <div className="column">
              <h2 class="ui header">Account Options</h2>
              <button className="ui button red" onClick={() => {}}>
                Delete Account
              </button>
              <button className="ui button red" onClick={() => {}}>
                Log Out All Devices
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    </Layout>
  );
};

export default Settings;
