const router = require("express").Router();
const { createUser, loginUser } = require("../controllers/UserController");

// create user
router.post("/", createUser);

// login user
router.post("/login", loginUser);

module.exports = router;
