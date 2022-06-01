import React, { Fragment, useState } from "react";

const Habit = ({ item }) => {
  const localDate = new Date(item.nextReset);
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  return (
    <Fragment>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      <label className="ui label basic label">
        {item.resetFrequency}, Next Reset:{" "}
        {localDate.toLocaleDateString("en-EN", options)}
      </label>
    </Fragment>
  );
};

export default Habit;
