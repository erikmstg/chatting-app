const mongoose = require("mongoose");
require("dotenv").config();

const { DB_USER, DB_PW } = process.env;

mongoose.connect(
  `mongodb+srv://${DB_USER}:${DB_PW}@cluster0.uekdg.mongodb.net/chatApp?retryWrites=true&w=majority`,
  function (err) {
    if (err) console.log(err);

    console.log("Connected to chatApp database");
  }
);
