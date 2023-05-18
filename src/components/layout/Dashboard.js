import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import BookList from "../books/BookList";
import AuthorList from "../authors/AuthorList";


// Display the dashboard with links to add books and authors and a list of books and authors in the database 
const Dashboard = (props) => {
  const { user } = useContext(AuthContext);

  // Redirect to login page if the user is not logged in
  useEffect(() => {
    if (!user) {
      props.history.push("/login");
    }
  }, [user, props.history]);

  // Display the dashboard
  return (
    <div className="row">
      
      <div className="col s12 m2 left-panel">
        <h4>Manage Library</h4>

        <div className="button-row">
          <Link
            to="/add/book"
            className="waves-effect waves-light btn green darken-3 hoverable"
            style={{ margin: "10px 0px" }}
          >
            ADD BOOK <i className="material-icons right">add</i>
          </Link>

          <Link
            to="/add/author"
            className="waves-effect waves-light btn green darken-3 hoverable"
            style={{ margin: "10px 0px" }}
          >
            ADD AUTHOR <i className="material-icons right">add</i>
          </Link>
        </div>

        <div className="button-row">
          <Link
            to="/books"
            className="waves-effect waves-light btn green darken-3 hoverable"
            style={{ margin: "10px 0px" }}
          >
            VIEW BOOKS <i className="material-icons right">visibility</i>
          </Link>

          <Link
            to="/authors"
            className="waves-effect waves-light btn green darken-3 hoverable"
            style={{ margin: "10px 0px" }}
          >
            VIEW AUTHORS <i className="material-icons right">visibility</i>
          </Link>
        </div>
      </div>

      <div className="col s12 m10 right-panel">
        <div className="book-author-container">
          <BookList />
          <AuthorList /> //  Render the book list and author list
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
