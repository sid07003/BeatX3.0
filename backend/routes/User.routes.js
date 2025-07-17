const express = require("express");
const router = express.Router();
const { registerUser, logoutUser, loginUser } = require("../controllers/User_controller");

router.post("/signup", registerUser);
router.post("/logout", logoutUser);
router.post("/login", loginUser);

module.exports = router;