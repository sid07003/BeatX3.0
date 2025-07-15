const { getDB } = require("../config/db");

const SystemPlaylistModel = {
  getAllPlaylists: async () => {
    const db = getDB();
    return db.collection("system_playlist").find({}).toArray();
  }
};

module.exports = SystemPlaylistModel;
