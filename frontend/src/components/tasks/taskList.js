import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState, Fragment, Section, Form } from "react";
import { toast, ToastContainer } from "react-toastify";

import { checkAuthentication } from "../../auth/auth";
import Layout from "../layout";
import Task from "./task";
import EditTaskModal from "./editTaskModal";

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
    console.log(`Adding task with the ID of ${checkAuthentication()._id}`);

    var raw = JSON.stringify({
      user: checkAuthentication()._id,
      name: item.name,
    });

    console.log(`addTask payload contents are: ${raw}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/tasks", requestOptions)
      .then((response) => {
        console.log(response.text());
      })

      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        toast.success("Task has been created!");
        setTaskList((oldList) => [...oldList, parsed.task]);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  };

  const removeTask = async (id) => {
    console.log(`Deleting item with the ID of ${id}`);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:3000/tasks/${id}`, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(`Task deleted with name of: ${parsed.task.name}`);
        toast.success("Task has been deleted!");
        setTaskList((oldList) => oldList.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.log("error", error);
      });

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
      <div style={{ border: " 1px solid purple" }}>
        <Task key={task._id} item={task}></Task>
        <EditTaskModal
          removeTask={() => removeTask(task._id)}
          editTask={(updatedItem) => editTask(task._id, updatedItem)}
          itemProps={task}
        ></EditTaskModal>
      </div>
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

    if (!item.name || item.name.length === 0) {
      toast.error("Please enter a name for your task!");
      return;
    }

    addTask(item);
  };

  return (
    <Fragment>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div class="ui grid container equal width">
          <div class="four column row">
            <div class="left floated three wide column">
              <div className="ui input">
                <input
                  type="text"
                  value={item.name}
                  name="name"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div class="right floated one wide column">
              <button className="ui button" type="submit">
                Add Task
              </button>
            </div>
          </div>
        </div>
      </form>
      <div>{renderList}</div>
    </Fragment>
  );
};

export default TaskList;
