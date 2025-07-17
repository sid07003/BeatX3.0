const SystemPlaylistModel = require("../models/SystemPlaylist_model");

const getSystemPlaylists = async (req, res) => {
  try {
    const playlists = await SystemPlaylistModel.getAllPlaylists();

    res.status(200).json({
      success: true,
      albums: playlists
    });
  } catch (err) {
    console.error("Error fetching system playlists:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const getSystemPlaylistData = async (req, res) => {
  try {
    const artistId = req.params.id;
    const data = await SystemPlaylistModel.getSystemPlaylistDataById(artistId);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in getArtistData:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getSystemPlaylists,
  getSystemPlaylistData
}