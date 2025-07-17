const express = require("express");
const router = express.Router();
const { getSystemPlaylists, getSystemPlaylistData } = require("../controllers/SystemPlaylist_controller");
const { getArtistData } = require("../controllers/Artist_controller");
const { syncLikedSongs, getLikedSongsDetails } = require("../controllers/LikedSongs_controller");
const { handleGetNextSong, handleGetPrevSong } = require("../controllers/Song_controller")
const {
  handleCreate,
  handleGet,
  handleDelete,
  handleGetCustomPlaylist,
  addSongToPlaylist,
  getPlaylistDataById
} = require("../controllers/CustomPlaylist_controller");

router.get("/getAlbumData", getSystemPlaylists);
router.get("/artist/:id", getArtistData);
router.get("/systemPlaylist/:id", getSystemPlaylistData);
router.post("/likedSongs/sync", syncLikedSongs);
router.post("/likedSongs/details", getLikedSongsDetails);
router.get('/next/:index', handleGetNextSong);
router.get('/prev/:index', handleGetPrevSong);
router.post("/addPlaylist", handleCreate);
router.get("/getPlaylist", handleGet);
router.post("/removePlaylist", handleDelete);
router.get("/CustomPlaylist/:id", handleGetCustomPlaylist);
router.post("/addSong", addSongToPlaylist);

module.exports = router;
