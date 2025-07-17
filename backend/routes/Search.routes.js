const express = require("express");
const { getSearchData, setCurrentlyPlayingMusicAndRecentlySearched } = require("../controllers/Search_controller");
const router = express.Router();

router.get("/searchData", getSearchData);
router.post("/setCurrentlyPlayingMusicAndRecentlySearched", setCurrentlyPlayingMusicAndRecentlySearched);

module.exports = router;
