const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET;

const getSearchData = async (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { id: userId } = jwt.verify(token, JWT_SECRET);
    const db = getDB();

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    const recentlySearchedIds = user?.recentlySearchedSongs || [];

    const recentlySearchedSongs = await db.collection("songs")
      .find({ _id: { $in: recentlySearchedIds.map(id => new ObjectId(id)) } })
      .toArray();

    const allSongs = await db.collection("songs")
      .find({}, { projection: { name: 1, imagePath: 1, duration: 1, audioPath: 1, artists: 1 } })
      .toArray();

    res.json({ allSongs, recentlySearchedSongs });
  } catch (err) {
    console.error("Search API error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const setCurrentlyPlayingMusicAndRecentlySearched = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { id: userId } = jwt.verify(token, JWT_SECRET);
    const db = getDB();

    const { song } = req.body;
    if (!song || !song._id) {
      return res.status(400).json({ message: "Invalid song data" });
    }

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    const current = user.recentlySearchedSongs || [];

    // Remove if already present
    const filtered = current.filter(id => id.toString() !== song._id);

    // Add new one at the front
    const updated = [song._id, ...filtered].slice(0, 10);

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          recentlySearchedSongs: updated,
          lastPlayedSong: song
        }
      }
    );

    res.status(200).json({ message: "Song updated in recently searched" });
  } catch (err) {
    console.error("Error updating recently searched song:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getSearchData, setCurrentlyPlayingMusicAndRecentlySearched };
