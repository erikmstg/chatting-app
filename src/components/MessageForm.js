import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import "./MessageForm.css";

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const handleSend = (e) => {
    e.preventDefault();
    console.log(message, "send message");
  };

  return (
    <>
      <div className="message-output"></div>
      <Form onSubmit={handleSend}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Your Message..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "green" }}
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
