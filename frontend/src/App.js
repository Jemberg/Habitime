import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";

import { checkAuthentication } from "./auth/auth";
import Layout from "./components/layout";
import TaskList from "./components/tasks/taskList";
import PeriodicalList from "./components/periodical/periodicalList";
import HabitList from "./components/habits/habitList";
import { Helmet } from "react-helmet";

const App = () => {
  return (
    <Layout>
      <Fragment>
        {!checkAuthentication() ? <Navigate to="/login" /> : null};
        <div className="ui grid container stackable equal width center aligned">
          <div className="row">
            <form action="" className="ui form">
              <input type="text" name="" id="" />
              <button className="ui button">Filter</button>
            </form>
          </div>

          <div className="row">
            <div className="column">
              <TaskList></TaskList>
            </div>
            <div className="column">
              <HabitList></HabitList>
            </div>
            <div className="column">
              <PeriodicalList></PeriodicalList>
            </div>
          </div>
        </div>
      </Fragment>
    </Layout>
  );
};

export default App;
