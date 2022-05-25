import React, { Fragment, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { checkAuthentication, logOut } from "../auth/auth";
import Layout from "../components/layout";
import Cookie from "js-cookie";

const Settings = () => {
  const [categoryList, setCategoryList] = useState({});
  const [newCategory, setNewCategory] = useState({});

  const [confirmPass, setConfirmPass] = useState("");
  const [credentials, setCredentials] = useState({});

  let navigate = useNavigate();

  const handleConfirmPass = (event) => {
    setConfirmPass(event.target.value);
  };

  const handleChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
    console.log(credentials);
  };

  const handleSubmit = () => {
    setCredentials({
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handlePasswordChange = (credentials) => {
    // Checks if password matches confirmPassword.
    if (credentials.password !== confirmPass) {
      setCredentials({});
      console.log("confirmPass", confirmPass);
      toast.error("Passwords did not match, please try again.");
    }
  };

  // TODO: Add color selector and saving for category.

  const handleCategoryChange = (event) => {
    console.log(event.target.name, " ", event.target.value);
    setNewCategory({ ...newCategory, [event.target.name]: event.target.value });
    console.log("newCategory: ", newCategory);
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();

    addCategory(newCategory);

    setNewCategory({ name: "" });
  };

  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookie.get("token"));
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
        const parsed = JSON.parse(result);
        localStorage.setItem("user", JSON.stringify(parsed.user));

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        toast.success("User has been updated!");
        setCredentials((oldList) => [parsed.credentials]);
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

        toast.success("Category has been created!");
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

  const deleteAccount = async (id) => {
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:3000/users/me?auth_token={{auth_token}}`,
      requestOptions
    )
      .then((response) => response.text())

      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        toast.success("User has been deleted!");
        console.log(`User deleted with name of: ${parsed.user.username}`);
        setCategoryList((oldList) => oldList.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const logOutAll = async () => {
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:3000/users/logoutAll", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        toast.success("Logout Successful!");
        console.log(
          `User with name of: ${
            checkAuthentication().username
          } has been logged out`
        );
        Cookie.remove("token");
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
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
                  <label>Username: {checkAuthentication().username}</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Please enter a new username"
                  />
                </div>
                <button
                  className="ui button green"
                  onClick={(e) => {
                    e.preventDefault();
                    updateUser(credentials);
                    handleSubmit();
                  }}
                >
                  Confirm New Username
                </button>
              </form>

              <h2 className="ui header">Change E-mail Address</h2>
              <form className="ui form">
                <div className="field">
                  <label>E-mail Address: {checkAuthentication().email}</label>
                  <input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    value={credentials.email}
                    placeholder="Please enter a new email"
                  />
                </div>
                <button
                  className="ui button green"
                  onClick={(e) => {
                    e.preventDefault();
                    updateUser(credentials);
                    handleSubmit();
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
                    name="password"
                    value={credentials.password}
                    placeholder="Please enter new password"
                  />
                  <label>Confirm New Password</label>
                  <input
                    onChange={handleConfirmPass}
                    type="password"
                    name="confirmPassword"
                    value={credentials.confirmPassword}
                    placeholder="Please confirm new password"
                  />
                </div>
                <button
                  className="ui button green"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePasswordChange(credentials);
                    updateUser(credentials);
                    handleSubmit();
                  }}
                >
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
                    value={newCategory.name}
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
              <button
                className="ui button red"
                onClick={() => {
                  deleteAccount();
                  logOut(() => {
                    navigate("/login");
                  });
                }}
              >
                Delete Account
              </button>
              <button
                className="ui button red"
                onClick={() => {
                  logOutAll();
                }}
              >
                Log Out All Devices
              </button>
              <ToastContainer />
            </div>
          </div>
        </div>
      </Fragment>
    </Layout>
  );
};

export default Settings;
