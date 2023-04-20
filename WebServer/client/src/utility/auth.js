import React, { createContext, useState, useEffect } from "react";
import Backend from "./backend";

export const AuthContext = createContext();
// Store the username in context
export const UserContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const response = await Backend.validateSession();
        if (response.isValid) {
          setIsLoggedIn(true);
          setUsername(response.username);
        } else {
          setIsLoggedIn(false);
          setUsername('');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchLoginStatus();
  },[]);

  const setLoggedIn = (value) => {
    setIsLoggedIn(value);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn}}>
    <UserContext.Provider value={username}>
      {children}
    </UserContext.Provider>
    </AuthContext.Provider>
  );
}