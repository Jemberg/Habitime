import Cookies from "js-cookie";
import React, { useEffect, useState, Fragment, Section, Form } from "react";
import { toast, ToastContainer } from "react-toastify";

import { checkAuthentication } from "../../auth/auth";
import Periodical from "./periodical";
import EditPeriodicalModal from "./editPeriodicalModal";

const PeriodicalList = ({ filter }) => {
  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/periodical`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(parsed.periodicals);
        setPeriodicalList(parsed.periodicals);
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
      toast.error("Please enter a name for your periodical task!");
      return;
    }

    addPeriodical(item);
  };

  const onCompleteSubmit = (id, completed) => {
    console.log(id, completed);
    const toastCompleted = completed ? "Completed" : "Uncompleted";
    toast.success(`Periodical has been ${toastCompleted}!`);
    editPeriodical(id, { completed: completed });
  };

  const [periodicalList, setPeriodicalList] = useState([]);

  const addPeriodical = async (item) => {
    console.log(
      `Adding periodical with the ID of ${checkAuthentication()._id}`
    );

    var raw = JSON.stringify({
      name: item.name,
    });

    console.log(`addPeriodical payload contents are: ${raw}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/periodical`, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        const parsed = JSON.parse(result);
        console.log(parsed);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        toast.success("Periodical has been created!");
        setPeriodicalList((oldList) => [...oldList, parsed.periodical]);
        setItem({});
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  };

  const removePeriodical = async (id) => {
    console.log(`Deleting item with the ID of ${id}`);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/periodical/${id}`, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(
          `Periodical deleted with name of: ${parsed.periodical.name}`
        );
        toast.success("Periodical has been deleted!");
        setPeriodicalList((oldList) =>
          oldList.filter((item) => item._id !== id)
        );
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const editPeriodical = async (id, item) => {
    var raw = JSON.stringify({
      name: item.name,
      description: item.description,
      completed: item.completed,
      category: item.category,
      priority: item.priority,
      dueDate: item.dueDate /* .toUTCString() */,
      frequency: item.frequency,
    });

    //console.log(raw);

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_API_URL}/periodical/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        // Delete periodical, then add updated periodical back in, this is not very efficient lol.
        setPeriodicalList((oldList) =>
          oldList.filter((item) => item._id !== id)
        );
        setPeriodicalList((oldList) => [...oldList, parsed.periodical]);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  };

  const renderList = Array.from(periodicalList)
    .filter((periodical) => {
      switch (filter) {
        case "All":
          return periodical;
        case "Completed":
          if (periodical.completed === true) return periodical;
          break;
        case "Active":
          if (periodical.completed === false) return periodical;
          break;
        case "highPriority":
          if (periodical.priority === 3) return periodical;
          break;
        case "mediumPriority":
          if (periodical.priority === 2) return periodical;
          break;
        case "lowPriority":
          if (periodical.priority === 1) return periodical;
          break;
        default:
          if (periodical.category === filter) return periodical;
          break;
      }
    })
    .map((periodical) => (
      <Fragment key={periodical._id}>
        <div style={{ margin: "0px" }} className="ui segment">
          <div className="ui grid container stackable equal width">
            <div className="row">
              <div className="column left aligned">
                <Periodical key={periodical._id} item={periodical}></Periodical>
                <EditPeriodicalModal
                  removePeriodical={() => removePeriodical(periodical._id)}
                  editPeriodical={(updatedItem) =>
                    editPeriodical(periodical._id, updatedItem)
                  }
                  itemProps={periodical}
                ></EditPeriodicalModal>
              </div>

              <div className="column right aligned three wide">
                <div
                  style={{ transform: "scale(2)" }}
                  className="ui fitted checkbox"
                >
                  <input
                    id={periodical._id}
                    checked={periodical.completed}
                    onChange={() => {}}
                    onClick={() => {
                      onCompleteSubmit(periodical._id, !periodical.completed);
                    }}
                    type="checkbox"
                  />
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
                Add Periodical
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

export default PeriodicalList;
