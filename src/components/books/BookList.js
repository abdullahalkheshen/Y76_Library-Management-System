import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import firebase from "../../firebase-config";
import spinner from "../../images/loadingSpinner.gif";


// Display the list of books in the database and search for books by title
const BookList = () => {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");

  // Fetch the books from the database and update the books state
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = firebase
      .firestore()
      .collection("books")
      .onSnapshot(
        (snapshot) => {
          const allBooks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBooks(allBooks);
          setIsLoading(false);
        },
        function (error) {
          console.log("Error in snapshot listener:", error);
        }
      );
    
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
            id="title"
            type="text"
            className="search-bar"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />

          <label htmlFor="title">Search by title</label>
        </div>
        <div className="row" style={{ padding: "16px" }}>
          {books.length > 0 ? (
            books
              // filter function with book.title before the && is to prevent error when book.title is null
              .filter(
                (book) =>
                  book.title &&
                  book.title.toLowerCase().includes(searchTitle.toLowerCase())
              )
              // map function to map each book to a card with the book details and a link to the book details page
              .map((book) => (
                <div className="col s12 m4" key={book.id}>
                  <div className="card grey lighten-5 z-depth-1 hoverable">
                    <div className="card-image">
                      <img
                        src={book.imageURL}
                        style={{ height: "250px" }}
                        alt={book.author}
                      />
                    </div>

                    
                    <div className="card-action center" style={{overflow: 'hidden'}}>
                      <Link
                        to={`book/${book.id}`}
                        className="btn black darken-1 hoverable"
                      >
                        View Details{" "}
                        <i className="material-icons right">arrow_forward</i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
          ) : (

            // else display a message that there are no books available
            <h3>No books available</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;
