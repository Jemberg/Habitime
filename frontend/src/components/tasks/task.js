import React, { Fragment, useState } from "react";

const Task = ({ item }) => {
  const localDate = new Date(item.dueDate);
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  return (
    <Fragment>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      {localDate < new Date() && (
        <label className="ui label red basic label">
          Due: {localDate.toLocaleDateString("en-EN", options)}
        </label>
      )}
      {localDate > new Date() && (
        <label className="ui label basic label">
          Due: {localDate.toLocaleDateString("en-EN", options)}
        </label>
      )}
    </Fragment>
  );
};

export default Task;
