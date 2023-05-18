import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import firebase from "../../firebase-config";
import "../../App.css";
import spinner from "../../images/loadingSpinner.gif";

// Display the list of authors in the database and search for authors by name
const AuthorList = () => {
  const location = useLocation();
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchName, setSearchName] = useState("");

  // Fetch the authors from the database and update the authors state
  useEffect(() => {
    // setIsLoading to true when the component mounts
    setIsLoading(true);
    const unsubscribe = firebase
      .firestore()
      .collection("authors")
      .onSnapshot(
        (snapshot) => {
          const allAuthors = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAuthors(allAuthors);
          setIsLoading(false);
        },
        function (error) {
          console.log("Error in snapshot listener:", error);
        }
      );
      // Return the unsubscribe function to stop listening to changes
    return () => unsubscribe();
  }, []);

  // Display a loading spinner if the data is still loading
  if (isLoading) {
    return (
      <div className="spinner">
        <img src={spinner} alt="loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      // Link to the dashboard
      <div className="search-wrapper">
        {location.pathname !== "/dashboard" && (
          <Link
            to="/"
            className="waves-effect waves-light btn blue darken-3 hoverable"
            style={{ marginRight: "10px" }}
          >
            RETURN TO DASHBOARD
          </Link>
        )}
        <div className="search-field">
          <input
            id="name"
            type="text"
            className="search-bar"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <label htmlFor="name">Search by author name</label>
        </div>

        // Display the list of authors
        <div className="row" style={{ padding: "16px" }}>
          {authors.length > 0 ? (
            authors
            // Filter the authors by name and display the filtered authors if the search bar is not empty
              .filter(
                (author) =>
                  author.name &&
                  author.name.toLowerCase().includes(searchName.toLowerCase())
              )
              // Display all authors if the search bar is empty or if the search bar does not match any author names
              .map((author) => (
                <div className="col s12 m4" key={author.id}>
                  <div className="card grey lighten-5 z-depth-1 hoverable">
                    <div className="card-content author-card-content">
                      <h4>{author.name}</h4>
                      <p className="dob-text">{author.dob}</p>
                      <p className="bio-text">{author.biography}</p>
                    </div>
                    <div
                      className="card-action center"
                      style={{ overflow: "hidden" }}
                    >
                      // Link to the author's details
                      <Link
                        to={`/author/${author.id}`}
                        className="btn black darken-1 hoverable"
                      >
                        View Details{" "}
                        <i className="material-icons right">arrow_forward</i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
          ) : ( // Display a message if there are no authors in the database
            <h3>No authors available</h3>
          )}
        </div>
      </div>
    </div>
  );
};


export default AuthorList;
