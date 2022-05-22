import React, { Fragment, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { checkAuthentication } from "../auth/auth";
import Layout from "../components/layout";
import Cookies from "js-cookie";

const Settings = () => {
  const [categoryList, setCategoryList] = useState({});
  const [newCategory, setNewCategory] = useState({});

  const [confirmPass, setConfirmPass] = useState("");
  const [credentials, setCredentials] = useState({});

  const handleConfirmPass = (event) => {
    setConfirmPass(event.target.value);
  };

  const handleChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
    console.log(credentials);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Checks if password matches confirmPassword.
    if (credentials.password !== confirmPass) {
      setCredentials({
        username: "",
        email: "",
        password: "",
      });
      setConfirmPass("");
      toast.error("Passwords did not match, please try again.");
      return;
    }
  };

  // TODO: Add color selector and saving for category.

  const handleCategoryChange = (event) => {
    console.log(event.target.name, " ", event.target.value);
    setNewCategory({ ...newCategory, [event.target.name]: event.target.value });
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();

    addCategory(newCategory);
  };

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

  const updateUser = async (credentials) => {
    var raw = JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      email: credentials.email,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/users/me", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(parsed);
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        toast.success("User has been updated!");
        setCredentials((oldList) => [...oldList, parsed.credentials]);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  };

  const addCategory = async (category) => {
    var raw = JSON.stringify({
      name: newCategory.name,
      color: newCategory.color,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/categories", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsed = JSON.parse(result);
        console.log(parsed);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        toast.success("Task has been created!");
        setCategoryList((oldList) => [...oldList, parsed.category]);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  };

  const removeCategory = async (id) => {
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:3000/categories/${id}`, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(`Category deleted with name of: ${parsed.category.name}`);
        toast.success("Category has been deleted!");
        setCategoryList((oldList) => oldList.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const renderList = Array.from(categoryList).map((category) => (
    <Fragment key={category._id}>
      <div className="ui middle aligned divided list">
        <div className="item">
          <div className="right floated content">
            <div
              value={category._id}
              onClick={() => {
                removeCategory(category._id);
              }}
              className="ui button red"
            >
              Delete
            </div>
          </div>
          {/* TODO: Add editing option as well. */}
          <div className="content">{category.name}</div>
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
              <h2 className="ui header">Change Username</h2>
              <form className="ui form">
                <div className="field">
                  <label>Username</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="username"
                    placeholder={credentials.username}
                  />
                </div>
                <button className="ui button green" onClick={updateUser}>
                  Confirm New Username
                </button>
              </form>

              <h2 className="ui header">Change E-mail Address</h2>
              <form className="ui form">
                <div className="field">
                  <label>New E-mail Address</label>
                  <input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    placeholder="Please enter a new email."
                  />
                </div>
                <button
                  className="ui button green"
                  onClick={(e) => {
                    e.preventDefault();
                    updateUser(credentials);
                  }}
                >
                  Confirm New E-mail Address
                </button>
              </form>

              <h2 className="ui header">Change Password</h2>
              <form className="ui form">
                <div className="field">
                  <label>New Password</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="newPassword"
                    placeholder="Please enter new password."
                  />
                  <label>Confirm New Password</label>
                  <input
                    onChange={handleConfirmPass}
                    type="password"
                    name="confirmPassword"
                    placeholder={"Please confirm new password."}
                  />
                </div>
                <button className="ui button green" onClick={() => {}}>
                  Confirm New Password
                </button>
              </form>
            </div>
            <div className="column">
              <h2 className="ui header">Category Options</h2>
              <form className="ui form" action="">
                <label>Add New Category</label>
                <div className="field">
                  <input
                    onChange={handleCategoryChange}
                    type="text"
                    name="name"
                    placeholder="University"
                  />
                </div>
                <button
                  className="ui button green"
                  onClick={handleCategorySubmit}
                >
                  Add New Category
                </button>
              </form>
              <h2 className="ui header">Currently Available Categories:</h2>
              {renderList}
            </div>
            <div className="column">
              <h2 className="ui header">Account Options</h2>
              <div className="field"></div>
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
