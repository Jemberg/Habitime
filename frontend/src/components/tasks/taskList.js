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
      // user: checkAuthentication()._id,
      name: item.name,
    });

    console.log(`addTask payload contents are: ${raw}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch("http://localhost:3000/tasks", requestOptions)
      .then((response) => {
        console.log(response.json());
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
  };

  const editTask = async (id, item) => {
    console.log(`Editing item with the ID of ${id}`);
    console.log(item);

    var raw = JSON.stringify({
      name: item.name,
      description: item.description,
      category: item.category,
      priority: item.priority,
      dueDate: item.dueDate /* .toUTCString() */,
    });

    console.log(raw);

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`http://localhost:3000/tasks/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(`Task edited with name of: ${parsed.task.name}`);
        toast.success("Task has been deleted!");

        // Delete task, then add updated task back in, this is not very efficient lol.
        setTaskList((oldList) => oldList.filter((item) => item._id !== id));
        setTaskList((oldList) => [...oldList, parsed.task]);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  };

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

  const renderList = taskList.map((task) => (
    <Fragment>
      <div style={{ margin: "0px" }} class="ui segment">
        <div className="ui grid container stackable equal width">
          <div className="row">
            <div className="column left aligned">
              <Task key={task._id} item={task}></Task>
              <EditTaskModal
                removeTask={() => removeTask(task._id)}
                editTask={(updatedItem) => editTask(task._id, updatedItem)}
                itemProps={task}
              ></EditTaskModal>
            </div>

            <div className="column right aligned three wide">
              <div style={{ transform: "scale(2)" }} class="ui fitted checkbox">
                <input type="checkbox" />
                <label></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  ));

  return (
    <Fragment>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div class="ui grid container equal width">
          <div class="column row">
            <div class="left aligned column">
              <div className="fluid ui input">
                <input
                  type="text"
                  value={item.name}
                  name="name"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div class="right aligned column">
              <button className="fluid ui button" type="submit">
                Add Task
              </button>
            </div>
          </div>
        </div>
      </form>
      <div class="ui raised segments">
        <div>{renderList}</div>
      </div>
    </Fragment>
  );
};

export default TaskList;
