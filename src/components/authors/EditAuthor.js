import React, { useState, useEffect } from "react";
import firebase from "../../firebase-config";
import { Link } from "react-router-dom";
import M from "materialize-css";


// Edit the details of an author in the database
const EditAuthor = (props) => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [biography, setBiography] = useState("");

  // Fetch the author's details from the database and display them in the form
  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const doc = await db
        .collection("authors")
        .doc(props.match.params.id)
        .get();
      if (doc.exists) {
        const data = doc.data();
        setName(data.name);
        setDob(data.dob);
        setBiography(data.biography);
      } else {
        console.log("No such document!");
      }
    };
    fetchData();
  }, [props.match.params.id]);

  // Update the text fields
  useEffect(() => {
    M.updateTextFields();
  }, [name, dob, biography]);

  // Update the author in the database
  const updateAuthor = (id) => {
    firebase
      .firestore()
      .collection("authors")
      .where("name", "==", name)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // An author with the same name already exists
          querySnapshot.forEach((doc) => {
            if (doc.id !== id) {
              console.log("An author with this name already exists.");
              return;
            }
          });
        }

        // Update the author in the database
        firebase
          .firestore()
          .collection("authors")
          .doc(id)
          .set({
            name,
            dob,
            biography,
          })
          .then(() => {
            props.history.push(`/author/${id}`);
          });
      });
  };

  return (
    // Display the form
    <div className="container edit-author">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateAuthor(props.match.params.id);
        }}
        className="col s12"
      >
        <div className="row">
          <div className="input-field col s6">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="validate"
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="input-field col s6">
            <input
              id="dob"
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="validate"
            />
            <label htmlFor="dob">Date of Birth</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <textarea
              id="biography"
              className="materialize-textarea validate"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
            />
            <label htmlFor="biography">Biography</label>
          </div>
        </div>
        // Display the buttons to submit the form, cancel the form, and go back to the dashboard
        <div className="buttons-wrapper">
          <button type="submit" className="btn custom-green white-text mt-3">
            Update Author
          </button>
          <Link
            to={`/author/${props.match.params.id}`}
            className="btn custom-grey white-text mt-3"
          >
            Cancel
          </Link>
          <Link to="/dashboard" className="btn custom-blue white-text mt-3">
            Back to Dashboard
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditAuthor;
