import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

const Home = () => {
  return (
    <Row className="mx-auto py-5">
      <Col
        md={6}
        className="d-flex flex-direction-column align-items-center justify-content-center"
      >
        <div className="">
          <h1>Share any opinion with your friend</h1>
          <p>Chat App lets connect with friends in the world</p>
          <LinkContainer to="/chat">
            <Button variant="success">
              Get started <i className="fas fa-comments home-message-icon" />
            </Button>
          </LinkContainer>
        </div>
      </Col>
      <Col md={6} className="home__bg " />
    </Row>
  );
};

export default Home;
