const express = require("express");
const router = express.Router();
const { getBeatxData } = require("../controllers/Beatx_controller");

router.get("/getBeatxData", getBeatxData);

module.exports = router;
