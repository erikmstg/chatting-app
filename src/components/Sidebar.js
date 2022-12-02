import { useContext, useEffect } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";

const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    socket,
    members,
    setMembers,
    rooms,
    setRooms,
    currentRoom,
    setCurrentRoom,
    privateMemberMessage,
    setPrivateMemberMessage,
  } = useContext(AppContext);

  const joinRoom = (room, isPublic = true, currentRoom) => {
    if (!user) return alert("please login");

    socket.emit("join-room", room);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMessage(null);
    }

    // dispatch for notifications
    dispatch(resetNotifications(room));
  };

  // listen for event socket
  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom !== room) dispatch(addNotifications(room));
  });

  function orderId(a, b) {
    if (a > b) {
      return a + "-" + b;
    } else {
      return b + "-" + a;
    }
  }

  const handlePrivateMember = (member) => {
    setPrivateMemberMessage(member);
    const roomId = orderId(user._id, member._id);
    joinRoom(roomId, false);
  };

  // have off & on, because if only on it will still, if you keep listening the message to make sure that switch it off before on
  // otherwise it will have bugs
  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  function getRooms() {
    fetch("http://localhost:5000/rooms")
      .then((req) => req.json())
      .then((res) => setRooms(res));
  }

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, []);

  if (!user) return <></>;

  return (
    <>
      <div className="room-chat">
        <h2>Available rooms</h2>
        <ListGroup>
          {rooms.map((room, i) => (
            <ListGroup.Item
              key={i}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
              onClick={() => joinRoom(room)}
              active={room === currentRoom}
            >
              {room}
              {currentRoom !== room && (
                <span className="badge rounded-pill bg-primary">
                  {user.newMessage[room]}
                </span>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <div className="user">
        <h2>Members</h2>
        <ListGroup>
          {members.map((member) => (
            <ListGroup.Item
              key={member._id}
              style={{ cursor: "pointer" }}
              active={privateMemberMessage?._id === member._id}
              disabled={member._id === user._id}
              onClick={() => {
                handlePrivateMember(member);
              }}
            >
              <Row className="d-flex align-items-center">
                <Col xs={2} className="member-status">
                  <img src={member.picture} className="member-img" />
                  <i
                    className={`fas fa-circle bar ${
                      member.status === "online"
                        ? "online-status"
                        : "offline-status"
                    } `}
                  />
                </Col>
                <Col xs={9}>
                  {member.name} {member.status === "offline" && "  (offline)"}
                  {user._id === member._id && "  (You)"}
                </Col>
                <Col className="badge rounded-pill bg-primary">
                  {user.newMessage[orderId(member._id, user._id)]}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
};

export default Sidebar;
