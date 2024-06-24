import {React, useState} from 'react';
import './TopBar.css';
// import axios from 'axios';
import {Link, useLocation} from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from './AuthContext'; // Import the useAuth hook


// axios.defaults.xsrfCookieName = 'csrftoken';
// axios.defaults.xsrfHeaderName = 'X-CSRFToken';
// axios.defaults.withCredentials = true;

// const client = axios.create({
//   baseURL: "http://127.0.0.1:8000"
// });


const TopBar = () => {
  // var username = '';
  // var isLoggedIn = false;
  // const location = useLocation();
  // console.log(location.state)
  // isLoggedIn = location.state.isLoggedIn;
  // username = location.state.username;
  const { isLoggedIn, username, login, logout } = useAuth();

  return (
    <div className="top-bar">
      <div className='spacer'>
        <p className='buttons'>
        <Link to = "/login" className= {"button"}>
          {!isLoggedIn?("Login"):("Logout") }
        </Link>
        </p>
      </div>
      {!isLoggedIn ? (
        <>
        <div className='spacer'>
          <p className='buttons'>
          <Link to= "/register" className={"button"}>
            Register
          </Link>


          </p>
        </div>
        </>
      ) : (
        <>
          <span>Welcome, {username}!</span>
          <button onClick={null}>My Routes</button>
        </>
      )}
    </div>
  );
};

export default TopBar;
