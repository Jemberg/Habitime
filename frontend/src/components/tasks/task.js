import React, { Fragment, useState } from "react";

const Task = ({ item }) => {
  return (
    <Fragment>
      <div>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <p>{item.completed.toString()}</p>
      </div>
    </Fragment>
  );
};

export default Task;
