import React, { useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import { Dropdown } from "semantic-ui-react";

import CategoryDropdown from "../categoryDropdown";

Modal.setAppElement("#root");

const EditPeriodicalModal = (props) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setPeriodical(null);
    setIsOpen(false);
  }

  const [periodical, setPeriodical] = useState({});

  const handleChange = (event) => {
    console.log("handleChange()", event.target.name, " ", event.target.value);
    setPeriodical({ ...periodical, [event.target.name]: event.target.value });
  };

  const handleCategoryChange = (category) => {
    setPeriodical({ ...periodical, category: category });
  };

  const handleFrequencyChange = (event, data) => {
    // event.preventDefault();
    console.log("handleFrequencyChange()", data.value);
    setPeriodical({ ...periodical, frequency: data.value });
  };

  const frequencyOptions = [
    {
      key: "Daily",
      text: "Daily",
      value: "Daily",
    },
    {
      key: "Weekly",
      text: "Weekly",
      value: "Weekly",
    },
    {
      key: "Monthly",
      text: "Monthly",
      value: "Monthly",
    },
  ];

  return (
    <div>
      <button className="ui right floated button" onClick={openModal}>
        <i style={{ margin: "0px" }} className="cog icon"></i>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Periodical editing."
      >
        <h1 className="ui header">{props.itemProps.name}</h1>
        <ToastContainer />
        <form className="ui form">
          <div className="field">
            <label>Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder={props.itemProps.name}
            />
          </div>
          <div className="field">
            <label>Description</label>
            <input
              onChange={handleChange}
              type="text"
              name="description"
              placeholder={props.itemProps.description}
            />
          </div>
          <div className="field">
            <label>Priority</label>
            <input
              onChange={handleChange}
              type="number"
              name="priority"
              min="1"
              max="3"
              placeholder={props.itemProps.priority}
            />
          </div>
          {/* TODO: Category list must be imported via API. */}
          <div className="field">
            <label>Category (Currently ID: {props.itemProps.category})</label>
            <CategoryDropdown
              defaultValue={props.itemProps.category}
              handleCategoryChange={handleCategoryChange}
            ></CategoryDropdown>
          </div>
          <div className="field">
            <label>Frequency</label>
            <Dropdown
              placeholder={props.itemProps.frequency}
              fluid
              selection
              options={frequencyOptions}
              onChange={handleFrequencyChange}
            />
          </div>
          <button
            className="ui button green"
            onClick={(e) => {
              e.preventDefault();
              // TODO: frequencyChange refreshes page on submission, have to fix.
              // TODO: category does not send to back-end.
              console.log("periodical: ", periodical);
              // setPeriodical({ ...periodical, category: category });
              props.editPeriodical(periodical);
              toast.success("Periodical has been edited!");
              closeModal();
            }}
          >
            Confirm Changes
          </button>
          <button
            className="ui button red"
            onClick={() => {
              props.removePeriodical();
              closeModal();
            }}
          >
            Delete
          </button>
          <button className="ui button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EditPeriodicalModal;
