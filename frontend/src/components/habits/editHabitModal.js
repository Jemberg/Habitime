import React, { useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";

import CategoryDropdown from "../categoryDropdown";
import { Dropdown } from "semantic-ui-react";

Modal.setAppElement("#root");

const EditHabitModal = (props) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setHabit(null);
    setIsOpen(false);
  }

  const [habit, setHabit] = useState({});

  const handleChange = (event) => {
    console.log(event.target.name, " ", event.target.value);
    setHabit({ ...habit, [event.target.name]: event.target.value });
  };

  const [category, setCategory] = useState("");

  const handleCategoryChange = (event) => {
    console.log("IN HANDLECATEGORYCHANGE: ", category);
    setHabit({ ...habit, category: category });
    // if (category) {
    //   setHabit({ ...habit, category: category });
    // }
  };

  const handleFrequencyChange = (event, data) => {
    console.log(data.value);
    if (data.value) {
      setHabit({ ...habit, resetFrequency: data.value });
    }
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
      <button className="circular ui button" onClick={openModal}>
        <i style={{ margin: "0px" }} className="cog icon"></i>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Habit editing."
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
          <div className="field">
            <label>Goal</label>
            <input
              onChange={handleChange}
              type="number"
              name="goal"
              min="1"
              placeholder={props.itemProps.goal}
            />
          </div>
          {/* TODO: Category list must be imported via API. */}
          <div className="field">
            <label>Category (Currently ID: {props.itemProps.category})</label>
            <CategoryDropdown setCategory={setCategory}></CategoryDropdown>
          </div>
          <div className="field">
            <label>Frequency</label>
            <Dropdown
              placeholder={props.itemProps.resetFrequency}
              fluid
              selection
              options={frequencyOptions}
              onChange={handleFrequencyChange}
            />
          </div>
          <button
            className="ui button green"
            onClick={() => {
              // handleCategoryChange();
              // TODO: frequencyChange refreshes page on submission, have to fix.
              // TODO: category does not send to back-end.
              // handleFrequencyChange();
              console.log("ONCLICK HABIT: ", habit);
              console.log("ONCLICK CATEGORY:", category);
              setHabit({ ...habit, category: `${category}` });
              props.editHabit(habit);
              closeModal();
            }}
          >
            Confirm Changes
          </button>
          <button
            className="ui button red"
            onClick={() => {
              props.removeHabit();
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

export default EditHabitModal;
