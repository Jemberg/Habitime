import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";

import { checkAuthentication } from "./auth/auth";
import Layout from "./components/layout";
import TaskList from "./components/tasks/taskList";
import PeriodicalList from "./components/periodical/periodicalList";
import HabitList from "./components/habits/habitList";

const App = () => {
  return (
    <Layout>
      <Fragment>
        {!checkAuthentication() ? <Navigate to="/login" /> : null};
        <div className="ui grid container stackable equal width">
          <div className="row">
            <div className="column">
              <TaskList></TaskList>
            </div>
            {/* <div className="column">
              <HabitList></HabitList>
            </div> */}
            {/* <div className="column">
              <PeriodicalList></PeriodicalList>
            </div> */}
          </div>
        </div>
      </Fragment>
    </Layout>
  );
};

export default App;
