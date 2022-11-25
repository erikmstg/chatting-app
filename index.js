const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./routes/UserRoute");
const User = require("./models/UserModel");

// import the connection env to database
require("./connection");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", userRoute);

const { PORT } = process.env;
const rooms = ["general", "tech", "finance", "crypto"];

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// after create context.provider
app.get("/rooms", (req, res) => {
  res.json(rooms);
});

async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },

    // create for each date a group messages all the messages by that specific date
    { $group: { _id: "$date", messageByDate: { push: "$$ROOT" } } },
  ]);

  return roomMessages;
}

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    // change date (mm/dd/yyyy) => (yyyy/mm/dd)
    let date = a._id.split("/");
    let newDate = b._id.split("/");

    date = newDate[2] + newDate[0] + newDate[1];
    newDate = date[2] + date[0] + date[1];

    return date < newDate ? -1 : 1;
  });
}

// socket connection
// (socket) come from frontend, that user select room
io.on("connection", (socket) => {
  // if new user join the room
  socket.on("new-user", async () => {
    const members = await User.find();
    // emit to all those users that have connected to the socket
    io.emit("new-user", members);

    // socket.emit its only to specific user
  });

  // wrapping socket logic
  socket.on("join-room", async (room) => {
    socket.join(room);

    // after join the room
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);

    // and then send back to client
    socket.emit("room-messages", roomMessages);
  });
});

// server
server.listen(PORT, () => {
  console.log("Running at port", PORT);
});
