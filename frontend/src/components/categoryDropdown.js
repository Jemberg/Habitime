import React, { useState } from "react";
import { Dropdown } from "semantic-ui-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CategoryDropdown = ({ setCategory }) => {
  const [selected, setSelected] = useState();

  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const options = [];
  fetch("http://localhost:3000/categories", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const parsed = JSON.parse(result);

      if (!parsed.success) {
        throw new Error(`There was an error: ${parsed.error}`);
      }

      const catOptions = parsed.categories.map((e) => {
        return {
          key: e._id,
          text: e.name,
          value: e._id,
          label: { color: e.color, empty: true, circular: true },
        };
      });
      options.push(...catOptions);
    })
    .catch((error) => {
      console.log("error", error);
      toast.error(error.message);
    });

  return (
    <Dropdown
      placeholder="Select Category"
      fluid
      selection
      options={options}
      onChange={(e, result) => {
        setSelected(result.value);
        setCategory(result.value);
      }}
      value={selected}
    />
  );
};

export default CategoryDropdown;
