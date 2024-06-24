import {React, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import RootLayout from './routes/RootLayout';
import Register from './components/Register';
import Login from './components/Login';
import { AuthProvider } from './components/AuthContext';


// const cors = require('cors');
// const express = require('express');
// const app = express();

// // Use CORS middleware
// app.use(cors());


const router = createBrowserRouter([
  {path: '/', element: <RootLayout/>, children:[
    {path: '/', element: <App/>, children:[
      {path: '/register', element: <Register/>},
      {path: '/login', element: <Login/>
      }]
    },
    // {path: '/login', element: </>},
    // {path: '/logout', element: </>},
    // {path: '/user', element: </>}
  ] },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    // <App />
    <AuthProvider>
    <RouterProvider router = {router}/>
    </AuthProvider>
  // {/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
