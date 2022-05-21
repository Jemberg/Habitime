import React from "react";
import { Dropdown } from "semantic-ui-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const FilterDropdown = ({ filter, setFilter }) => {
  // TODO: Make switch cases also feature categories so items can be filtered by category.
  const filterOptions = [
    {
      key: "All",
      text: "All",
      value: "All",
      label: { color: "red", empty: true, circular: true },
    },
    {
      key: "Completed",
      text: "Completed",
      value: "Completed",
      label: { color: "green", empty: true, circular: true },
    },
    {
      key: "Active",
      text: "Not Completed",
      value: "Active",
      label: { color: "brown", empty: true, circular: true },
    },
    {
      key: "highPriority",
      text: "High Priority",
      value: "highPriority",
      label: { color: "dark red", empty: true, circular: true },
    },
    {
      key: "mediumPriority",
      text: "Medium Priority",
      value: "mediumPriority",
      label: { color: "orange", empty: true, circular: true },
    },
    {
      key: "lowPriority",
      text: "Low Priority",
      value: "lowPriority",
      label: { color: "light yellow", empty: true, circular: true },
    },
  ];

  var myHeaders = new Headers();
  myHeaders.append("auth_token", Cookies.get("token"));
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

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
      filterOptions.push(...catOptions);
    })
    .catch((error) => {
      console.log("error", error);
      toast.error(error.message);
    });

  console.log(filterOptions);

  return (
    <Dropdown
      placeholder="Select Filter"
      fluid
      selection
      options={filterOptions}
      onChange={(e, result) => setFilter(result.value)}
      value={filter}
    />
  );
};

export default FilterDropdown;
