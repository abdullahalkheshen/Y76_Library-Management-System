import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Dashboard from "./components/layout/Dashboard";
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import Login from "./components/layout/Login";


// import AddBook from "./components/AddBook";
// import EditBook from "./components/EditBook";
import ProtectedComponent from "./components/books/AddBook";
import BookDetails from "./components/books/BookDetails";
import BookList from "./components/books/BookList";

import AddAuthor from "./components/authors/AddAuthor";
import EditAuthor from "./components/authors/EditAuthor";
import AuthorDetails from "./components/authors/AuthorDetails";
import AuthorList from "./components/authors/AuthorList";
import "materialize-css/dist/css/materialize.min.css";
import "./App.css";


function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/add/book" component={ProtectedComponent} />
          <Route path="/book/:id" component={BookDetails} />
          <Route path="/books" component={BookList} />
          <Route path="/add/author" component={AddAuthor} />
          <Route path="/author/:id" component={AuthorDetails} />
          <Route path="/edit/author/:id" component={EditAuthor} />
          <Route path="/authors" component={AuthorList} />
          <Route path="/books" component={BookList} />
          <Route path="/" component={Login} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;