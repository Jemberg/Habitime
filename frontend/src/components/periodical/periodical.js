import React, { Fragment, useState } from "react";

const Periodical = ({ item }) => {
  const localDate = new Date(item.dueDate);

  return (
    <Fragment>
      <div>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        {/* TODO: Add "Repeats daily/weekly/monthly, next occourence on: Date()" */}
        {item.dueDate ? <p>{localDate.toString()}</p> : ""}
      </div>
    </Fragment>
  );
};

export default Periodical;
