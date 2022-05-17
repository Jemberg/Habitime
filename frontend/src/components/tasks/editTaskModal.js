import React, { useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";

Modal.setAppElement("#root");

const EditTaskModal = (props) => {
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

  const [task, setTask] = useState({
    name: "",
    description: "",
    priority: 3,
    category: "",
    dueDate: new Date(),
  });

  const handleChange = (event) => {
    setTask({ ...task, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Task editing."
      >
        <div>
          <ToastContainer />
          <h2>{props.itemProps.name}</h2>
          <p>ID: {props.itemProps._id}</p>
          <p>Description: {props.itemProps.description}</p>
          <p>Status: {props.itemProps.completed.toString()}</p>
          <p>Created by {props.itemProps.createdBy}:</p>
        </div>

        <div>
          <form action="">
            <input placeholder="Task name" name="name" type="text" />
            <input placeholder="Description" name="description" type="text" />
            <input placeholder="Priority" name="priority" type="number" />{" "}
            {/* TODO: Priority cannot be higher than 3 and lower than 0. (React Toastify Error) */}
            <input placeholder="Category" name="category" type="text" />
            {/* TODO: Import user's category list, then allow them to choose from this list. */}
            <input placeholder="Due Date" name="dueDate" type="date" />
            {/* TODO: Make sure date converts properly to UTC before sending to database. */}
          </form>
        </div>

        <div>
          <button
            onClick={() => {
              props.removeTask();
              closeModal();
            }}
          >
            Delete
          </button>
          <button onClick={closeModal}>Cancel</button>
          <button
            onClick={() => {
              props.editTask();
              closeModal();
            }}
          >
            Confirm Changes
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EditTaskModal;
