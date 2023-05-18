import React, { useState, useEffect } from "react";
import firebase from "../../firebase-config";

import { Link } from "react-router-dom";


// Display the details of an author
const AuthorDetails = (props) => {
  const [author, setAuthor] = useState(null);

  // Fetch the author's details from the database
  // useEffect is a React Hook that lets you perform side effects in function components
  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const doc = await db
        .collection("authors")
        .doc(props.match.params.id)
        .get();
      if (doc.exists) {
        const data = doc.data();
        setAuthor(data);
      } else {
        console.log("No such document!");
      }
    };
    // Call the fetchData function
    fetchData();
  }, [props.match.params.id]); // The second argument of useEffect is an array of dependencies



  // Delete the author from the database
  const handleDelete = (id) => {
    const db = firebase.firestore();
    db.collection("authors")
      .doc(id)
      .delete()
      .then(() => {
        // Redirect to dashboard after successful deletion
        props.history.push("/dashboard");
      })

      // Catch any errors that occur during deletion
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  return (
    <div className="container center-content">
      // Link to the dashboard
      <Link to="/dashboard" className="waves-effect waves-light btn">
        <i className="material-icons left">arrow_back</i>Back to dashboard
      </Link>

      // Display the author's details if the author exists
      {author ? (
        <div>
          // Display the author's name, date of birth, and biography
          <h2>{author.name}</h2>
          <p>{author.dob}</p>
          <p>{author.biography}</p>

          <Link
            to={`/edit/author/${props.match.params.id}`}
            className="btn green white-text"
          >
            Edit
          </Link>

          // Delete the author
          <button
            className="btn red white-text"
            onClick={() => handleDelete(props.match.params.id)}
          >
            Delete
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AuthorDetails;
