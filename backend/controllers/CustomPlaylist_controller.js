const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const {
  createPlaylist,
  getUserPlaylists,
  deletePlaylist,
} = require("../models/CustomPlaylist_model");

const JWT_SECRET = process.env.JWT_SECRET;

async function handleCreate(req, res) {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Playlist name required" });

    const db = getDB();
    const existing = await db.collection('custom_playlists').findOne({ userId: new ObjectId(userId), name });
    if (existing) return res.status(409).json({ error: "Playlist with the same name already exists" });

    await createPlaylist(userId, name);
    const updatedPlaylists = await getUserPlaylists(userId);

    res.status(201).json({ message: "Playlist created", playlistsData: updatedPlaylists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGet(req, res) {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const playlists = await getUserPlaylists(userId);
    res.json({ playlistsData: playlists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
}

async function handleDelete(req, res) {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    console.log("userId: ", userId);

    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Playlist name required" });

    const db = getDB();
    const existing = await db.collection('custom_playlists').findOne({ userId: new ObjectId(userId), name });
    if (!existing) return res.status(404).json({ error: "Playlist does not exist" });

    await deletePlaylist(userId, name);
    const updatedPlaylists = await getUserPlaylists(userId);

    res.json({ message: "Playlist removed", playlistsData: updatedPlaylists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
}

async function handleGetCustomPlaylist(req, res) {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const playlistId = req.params.id;
    if (!playlistId) return res.status(400).json({ error: "Playlist ID is required" });

    const db = getDB();
    const playlist = await db.collection('custom_playlists').findOne({
      _id: new ObjectId(playlistId),
      userId: new ObjectId(userId)
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Optional: Populate song details if needed
    const songs = playlist.songsId.length
      ? await db.collection('songs')
          .find({ _id: { $in: playlist.songsId.map(id => new ObjectId(id)) } })
          .toArray()
      : [];

    res.json({
      playlistData: {
        _id: playlist._id,
        name: playlist.name,
        songs,
        createdAt: playlist.createdAt
      }
    });
  } catch (err) {
    console.error("Get Custom Playlist Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function addSongToPlaylist(req, res) {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    console.log("userId: ", userId);

    const { songId, id: playlistId } = req.body;
    console.log("songId: ", songId);
    console.log("playlistId: ", playlistId);

    if (!songId || !playlistId) return res.status(400).json({ error: "Invalid request" });

    const db = getDB();
    const playlist = await db.collection("custom_playlists").findOne({ _id: new ObjectId(playlistId), userId: new ObjectId(userId) });

    console.log("playlist: ", playlist);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });

    if (playlist.songsId.includes(songId)) return res.status(400).json({ error: "Song already in playlist" });

    await db.collection("custom_playlists").updateOne(
      { _id: new ObjectId(playlistId) },
      { $push: { songsId: songId } }
    );

    res.status(200).json({ message: "Song added to playlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getPlaylistDataById(req, res) {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const playlistId = req.params.id;
    if (!playlistId) return res.status(400).json({ error: "Playlist ID required" });

    const db = getDB();
    const playlist = await db.collection("custom_playlists").findOne({ _id: new ObjectId(playlistId), userId: new ObjectId(userId) });
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });

    const songIds = playlist.songsId.map((id) => new ObjectId(id));
    const songs = await db.collection("songs").find({ _id: { $in: songIds } }).toArray();

    res.json({
      name: playlist.name,
      songs: songs.map(song => ({
        _id: song._id,
        name: song.song_name,
        duration: song.song_duration,
        imagePath: song.song_imagepath,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch playlist data" });
  }
}



module.exports = {
  handleCreate,
  handleGet,
  handleDelete,
  handleGetCustomPlaylist,
  addSongToPlaylist,
  getPlaylistDataById
};
