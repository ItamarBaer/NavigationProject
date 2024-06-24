import { React, useState } from 'react';
import Modal from './Modal';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useAuth } from './AuthContext';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});
// client.defaults.xsrfCookieName = 'csrftoken';
// client.defaults.xsrfHeaderName = 'X-CSRFToken';
// client.defaults.withCredentials = true;

function Login() {
  const { isLoggedIn, login, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  let navigate = useNavigate();

  function submitLogin(e) {
    e.preventDefault();
    client.post("/api/login", {
      email: email,
      password: password
    })
    .then(function (res) {
      console.log(res)
      const csrfToken = res.headers['x-csrftoken']; // Extract CSRF token from the response headers
      client.defaults.headers.common['X-CSRFToken'] = csrfToken; // Set CSRF token for future requests
      return client.get("api/user");
    })
    .then(function (res) {
      login("example");
      navigate('/');
    })
    .catch(function (error) {
      // Handle login error
      console.error("Login error:", error);
    });
  }

  return (
    <Modal className={"form"}>
      <Form onSubmit={e => submitLogin(e)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  );
}

export default Login;
