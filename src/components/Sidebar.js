import { useContext, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";

const Sidebar = () => {
  const user = useSelector((state) => state.user);

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

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, []);

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

  if (!user) return <></>;

  return (
    <>
      <div className="room-chat">
        <h2>list room chat</h2>
        <ListGroup>
          {rooms.map((room, i) => (
            <ListGroup.Item key={i}>{room}</ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <div className="user">
        <h2>Members</h2>
        <ListGroup>
          {members.map((member) => (
            <ListGroup.Item key={member._id} style={{ cursor: "pointer" }}>
              {member.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
};

export default Sidebar;
