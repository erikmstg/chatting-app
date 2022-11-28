import { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";
import "./MessageForm.css";

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const {
    socket,
    currentRoom,
    messages,
    setMessages,
    privateMemberMessage,
    setPrivateMemberMessage,
    newMessages,
    setNewMessages,
  } = useContext(AppContext);

  function getFormatDate() {
    const date = new Date();
    const year = date.getFullYear();

    let month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : "0" + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return day + "/" + month + "/" + year;
  }

  function getTimeDate() {
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const hour = today.getHours();

    return hour + ":" + minutes;
  }

  const date = getFormatDate();
  const time = getTimeDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    console.log("room messages: ", roomMessages);
    setMessages(roomMessages);
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!message) return;
    const roomId = currentRoom;

    socket.emit("message-room", roomId, message, user, time, date);
    setMessage("");
  };

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
          <Col md={10}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter Message..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                disabled={!user}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
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
