import React, { useContext } from 'react';
import { Navigate } from "react-router-dom";
import { AuthContext } from "../utility/auth";

export const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);

    if (isLoggedIn === null) {
      return <h1>Loading...</h1>;
    }

    else if (isLoggedIn === false) {
      // user is not authenticated
      return <Navigate to="/login" />;
    }
    return children;
};

