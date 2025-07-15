const SystemPlaylistModel = require("../models/SystemPlaylist_model");

exports.getSystemPlaylists = async (req, res) => {
  try {
    const playlists = await SystemPlaylistModel.getAllPlaylists();
    console.log(playlists);

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
