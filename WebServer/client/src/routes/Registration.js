import React, { useState } from 'react';
import Backend from '../utility/backend';
import { Link } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Send a request to the server with the registration information
    
    if (password !== passwordConfirm) {
        alert("Passwords do not match");
        return;
    }

    try {
        const response = await Backend.registerUser({
            username,
            password
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <br />
      <label>
        Confirm Password:
        <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} />
      </label>
      <br />
      <button type="submit">Register</button>
      <br />
      <Link to="/login">Already a user? Login!</Link>
    </form>
  );
}

export default Registration;
