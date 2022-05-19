import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState, Fragment, Section, Form } from "react";
import { toast, ToastContainer } from "react-toastify";

import { checkAuthentication } from "../../auth/auth";
import Layout from "../layout";
import Periodical from "./periodical";
import EditPeriodicalModal from "./editPeriodicalModal";

const PeriodicalList = () => {
  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:3000/periodical", requestOptions)
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
    description: "",
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

  const [periodicalList, setPeriodicalList] = useState([]);

  const addPeriodical = async (item) => {
    console.log(
      `Adding periodical with the ID of ${checkAuthentication()._id}`
    );

    var raw = JSON.stringify({
      // user: checkAuthentication()._id,
      name: item.name,
    });

    console.log(`addPeriodical payload contents are: ${raw}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/periodical", requestOptions)
      .then((response) => response.text())

      .then((result) => {
        const parsed = JSON.parse(result);
        console.log(parsed);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        toast.success("Periodical has been created!");
        setPeriodicalList((oldList) => [...oldList, parsed.periodical]);
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

    fetch(`http://localhost:3000/periodical/${id}`, requestOptions)
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

    fetch(`http://localhost:3000/periodical/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        const parsed = JSON.parse(result);

        if (!parsed.success) {
          throw new Error(`There was an error: ${parsed.error}`);
        }

        console.log(
          `Periodical edited with name of: ${parsed.periodical.name}`
        );
        toast.success("Periodical has been edited!");

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

  const renderList = Array.from(periodicalList).map((periodical) => (
    <Fragment>
      <div style={{ margin: "0px" }} class="ui segment">
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
                Add Periodical
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

export default PeriodicalList;
