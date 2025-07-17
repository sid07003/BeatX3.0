const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const { getSongsByIds } = require("./Song_model");

const SystemPlaylistModel = {
  getAllPlaylists: async () => {
    const db = getDB();
    return db.collection("system_playlist").find({}).toArray();
  },

  getSystemPlaylistDataById: async (playlistId) => {
    const db = getDB();

    const playlistData = await db.collection("system_playlist").findOne({ _id: new ObjectId(playlistId) });

    if (!playlistData) {
      throw new Error("playlistData not found");
    }

    // Get all songs by ID
    const songs = await getSongsByIds(playlistData.songs);

    return {
      name: playlistData.name,
      imagePath: playlistData.imagePath,
      songs: songs
    };
  }
};

module.exports = SystemPlaylistModel;
