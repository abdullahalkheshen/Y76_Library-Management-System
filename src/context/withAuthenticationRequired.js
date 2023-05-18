import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";

// this function takes a component and returns a new component that checks if the user is logged in and redirects to the login page if not 
const withAuthenticationRequired = (Component, redirectPath = "/login") => {
  return (props) => {
    const { user } = useContext(AuthContext);
    if (!user) return <Redirect to={redirectPath} />;
    return <Component {...props} />;
  };
};

export default withAuthenticationRequired;
