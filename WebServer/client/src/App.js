import './App.css';
import { useEffect, useState, useContext } from 'react';
import Backend from './utility/backend';
import { UserContext } from './utility/auth';
import { routing } from './shared/routing';

function App() {

  const username = useContext(UserContext);

  async function logout() {
    const response = await Backend.logoutUser();
    console.log("Logout res", response);
    window.location.replace(routing.clienturl + '/login');
  }

  return (
    <div className='app-wrapper'>
      <button className='logout' onClick={logout}>Log Out</button>
      <h1>Welcome, {username}!</h1>
      <h2>Select an option below to get started</h2>
    </div>
  );
}

export default App;
