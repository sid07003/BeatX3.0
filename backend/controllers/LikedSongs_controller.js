const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const { syncUserLikedSongs, getLikedSongsByUserId } = require("../models/LikedSongs_model");

const syncLikedSongs = async (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token" });
  }

  try {
    const userData = jwt.verify(token, JWT_SECRET);
    const userId = userData.id;
    const { likedSongs } = req.body; // Now getting full likedSongs array

    await syncUserLikedSongs(userId, likedSongs);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error syncing liked songs:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getLikedSongsDetails = async (req, res) => {
  const { songIds } = req.body;

  if (!Array.isArray(songIds)) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  try {
    const db = getDB();
    const objectIds = songIds.map(id => new ObjectId(id));

    const songs = await db.collection("songs").find({ _id: { $in: objectIds } }).toArray();
    res.status(200).json({ success: true, songs });
  } catch (err) {
    console.error("Error fetching liked song details:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const getUserLikedSongs = async (userId) => {
  const songIds = await getLikedSongsByUserId(userId);
  if (!songIds || songIds.length === 0) return [];
  return songIds;
};

module.exports = {
  getUserLikedSongs,
  syncLikedSongs,
  getLikedSongsDetails
};
