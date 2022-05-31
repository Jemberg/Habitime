import React, { Fragment, useState } from "react";

const Periodical = ({ item }) => {
  const localDate = new Date(item.nextDueDate);
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
        {item.frequency}, Next Due:{" "}
        {localDate.toLocaleDateString("en-EN", options)}
      </label>
    </Fragment>
  );
};

export default Periodical;
