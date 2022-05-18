import React, { Fragment, useState } from "react";
import { Navigate } from "react-router-dom";

import { checkAuthentication } from "../auth/auth";
import Layout from "../components/layout";

const Settings = () => {
  const [user, setUser] = useState({});

  const handleChange = (event) => {
    console.log(event.target.name, " ", event.target.value);
    setUser({ ...user, [event.target.name]: event.target.value });
  };

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
              {/* TODO: Implement category list. */}
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
