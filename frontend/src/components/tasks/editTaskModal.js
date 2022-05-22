import React, { useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import CategoryDropdown from "../categoryDropdown";

Modal.setAppElement("#root");

const EditTaskModal = (props) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [task, setTask] = useState({});
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setTask({});
    setIsOpen(false);
  }

  const handleChange = (event) => {
    console.log(event.target.name, " ", event.target.value);
    setTask({ ...task, [event.target.name]: event.target.value });
  };

  const [category, setCategory] = useState("");

  const handleCategoryChange = (category) => {
    setTask({ ...task, category: category });
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
        contentLabel="Task editing."
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
            <label>Category</label>
            <CategoryDropdown
              defaultValue={props.itemProps.category}
              handleCategoryChange={handleCategoryChange}
            ></CategoryDropdown>
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
              handleCategoryChange();
              console.log("Right before saving, category:", category);
              props.editTask(task);
              toast.success("Task has been edited!");
              console.log(task); // selected category from categoryDropdown
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

export default EditTaskModal;
