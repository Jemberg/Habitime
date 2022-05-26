import React, { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CategoryDropdown = ({ handleCategoryChange, defaultValue }) => {
  const [selected, setSelected] = useState();

  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/categories`, requestOptions)
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
            label: { color: "black", empty: true, circular: true },
          };
        });
        setOptions(catOptions);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message);
      });
  }, []);

  return (
    <Dropdown
      fluid
      selection
      options={options}
      defaultValue={defaultValue}
      onChange={(e, result) => {
        setSelected(result.value);
        handleCategoryChange(result.value);
      }}
      value={selected}
    />
  );
};

export default CategoryDropdown;
