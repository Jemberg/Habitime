import React, { Fragment, useState } from "react";
import { Navigate } from "react-router-dom";

import { checkAuthentication } from "./auth/auth";
import Layout from "./components/layout";
import TaskList from "./components/tasks/taskList";
import PeriodicalList from "./components/periodical/periodicalList";
import HabitList from "./components/habits/habitList";
import FilterDropdown from "./components/filterDropdown";

const App = () => {
  const [filter, setFilter] = useState("All");

  return (
    <Layout>
      <Fragment>
        {!checkAuthentication() ? <Navigate to="/login" /> : null};
        <div className="ui grid container stackable equal width center aligned">
          <div className="row">
            <FilterDropdown
              filter={filter}
              setFilter={setFilter}
            ></FilterDropdown>
          </div>

          <div className="row">
            <div className="column">
              <TaskList filter={filter}></TaskList>
            </div>
            <div className="column">
              <HabitList filter={filter}></HabitList>
            </div>
            <div className="column">
              <PeriodicalList filter={filter}></PeriodicalList>
            </div>
          </div>
        </div>
      </Fragment>
    </Layout>
  );
};

export default App;
