import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";

import { checkAuthentication } from "./auth/auth";
import Layout from "./components/layout";
import TaskList from "./components/tasks/taskList";

const App = () => {
  return (
    <Layout>
      <Fragment>
        {!checkAuthentication() ? <Navigate to="/login" /> : null};
        <div className="center aligned ui container">
          <h1>Good afternoon, {checkAuthentication().username}</h1>
        </div>
        <div className="ui grid container stackable equal width">
          <div className="row">
            <div className="column">
              <TaskList></TaskList>
            </div>
            <div className="column">
              <TaskList></TaskList>
            </div>
            <div className="column">
              <TaskList></TaskList>
            </div>
          </div>
        </div>
      </Fragment>
    </Layout>
  );
};

export default App;
