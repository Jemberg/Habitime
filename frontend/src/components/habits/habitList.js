import Cookies from "js-cookie";
import React, { useEffect, useState, Fragment, Section, Form } from "react";
import { toast, ToastContainer } from "react-toastify";

import { checkAuthentication } from "../../auth/auth";
import Layout from "../layout";
import Habit from "./habit";
import EditHabitModal from "./editHabitModal";

const HabitList = ({ filter }) => {
  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/habits`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(parsed.habits);
        setHabitList(parsed.habits);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  }, []);

  const [item, setItem] = useState({
    name: "",
  });

  const handleChange = (event) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!item.name || item.name.length === 0) {
      toast.error("Please enter a name for your habit!");
      return;
    }

    addHabit(item);
    setItem({ name: "" });
  };

  const [habitList, setHabitList] = useState([]);

  const addHabit = async (item) => {
    console.log(`Adding habit with the ID of ${checkAuthentication()._id}`);

    var raw = JSON.stringify({
      // user: checkAuthentication()._id,
      name: item.name,
    });

    console.log(`addHabit payload contents are: ${raw}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/habits`, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        const parsed = JSON.parse(result);
        console.log(parsed);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        toast.success("Habit has been created!");
        setHabitList((oldList) => [...oldList, parsed.habit]);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  };

  const removeHabit = async (id) => {
    console.log(`Deleting habit with the ID of ${id}`);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/habits/${id}`, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(`Habit deleted with name of: ${parsed.habit.name}`);
        toast.success("Habit has been deleted!");
        setHabitList((oldList) => oldList.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const editHabit = async (id, item) => {
    console.log(`Editing habit with the ID of ${id}`);
    console.log(item);

    var raw = JSON.stringify({
      name: item.name,
      description: item.description,
      category: item.category,
      counter: item.counter,
      priority: item.priority,
      goal: item.goal,
      resetFrequency: item.resetFrequency,
    });

    console.log(raw);

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/habits/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(`Habit edited with name of: ${parsed.habit.name}`);
        toast.success("Habit has been edited!");

        setHabitList((oldList) => oldList.filter((item) => item._id !== id));
        setHabitList((oldList) => [...oldList, parsed.habit]);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  };

  const onPositiveHabit = (habit) => {
    editHabit(habit._id, { counter: habit.counter + 1 });
  };

  const onNegativeHabit = (habit) => {
    editHabit(habit._id, { counter: habit.counter - 1 });
  };

  const renderList = habitList
    .filter((habit) => {
      switch (filter) {
        case "All":
          return habit;
        case "Completed":
          if (habit.goal <= habit.counter) return habit;
          break;
        case "Active":
          if (habit.goal >= habit.counter) return habit;
          break;
        case "highPriority":
          if (habit.priority === 3) return habit;
          break;
        case "mediumPriority":
          if (habit.priority === 2) return habit;
          break;
        case "lowPriority":
          if (habit.priority === 1) return habit;
          break;
        default:
          if (habit.category === filter) return habit;
          break;
      }
    })
    .map((habit) => (
      <Fragment key={habit._id}>
        <div style={{ margin: "0px" }} className="ui segment">
          <div className="ui grid container stackable equal width">
            <div className="row">
              <div className="left aligned eight wide column">
                <Habit key={habit._id} item={habit}></Habit>
              </div>

              <div className="column four wide">
                <button
                  onClick={() => {
                    onPositiveHabit(habit);
                  }}
                  className="right floated ui button"
                >
                  <i style={{ margin: "0px" }} className="plus circle icon"></i>
                </button>
                <button
                  onClick={() => {
                    onNegativeHabit(habit);
                  }}
                  className="right floated ui button"
                >
                  <i
                    style={{ margin: "0px" }}
                    className="minus circle icon"
                  ></i>
                </button>
                <label></label>
              </div>
              <div className="column four wide">
                <div style={{ transform: "" }}>
                  <EditHabitModal
                    removeHabit={() => removeHabit(habit._id)}
                    editHabit={(updatedItem) =>
                      editHabit(habit._id, updatedItem)
                    }
                    itemProps={habit}
                  ></EditHabitModal>
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
                Add Habit
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

export default HabitList;
