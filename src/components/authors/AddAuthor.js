import React, { useState } from "react";
import firebase from "../../firebase-config.js";
import { Link } from "react-router-dom";

// Add a new author to the database
const AddAuthor = () => {
  // useStates for the author's name, date of birth, and biography
  // Note that useState is a React Hook that lets you add React state to function components
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [biography, setBiography] = useState("");

  // onSubmit function that adds the author to the database
  const onSubmit = (e) => {
    // Prevents the default action of the event from being triggered
    e.preventDefault();

    // logic to check if the author already exists in the database
    firebase
      .firestore()
      .collection("authors")
      .where("name", "==", name)
      .get()
      // querySnapshot is a collection of documents that you get from a query
      .then((querySnapshot) => {
        // If the querySnapshot is not empty, then an author with the same name already exists
        if (!querySnapshot.empty) {
          // An author with the same name already exists
          console.log("An author with this name already exists.");
          alert("An author with this name already exists.");
          return;
        }

        // Add the new author
        firebase
          .firestore()
          .collection("authors")
          .add({
            name,
            dob,
            biography,
          })

          // docRef is the reference to the newly added author
          .then((docRef) => {
            console.log("Author added with ID: ", docRef.id);
            setName("");
            setDob("");
            setBiography("");
          });
      });
  };

  return (
    <div className="container">
      // Link to the dashboard
      <Link to="/dashboard" className="waves-effect waves-light btn">
        <i className="material-icons left">arrow_back</i>Back to dashboard
      </Link>
      <h3>Add New Author</h3>
      // Form to add a new author
      <form onSubmit={onSubmit}>
        // Input fields for the author's name, date of birth, and biography
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <label>Date of Birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.currentTarget.value)}
        />
        <label>Biography</label>
        <textarea
          value={biography}
          onChange={(e) => setBiography(e.currentTarget.value)}
        />
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
};

// Export the AddAuthor component
export default AddAuthor;
