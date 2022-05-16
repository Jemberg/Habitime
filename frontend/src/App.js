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
        <div className="ui one column stackable center aligned page grid">
          <div className="column twelve wide">
            <h1>Good afternoon, {checkAuthentication().username}</h1>
            <TaskList></TaskList>
          </div>
        </div>
      </Fragment>
    </Layout>
  );
};

export default App;
