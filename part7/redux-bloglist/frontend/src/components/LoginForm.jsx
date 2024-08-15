import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveUser } from "../reducers/userReducer";
import { Form, Button } from "react-bootstrap";
import Notification from "./Notification";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    
    event.preventDefault();
    console.log("login with", username, password);
    dispatch(saveUser({ username, password }));

    setUsername("");
    setPassword("");
  };

  return (
    <div>
    <h2>login</h2>
    <Notification />
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          data-testid="username"
          aria-label="username"
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>password:</Form.Label>
        <Form.Control
          data-testid="password"
          aria-label="password"
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        login
      </Button>
    </Form>
  </div>
  );
};

export default LoginForm;
