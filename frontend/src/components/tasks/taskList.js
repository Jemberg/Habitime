import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState, Fragment, Section, Form } from "react";
import { toast, ToastContainer } from "react-toastify";

import { checkAuthentication } from "../../auth/auth";
import Layout from "../layout";
import Task from "./task";

const TaskList = () => {
  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:3000/tasks", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(parsed.tasks);
        setTaskList(parsed.tasks);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  }, []);

  const [taskList, setTaskList] = useState([]);

  const addTask = async (item) => {
    // TODO: Check if task properties are empty.

    var raw = JSON.stringify({
      user: checkAuthentication()._id,
      name: item.name,
      description: item.description,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/tasks", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        setTaskList((oldList) => [...oldList, parsed.task]);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  };

  const removeTask = async (id) => {
    // await api
    //   .delete(`/tasks/${id}`, {
    //     _id: id,
    //   })
    //   .then((response) => {
    //     setTaskList((oldList) => oldList.filter((item) => item._id !== id));
    //     console.log(response.data);
    //     console.log(taskList);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const editTask = async (id, item) => {
    // await api
    //   .patch(`/tasks/${id}`, {
    //     /* TODO: Add more items that are editable. */
    //     description: item.description,
    //     completed: item.completed,
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //     console.log(taskList);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const renderList = taskList.map((task) => (
    <Fragment>
      <Task key={task._id} item={task}></Task>
      {/* TODO: Add modal. */}
    </Fragment>
  ));

  const [item, setItem] = useState({
    name: "",
    description: "",
  });

  const handleChange = (event) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Test.");
    addTask(item);
  };

  return (
    <Fragment>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={item.name}
          name="name"
          onChange={handleChange}
        />
        <button type="submit">Click me!</button>
      </form>
      <div>{renderList}</div>
    </Fragment>
  );
};

export default TaskList;
