import React, { useState, useContext, useEffect } from "react";
import Backend from "../utility/backend";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../utility/auth";
import './Login.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, setLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await Backend.loginUser({
        username,
        password
      });

      console.log("received response - need to redirect!");
      if (isLoggedIn) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Login</button>
      <br />
      <Link to="/registration">Sign up?</Link>
    </form>
  );
}

export default Login;
