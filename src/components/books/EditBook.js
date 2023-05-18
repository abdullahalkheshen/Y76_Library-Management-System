import React, { useState, useEffect, useContext } from "react";
import firebase from "../../firebase-config";
import M from "materialize-css/dist/js/materialize.min.js";
import { Link, withRouter } from "react-router-dom";
import { AuthContext } from "../../context/Auth";

// Edit the details of a book in the database 
const EditBook = (props) => {
  const { user } = useContext(AuthContext);
  const { book, id, setEditMode } = props;

  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState("");


  // Fetch all authors from the database and store them in state
  useEffect(() => {
    if (!user) {
      props.history.push("/");
    }

    if (book) {
      setTitle(book.title || "");
      setSelectedAuthor(book.author || "");
      setDate(book.date_published || "");
      setDescription(book.description || "");
      setImagePreview(book.imageURL || "");
    }

    fetchAuthors();
  }, [user, props.history, book]);


  // Fetch all authors from the database and store them in state
  const fetchAuthors = async () => {
    const snapshot = await firebase.firestore().collection("authors").get();
    const authors = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAuthors(authors);

    // Re-initialize Materialize select here
    M.AutoInit();
    // update text fields to display the book's current values 
    M.updateTextFields();
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if the file is an image 
    if (image) {
      const uploadTask = firebase
        .storage()
        .ref(`images/${imageName}`)
        .put(image);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.log(error);
        },
        () => {
          // get the image URL from firebase storage 
          uploadTask.snapshot.ref.getDownloadURL().then(function (imageURL) {
            updateBookDetails(imageURL);
          });
        }
      );
    } else {
      updateBookDetails(imagePreview);
    }
  };

  // Update the book details in the database 
  const updateBookDetails = (imageURL) => {
    firebase
      .firestore()
      .collection("books")
      .doc(id)
      .update({
        title: title,
        author: selectedAuthor,
        date_published: date,
        description: description,
        imageURL: imageURL,
      })
      .then(() => {
        M.toast({ html: "Book updated successfully", classes: "green" });
        setEditMode(false);
      })
      .catch((error) => {
        console.error("Error updating book: ", error);
      });
  };

  // Handle image upload to firebase storage 
  const uploadImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageName(e.target.files[0].name);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Handle input change with hooks because we're using functional components
  const handleInputChange = (event, setter) => setter(event.target.value);

  return (
    // Form to edit book details
    <form onSubmit={handleSubmit} className="col s12 m8 offset-m2 l6 offset-l3">
      <div className="row">
        <div className="col s12 m6 l6">
          <div className="file-field input-field">
            <div className="btn purple darken-4">
              <span>Update Book Image</span>
              <input type="file" onChange={uploadImage} />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="responsive-img" />
          )}
        </div>

        <div className="col s12 m6 l6">
          <div className="input-field">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleInputChange(e, setTitle)}
            />
            <label htmlFor="title">Title</label>
          </div>
          <div className="input-field">
            <select
              value={selectedAuthor}
              onChange={(e) => handleInputChange(e, setSelectedAuthor)}
            >
              <option value="" disabled>
                Choose an author
              </option>
              {authors.map((author) => (
                <option key={author.id} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
            <label>Author</label>
          </div>
          <div className="input-field">
            <input
              id="date"
              type="text"
              className="datepicker"
              value={date}
              onChange={(e) => handleInputChange(e, setDate)}
            />
            <label htmlFor="date">Date Published</label>
          </div>
          <div className="input-field">
            <textarea
              id="description"
              className="materialize-textarea"
              value={description}
              style={{ height: "100px" }}
              onChange={(e) => handleInputChange(e, setDescription)}
            ></textarea>
            <label htmlFor="description">Description</label>
          </div>
          <button className="btn waves-effect waves-light" type="submit">
            Update Book
          </button>
          <Link
            to="/dashboard"
            className="btn red darken-2"
            onClick={() => setEditMode(false)}
            style={{ margin: "8px 18px" }}
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
};

export default withRouter(EditBook);
