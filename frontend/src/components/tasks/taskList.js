import Cookies from "js-cookie";
import React, { useEffect, useState, Fragment, Section, Form } from "react";
import { toast, ToastContainer } from "react-toastify";

import { checkAuthentication } from "../../auth/auth";
import Task from "./task";
import EditTaskModal from "./editTaskModal";

const TaskList = ({ filter }) => {
  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  const [item, setItem] = useState({
    name: "",
  });

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/tasks`, requestOptions)
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
    setItem({ name: "" });
  };

  const onCompleteSubmit = (id, completed) => {
    console.log(id, completed);
    // document.getElementById(id).checked = !completed;
    const toastCompleted = completed ? "Completed" : "Uncompleted";
    toast.success(`Task has been ${toastCompleted}!`);
    editTask(id, { completed: completed });
  };

  const [taskList, setTaskList] = useState([]);

  const addTask = async (item) => {
    console.log(`Adding task with the ID of ${checkAuthentication()._id}`);

    var raw = JSON.stringify({
      name: item.name,
    });

    console.log(`addTask payload contents are: ${raw}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/tasks`, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        const parsed = JSON.parse(result);
        console.log(parsed);

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

    fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, requestOptions)
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
    // TODO: Put item back in corresponding index spot it was in before.

    var raw = JSON.stringify({
      name: item.name,
      description: item.description,
      completed: item.completed,
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

    fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(`Task edited with name of: ${parsed.task.name}`);

        // Delete task, then add updated task back in, this is not very efficient lol.
        setTaskList((oldList) => oldList.filter((item) => item._id !== id));
        setTaskList((oldList) => [...oldList, parsed.task]);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  };

  const renderList = Array.from(taskList)
    .filter((task) => {
      switch (filter) {
        case "All":
          return task;
        case "Completed":
          if (task.completed === true) return task;
          break;
        case "Active":
          if (task.completed === false) return task;
          break;
        case "highPriority":
          if (task.priority === 3) return task;
          break;
        case "mediumPriority":
          if (task.priority === 2) return task;
          break;
        case "lowPriority":
          if (task.priority === 1) return task;
          break;
        default:
          if (task.category === filter) return task;
          break;
      }
    })
    .map((task) => (
      <Fragment key={task._id}>
        <div style={{ margin: "0px" }} className="ui segment">
          <div className="ui grid container stackable equal width">
            <div className="row">
              <div className="column left aligned eight wide">
                <Task key={task._id} item={task}></Task>
              </div>

              <div className="column four wide" style={{ padding: "10px" }}>
                <div>
                  <div
                    style={{ transform: "scale(2)" }}
                    className="ui fitted checkbox"
                  >
                    <input
                      id={task._id}
                      checked={task.completed}
                      onChange={() => {}}
                      onClick={() => {
                        onCompleteSubmit(task._id, !task.completed);
                      }}
                      type="checkbox"
                    />
                    <label></label>
                  </div>
                </div>
              </div>
              <div className="column four wide">
                <EditTaskModal
                  removeTask={() => removeTask(task._id)}
                  editTask={(updatedItem) => editTask(task._id, updatedItem)}
                  itemProps={task}
                ></EditTaskModal>
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
        <div className="ui grid container equal width">
          <div className="column row">
            <div className="left aligned column">
              <div className="fluid ui input">
                <input
                  type="text"
                  value={item.name}
                  name="name"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="right aligned column">
              <button className="fluid ui button" type="submit">
                Add Task
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="ui raised segments">
        <div>{renderList}</div>
      </div>
    </Fragment>
  );
};

export default TaskList;
