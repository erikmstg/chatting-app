import { Col, Row, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../services/appApi";
import "./Login.css";
import { useContext, useState } from "react";
import { AppContext } from "../context/appContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [loginUser, { isLoading, err }] = useLoginUserMutation();

  const { socket } = useContext(AppContext);

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        console.log(data);
        // socket work
        socket.emit("new-user");

        navigate("/chat");
      }
    });
  };

  return (
    <Row className="py-4">
      <Col md={5} className="login__bg" />
      <Col
        md={7}
        className="d-flex flex-direction-column align-items-center justify-content-center"
      >
        <Form
          className=""
          style={{ width: "80%", maxWidth: 500 }}
          onSubmit={handleLogin}
        >
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
          <div className="py-4">
            <p className="text-center">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
