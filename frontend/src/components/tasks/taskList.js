import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState, Fragment, Section, Form } from "react";
import { toast } from "react-toastify";

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
    console.log(item);

    var raw = JSON.stringify({
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

        console.log(parsed.tasks);
        setTaskList((oldList) => [...oldList, parsed.tasks]);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });

    // await api
    //   .post("/tasks", {
    //     description: item.description,
    //     completed: item.completed,
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //     console.log(taskList);
    //     setTaskList((oldList) => [...oldList, response.data]);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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

  const [name, setName] = useState("");

  const handleChange = (event) => {
    setName(event.target.value);
  };

  return (
    <Fragment>
      {/* <input type="text" value={name} onChange={handleChange} />
      <button type="submit" onSubmit={addTask({ name: name })}>
        Click me!
      </button> */}
      <div>{renderList}</div>
    </Fragment>
  );
};

export default TaskList;
