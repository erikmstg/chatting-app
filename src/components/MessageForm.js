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
    setMessages(roomMessages);
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!message) return;
    const roomId = currentRoom;

    socket.emit("message-room", roomId, message, user, time, date);
    console.log(messages);
    setMessage("");
  };

  return (
    <>
      <div className="message-output">
        {!user ? (
          <div className="alert alert-danger">
            <Form.Text>Please login</Form.Text>
          </div>
        ) : (
          <div className="">
            {messages?.map(({ _id, messagesByDate }, i) => (
              <div key={i}>
                <p className="alert alert-info text-center message-date-indicator ">
                  {_id}
                </p>
                {messagesByDate?.map(({ content, time, from: { name } }, i) => (
                  <div key={i} className="d-flex">
                    <Row className="mx-auto w-100">
                      <Col className="mx-auto my-1">
                        <div className="card">
                          <div
                            className="card-body"
                            data-mdb-perfect-scrollbar="true"
                            style={{
                              position: "relative",
                            }}
                          >
                            <div className="d-flex justify-content-between gap-3">
                              <p className="medium mb-1">{name}</p>
                              <p className="small mb-1 text-muted">{time}</p>
                            </div>
                            <div className="d-flex flex-row justify-content-start">
                              <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                                alt="avatar 1"
                                style={{ width: "45px", height: "100%" }}
                              />
                              <div className="">
                                <p
                                  className="small p-2 ms-3 mb-3 rounded-3 text-dark"
                                  style={{
                                    backgroundColor: "#61B4E4",
                                  }}
                                >
                                  {content}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      {user && (
        <Form onSubmit={handleSend}>
          <Row className="">
            <Col md={10}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter Message..."
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button
                variant="primary"
                type="submit"
                style={{ width: "100%", backgroundColor: "green" }}
                disabled={!message}
              >
                <i className="fas fa-paper-plane" />
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

export default MessageForm;
