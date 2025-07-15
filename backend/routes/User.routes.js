const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/User_controller");

router.post("/signup", registerUser);

module.exports = router;