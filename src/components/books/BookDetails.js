import React, { useState, useEffect, useContext } from "react";
import firebase from "../../firebase-config";
import { Link } from "react-router-dom";
import spinner from "../../images/loadingSpinner.gif";
import { AuthContext } from "../../context/Auth";
import EditBook from "./EditBook";


// Display the details of a book and allow the user to edit the book
const BookDetails = (props) => {
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState();
  const [author, setAuthor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { id } = props.match.params;
  
  console.log("Book ID in BookDetails:", id);

  // Fetch the book and author data from the database
  useEffect(() => {
    if (!user) {
      props.history.push("/login");
    }

    console.log("Book ID before Firestore fetch:", id);

    // if the book ID is undefined, return early from this function
    if (!id) {
      console.error("Book ID is undefined before Firestore fetch");
      return;
    }
    // Fetch the book data from the database
    const unsubscribe = firebase
      .firestore()
      .collection("books")
      .doc(id)
      .onSnapshot(function (doc) {
        setBook(doc.data());

        
        const bookData = doc.data();
        setBook(bookData);

        if (!bookData.author) {
          console.error("Author ID is undefined in book data");
          return;
        }

        firebase
          .firestore()
          .collection("authors")
          .doc(doc.data().author)
          .get()
          .then((authorDoc) => {
            if (authorDoc.exists) {
              setAuthor(authorDoc.data());
            } else {
              // Handle the case where the author does not exist
              setAuthor({ name: "Author not found" });
            }
          });
      });

    return () => unsubscribe();
  }, [user, props.history, id]);

  // Delete a book from the database and redirect to the dashboard
  const deleteBook = () => {
    if (window.confirm("Are you sure to delete this book?")) {
      console.log("Book ID before delete:", id); // Add this line
      firebase
        .firestore()
        .collection("books")
        .doc(id)
        .delete()
        .then(function () {
          props.history.replace("/books");
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    } else {
      return;
    }
  };

  // Toggle the edit mode for the book details 
  const editBook = () => {
    setEditMode(!editMode);
  };
  return (
    <div className="container">
      {editMode ? null : (
        <Link to="/dashboard" className="waves-effect waves-light btn">
          <i className="material-icons left">arrow_back</i>Back to dashboard
        </Link>
      )}
      {book && author ? (
        editMode ? (
          <EditBook book={book} id={id} setEditMode={setEditMode} />
        ) : (
          <div className="row card">
            <div className="col m4">
              <h3 className="center" style={{ marginRight: "50px" }}>
                <img
                  src={book.imageURL}
                  alt={book.title}
                  className="responsive-img"
                />
              </h3>
            </div>
            <div className="col m6">
              <div className="actions">
                <h4>Details</h4>
                {editMode ? null : (
                  <div>
                    <button
                      disabled={!book}
                      className="btn waves-effect waves-light green"
                      type="submit"
                      name="action"
                      style={{ marginRight: "15px" }}
                      onClick={editBook}
                    >
                      Edit
                      <i className="material-icons right">edit</i>
                    </button>
                    <button
                      className="btn waves-effect waves-light red"
                      type="submit"
                      name="action"
                      onClick={deleteBook}
                    >
                      Delete
                      <i className="material-icons right">delete</i>
                    </button>
                  </div>
                )}
              </div>
              <div className="row">
                // Display the book details
                <div className="col">
                  <h6>
                    <strong>Title: </strong>
                    {book.title}
                  </h6>
                  <h6>
                    <strong>Author: </strong>
                    {author.name}
                  </h6>
                </div>
                <div className="col">
                  <h6>
                    <strong>Date: </strong>
                    {book.date_published}
                  </h6>
                  <h6>
                    <strong>Description: </strong>
                    {book.description}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="spinner">
          <img src={spinner} alt="loading-spinner" />
        </div>
      )}
    </div>
  );
};

export default BookDetails;
