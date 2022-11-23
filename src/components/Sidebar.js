import { ListGroup } from "react-bootstrap";

const Sidebar = () => {
  const list = ["one", "two", "three"];
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
