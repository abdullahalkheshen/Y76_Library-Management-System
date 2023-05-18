import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import firebase from "../../firebase-config";


// Display the navigation bar 
const NavBar = () => {
  // Get the user from the AuthContext
  const { user } = useContext(AuthContext);
  console.log("NavBar user:", user);
  return (
    <div className="navbar-fixed">
      <nav className="black darken-4">
        <div className="container nav-wrapper">
          <Link to="/dashboard">  
            <span className="brand-logo">Library System</span>
          </Link>

          
          {user !== null ? (
            <ul className="right">
              <li>
                
                <button
                  className="btn black-text waves-effect waves-teal red"
                  onClick={() => firebase.auth().signOut()}
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
