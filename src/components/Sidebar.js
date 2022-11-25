import { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";

const Sidebar = () => {
  const list = ["one", "two", "three"];

  const user = useSelector((state) => state.user);

  const { socket } = useContext(AppContext);

  // have off & on, because if only on it will still, if you keep listening the message to make sure that switch it off before on
  // otherwise it will have bugs
  socket.off("new-user").on("new-user", (payload) => {
    console.log(payload);
  });

  if (!user) return <></>;

  return (
    <>
      <h2>list room chat</h2>
      <ListGroup>
        {list.map((list, i) => (
          <ListGroup.Item key={i}>{list}</ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Members</h2>
    </>
  );
};

export default Sidebar;
