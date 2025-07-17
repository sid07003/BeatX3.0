const jwt = require("jsonwebtoken");
const { getUserById } = require("../models/User_model");
const { getRandomSongs } = require("../models/Song_model");
const { getAllArtists } = require("../models/Artist_model");
const { getUserLikedSongs } = require("./LikedSongs_controller");
const { ObjectId } = require("mongodb");

exports.getBeatxData = async (req, res) => {
  const token = req.cookies.access_token;
  let isAuthenticated = false;
  let userData = null;
  let likedSongs = [];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      isAuthenticated = true;
      userData = await getUserById(decoded.id);

      if (userData) {
        likedSongs = await getUserLikedSongs(userData._id);
      }
    } catch (err) {
      console.log("JWT verification failed:", err.message);
    }
  }

  try {
    const trendingSongs = await getRandomSongs(15); // limit to 15
    const artistPlaylists = await getAllArtists();

    return res.status(200).json({
      isAuthenticated,
      lastPlayedMusic: userData?.lastPlayedSong || null,
      trendingSongs,
      artistPlaylists,
      likedSongs
    });
  } catch (err) {
    console.error("Error in getBeatxData:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
