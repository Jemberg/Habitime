import React, { Fragment, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { checkAuthentication } from "./auth/auth";
import Layout from "./components/layout";
import TaskList from "./components/tasks/taskList";
import PeriodicalList from "./components/periodical/periodicalList";
import HabitList from "./components/habits/habitList";
import FilterDropdown from "./components/filterDropdown";

const App = () => {
  let deferredPrompt;

  if (!window.Promise) {
    window.Promise = Promise;
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch(function (err) {
        console.log(err);
      });
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    return false;
  });

  const [filter, setFilter] = useState("All");

  return (
    <Fragment>
      {checkAuthentication() && (
        <Layout>
          <Fragment>
            <div className="ui grid container stackable equal width center aligned">
              <div className="row">
                <div className="column">
                  <h1>Filter</h1>
                  <FilterDropdown
                    filter={filter}
                    setFilter={setFilter}
                  ></FilterDropdown>
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <h1>Tasks</h1>
                  <TaskList filter={filter}></TaskList>
                </div>
                <div className="column">
                  <h1>Habits</h1>
                  <HabitList filter={filter}></HabitList>
                </div>
                <div className="column">
                  <h1>Periodical Tasks</h1>
                  <PeriodicalList filter={filter}></PeriodicalList>
                </div>
              </div>
            </div>
          </Fragment>
          <ToastContainer />
        </Layout>
      )}
      {!checkAuthentication() && <Navigate to="/login" />}
    </Fragment>
  );
};

export default App;
