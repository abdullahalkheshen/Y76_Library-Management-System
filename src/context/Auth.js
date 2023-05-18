import React, { useState, useEffect } from "react";
import firebase from "../firebase-config.js";

// Create the context object that will be provided to components
export const AuthContext = React.createContext();

// Provide the user data to the rest of the app via context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      console.log("AuthProvider: Auth state changed, user:", user);
      setUser(user);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  console.log("AuthProvider: Rendering, user:", user);
  
  // Render the children with the auth context information
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
