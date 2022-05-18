import React, { useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";

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
    setIsOpen(false);
  }

  const [habit, setTask] = useState({});

  const handleChange = (event) => {
    console.log(event.target.name, " ", event.target.value);
    setTask({ ...habit, [event.target.name]: event.target.value });
  };

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
              type="text"
              name="priority"
              placeholder={props.itemProps.priority}
            />
          </div>
          {/* TODO: Category list must be imported via API. */}
          <div className="field">
            <label>Category</label>
            <input
              onChange={handleChange}
              type="text"
              name="category"
              placeholder={props.itemProps.category}
            />
          </div>
          <div className="field">
            <label>Due Date</label>
            <input
              onChange={handleChange}
              type="date"
              name="dueDate"
              placeholder={props.itemProps.dueDate}
            />
          </div>
          <button
            className="ui button green"
            onClick={() => {
              props.editTask(habit);
              closeModal();
            }}
          >
            Confirm Changes
          </button>
          <button
            className="ui button red"
            onClick={() => {
              props.removeTask();
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
