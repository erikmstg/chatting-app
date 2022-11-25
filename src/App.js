import "./App.css";
import Navigation from "./components/Navigation";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useState } from "react";
import { socket, AppContext } from "./context/appContext";

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRooms] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMessage, setPrivateMemberMessage] = useState({});
  const [newMessages, setNewMessages] = useState({});

  const user = useSelector((state) => state.user);

  return (
    // provider value is an object
    <AppContext.Provider
      value={{
        socket,
        rooms,
        setRooms,
        currentRoom,
        setCurrentRooms,
        members,
        setMembers,
        messages,
        setMessages,
        privateMemberMessage,
        setPrivateMemberMessage,
        newMessages,
        setNewMessages,
      }}
    >
      <Router>
        <Navigation />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            {!user && (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </>
            )}
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Container>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
