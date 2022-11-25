import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./MessageForm.css";

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const handleSend = (e) => {
    e.preventDefault();
    console.log(message, "send message");
  };

  const user = useSelector((state) => state.user);

  return (
    <>
      <div className="message-output">
        {!user && (
          <div className="alert alert-danger">
            <Form.Text>Plase login</Form.Text>
          </div>
        )}
      </div>
      <Form onSubmit={handleSend}>
        <Row className="">
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Your Message..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                disabled={!user}
              />
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "green" }}
              disabled={!user}
            >
              <i className="fas fa-paper-plane" />
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default MessageForm;
