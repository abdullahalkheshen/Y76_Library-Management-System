import React, { useState, useEffect, useContext } from "react";
import firebase from "../../firebase-config";

import M from "materialize-css/dist/js/materialize.min.js";
import { AuthContext } from "../../context/Auth";


// login to the app 
const Login = (props) => {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect to the dashboard if the user is already logged in
  useEffect(() => {
    if (user) {
      props.history.push("/dashboard");
    }
  }, [user, props.history]);


  // async function to login to the app 
  const login = async (e) => {
    e.preventDefault();
    try {
      // below line will throw an error if the user is not found
      const response = await firebase
      // .auth() is the firebase authentication object    
        .auth()
        // call the signInWithEmailAndPassword method to login to the app
        .signInWithEmailAndPassword(email, password);
      console.log("Login: signInWithEmailAndPassword response:", response);
      
      // if the user is found, redirect to the dashboard
      if (response.user) {
        props.history.push("/dashboard");
      }
    } catch (error) {

      // display error message using Materialize 
      M.toast({ html: `${error.message}`, classes: "red rounded" });
    }
  };

  return (
    <div className="row">
      <div className="col s12 m6 offset-m3">
        <div className="card hoverable">
          <div className="card-content">
            <h5 className="center">Login to Dashboard</h5>
            <form onSubmit={login}>
              <div className="row">
                <div className="input-field col s12 m8 offset-m2">
                  <i className="material-icons prefix">email</i>
                  <input
                    id="email"
                    type="email"
                    className="validate"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="input-field col s12 m8 offset-m2">
                  <i className="material-icons prefix">keyboard_hide</i>
                  <input
                    id="password"
                    type="password"
                    className="validate"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="password">Password</label>
                </div>
              </div>
              <div className="card-action center" style={{overflow: 'hidden'}}>
                <button
                  className="waves-effect waves-light btn"
                  style={{ margin: "18px" }}
                  type="submit"
                >
                  Login
                  <i className="material-icons right">add_circle_outline</i>
                </button>
                <button
                  className="waves-effect waves-light btn red"
                  type="reset"
                  onClick={() => {
                    setEmail("");
                    setPassword("");
                  }}
                >
                  Reset <i className="material-icons right">cancel</i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
