const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const { getSongsByIds } = require("./Song_model");

const getAllArtists = async () => {
  const db = getDB();
  const artists = await db.collection("artists").find({}).toArray();
  return artists;
};

const getArtistDataById = async (artistId) => {
  const db = getDB();

  // Fetch the artist by _id
  const artist = await db.collection("artists").findOne({ _id: new ObjectId(artistId) });

  if (!artist) {
    throw new Error("Artist not found");
  }

  // Get all songs by ID
  const songs = await getSongsByIds(artist.songs);

  return {
    name: artist.name,
    imagePath: artist.imagePath,
    songs: songs
  };
};

module.exports = {
  getAllArtists,
  getArtistDataById
};
