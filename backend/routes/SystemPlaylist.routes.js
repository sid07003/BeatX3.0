const express = require("express");
const router = express.Router();
const { getSystemPlaylists } = require("../controllers/SystemPlaylist_controller");

router.get("/getAlbumData", getSystemPlaylists);

module.exports = router;
