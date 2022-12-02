import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";
import "./MessageForm.css";

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const messageEndRef = useRef(null);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getFormatDate() {
    const date = new Date();
    const year = date.getFullYear();

    let month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : "0" + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    setMessage("");
  };

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Des",
  ];

  function sortingDate(date) {
    const dates = date.split("/");
    const months = dates[0].slice();
    const bln = months[0] === 0 ? months[1] : months;
    return dates[1] + ` ${month[bln - 1]} ` + dates[2];
  }

  return (
    <>
      <div className="message-output">
        {user && !privateMemberMessage?._id && (
          <div className="alert alert-info">
            You're in the {currentRoom}'s room
          </div>
        )}
        {user && privateMemberMessage?._id && (
          <>
            <div className="alert alert-info conversation-info justify-content-between d-flex align-items-center">
              You're in {privateMemberMessage.name}'s conversation
              <div className="gap-2 d-flex align-items-center">
                {privateMemberMessage.name}
                <img
                  src={privateMemberMessage.picture}
                  className="private-member-img"
                />
              </div>
            </div>
          </>
        )}
        {!user ? (
          <div className="alert alert-danger">
            <Form.Text>Please login</Form.Text>
          </div>
        ) : (
          <div className="">
            {messages.map(({ _id: date, messagesByDate }) => (
              <div key={date} className="">
                <div className="justify-content-center align-items-center d-flex message-date-indicator alert alert-info mb-3">
                  <span className="">{sortingDate(date)}</span>
                </div>
                {messagesByDate?.map(
                  ({ content, time, from: { _id, name, picture } }, i) => (
                    <div
                      key={i}
                      className={
                        _id === user._id ? "message" : "incoming-message"
                      }
                    >
                      <div className="message-inner">
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src={picture}
                            style={{
                              width: 35,
                              height: 35,
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                          <p className="message-sender">
                            {_id === user._id ? (
                              <>
                                {name}
                                <span className="text-muted small"> (You)</span>
                              </>
                            ) : (
                              name
                            )}
                          </p>
                        </div>
                        <p className="message-content">{content}</p>
                        <p className="message-timestamp">{time}</p>
                      </div>
                      {/* <Row className="mx-auto w-100">
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
                                <p className="medium mb-1">
                                  {_id === user._id ? `${name} (You)` : name}
                                </p>
                                <p className="small mb-1 text-muted">{time}</p>
                              </div>
                              <div className="d-flex flex-row align-item-center justify-content-start">
                                <img
                                  src={picture}
                                  alt="avatar"
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                  className="d-outline-block"
                                />
                                <p
                                  className="p-2 ms-3 mb-3 rounded-3 text-dark"
                                  style={{
                                    backgroundColor: "#61B4E4",
                                    border: "1px solid",
                                  }}
                                >
                                  {content}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row> */}
                    </div>
                  )
                )}
              </div>
            ))}
            <div className="" ref={messageEndRef}></div>
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
