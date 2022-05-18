import React, { Fragment, useState } from "react";

const Habit = ({ item }) => {
  const localDate = new Date(item.dueDate);

  return (
    <Fragment>
      <div>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        {item.dueDate ? <p>{localDate.toString()}</p> : ""}
      </div>
    </Fragment>
  );
};

export default Habit;
