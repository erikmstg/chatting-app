import { Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Signup.css";
import botImg from "../assets/images/bot.webp";
import { useState } from "react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // image state
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const validateImg = (e) => {
    const file = e.target.files[0];
    if (file.size >= 1048576) return alert("Max file size 1024 kb");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "irjml5ul");
    try {
      setUploadingImg(true);
      const request = await fetch(
        "https://api.cloudinary.com/v1_1/mythstg/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const response = await request.json();
      setUploadingImg(false);
      return response.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!image) return alert("please upload your profile picture");
    const url = await uploadImage(image);
    console.log(url);
  };

  return (
    <Row className="py-4">
      <Col
        md={7}
        className="d-flex flex-direction-column align-items-center justify-content-center"
      >
        <Form
          className=""
          style={{ width: "80%", maxWidth: 500 }}
          onSubmit={handleSignup}
        >
          <h1 className="text-center">Create account</h1>
          <div className="signup-profile-pic__container">
            <img
              src={imagePreview || botImg}
              alt="display_picture"
              className="signup-profile-pic"
            />
            <label htmlFor="image-upload" className="image-upload-label">
              <i className="fas fa-plus-circle add-picture-icon" />
            </label>
            <input
              type="file"
              id="image-upload"
              hidden
              accept="image/jpeg, image/png"
              onChange={validateImg}
            />
          </div>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            />
          </Form.Group>

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
            {!uploadingImg ? "Sign you up" : "Sign up"}
          </Button>
          <div className="py-4">
            <p className="text-center">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </Form>
      </Col>
      <Col md={5} className="signup__bg" />
    </Row>
  );
};

export default Signup;
