import React, { useState, useContext, useEffect } from "react";
import firebase from "../../firebase-config";
import { Link } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";
import spinner from "../../images/loadingSpinner.gif";
import { AuthContext } from "../../context/Auth";
import withAuthenticationRequired from "../../context/withAuthenticationRequired.js";

//  Add a new book to the database 
const AddBook = (props) => {
  const { user } = useContext(AuthContext);
  const [values, setValues] = useState({
    title: "",
    author: "",
    date_published: "",
    description: "",
    status: "drafted",
  });

  // Fetch all authors from the database and store them in state 
  // state is used to populate the select dropdown menu
  const [authors, setAuthors] = useState([]);
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { title, author, date_published, description } = values;

  // Fetch all authors from the database and store them in state
  useEffect(() => {
    if (!user) {
      props.history.push("/login");
      alert("You must be logged in to add a book.");
    }
    firebase
      .firestore()
      .collection("authors")
      .get()
      .then((snapshot) => {
        const authors = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAuthors(authors);
        M.AutoInit(); // Re-initialize Materialize select here
      });
  }, [user, props.history]);

  // Handle form submission 
  const handleSubmit = (e) => {
    e.preventDefault();
    M.AutoInit();
    if (!image) {
      alert("You must choose an image.");
      return;
    }
    // Check if the file is an image
    const fileType = image["type"];
    const validImageTypes = [
      "image/gif",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    // If the file is not an image, alert the user and return early
    if (!validImageTypes.includes(fileType)) {
      alert("Not a valid file. Please choose an image.");
      return;
    }
    // If the file is an image, upload it to Firebase storage
    setIsLoading(true);
    const uploadTask = firebase.storage().ref(`images/${imageName}`).put(image);
    uploadTask.on(
      "state_changed",
      (/* snapshot */) => {},
      (error) => {
        console.log(error);
      },
      () => { // When the upload is complete, get the download URL of the image and add the book to the database
        uploadTask.snapshot.ref.getDownloadURL().then(function (imageURL) {
          const newBook = {
            title,
            author: author,
            date_published,
            description,
            imageURL,
          };
          // Add the book to the database
          firebase
            .firestore()
            .collection("books")
            .add(newBook)
            .then(() => {
              // Reset the form and show a success message to the user
              // M.toast is to show a Materialize toast notification
              M.toast({
                html: "Book added succesfully",
                classes: "green darken-1 rounded",
              });
              setIsLoading(false);
              resetForm();
              setImage("");
            })
            .catch(() => {
              M.toast({
                html: "Something went wrong. Please try again.",
                classes: "red darken-1 rounded",
              });
              // Reset the form and show a success message to the user
              setIsLoading(false);
            });
        });
      }
    );
  };


 // Handle form input changes
  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  // Handle image upload
  const uploadImage = (e) => {
    const imageFile = e.target.files[0];
    setImage(imageFile);
    if (!imageFile) {
      return;
    }
    // Set the image preview
    setImagePreview(URL.createObjectURL(imageFile));
    setImageName(imageFile.name);
  };

  // Reset the form
  const resetForm = () => {
    setValues({
      title: "",
      author: "",
      date_published: "",
      description: "",
    });
    setImage("");
  };

  // Show a loading spinner while the book is being added to the database 
  return isLoading ? (
    // Show a loading spinner while the book is being added to the database
    <div className="spinner">
      <img src={spinner} alt="loading-spinner" />
    </div>
  ) : (
    // Show the form to add a new book
    <div className="row">
      <div className="col s12 m8 offset-m2">
        <Link to="/dashboard" className="waves-effect waves-light btn">
          <i className="material-icons left">arrow_back</i>Back to dashboard
        </Link>
        <br />
        // Show the form to add a new book
        <div className="card">
          <div className="card-content">
            <h3 className="card-title center">Add New Book</h3>
            <div className="row">
              <div className="col s12 m7">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="input-field col s6">
                      <input
                        id="title"
                        type="text"
                        className="validate"
                        onChange={handleChange("title")}
                        value={title}
                      />
                      <label htmlFor="title">Title</label>
                    </div>
                    <div className="input-field col s6">
                      <select
                        id="author"
                        className="validate"
                        onChange={handleChange("author")}
                        value={author}
                      >
                        <option value="" disabled selected>
                          Choose your option
                        </option>
                        {authors.map((author) => (
                          <option key={author.id} value={author.id}>
                            {author.name}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="author">Author</label>
                    </div>
                    // Date picker
                    <div className="input-field col s4">
                      <input
                        id="date_published"
                        type="date"
                        class="datepicker"
                        className="validate"
                        onChange={handleChange("date_published")}
                        value={date_published}
                      />
                      <label htmlFor="date_published">Date Published</label>
                    </div>

                    // Textarea for description 
                    <div className="input-field col s12">
                      <textarea
                        id="description"
                        className="materialize-textarea"
                        onChange={handleChange("description")}
                        value={description}
                      ></textarea>
                      <label htmlFor="description">Description</label>
                    </div>
                  </div>

                  // File upload for cover image
                  <div className="file-field input-field">
                    <div className="btn purple darken-4">
                      <span>Upload Cover Image</span>
                      <input
                        type="file"
                        onChange={uploadImage}
                        accept="image/*"
                      />
                    </div>

                    // Show the image name
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" />
                    </div>
                  </div>

                  // div to hold the submit and reset buttons
                  <div>
                    <button
                      className="waves-effect waves-light btn"
                      style={{ margin: "8px 18px" }}
                      type="submit"
                    >
                      ADD BOOK{" "}
                      <i className="material-icons right">add_circle_outline</i>
                    </button>
                    <button
                      className="waves-effect waves-light btn red"
                      type="reset"
                      onClick={resetForm}
                    >
                      Reset <i className="material-icons right">cancel</i>
                    </button>
                  </div>
                </form>
              </div>

              // Show the image preview
              <div className="col s12 m5 center">
                <p>Cover Image</p>
                <img
                  src={imagePreview}
                  alt={imageName}
                  className="responsive-img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(AddBook, "/login");