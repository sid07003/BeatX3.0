const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const getRandomSongs = async (limit = 15) => {
  const db = getDB();
  const songs = await db.collection("songs").aggregate([
    { $sample: { size: limit } }
  ]).toArray();
  return songs;
};

const getSongsByIds = async (songIds) => {
  const db = getDB();

  // Convert string IDs to ObjectId
  const objectIds = songIds.map(id => new ObjectId(id));

  const songs = await db.collection("songs").find({
    _id: { $in: objectIds }
  }).toArray();

  return songs;
};

const getNextSong = async (currentIndex) => {
  const db = getDB();
  const songsCollection = db.collection('songs');

  const nextSong = await songsCollection.findOne({ index: currentIndex + 1 });

  if (nextSong) return nextSong;

  return await songsCollection.findOne({}, { sort: { index: 1 } });
};

const getPrevSong = async (currentIndex) => {
  const db = getDB();
  const songsCollection = db.collection('songs');

  const prevSong = await songsCollection.findOne({ index: currentIndex - 1 });

  if (prevSong) return prevSong;

  return await songsCollection.findOne({}, { sort: { index: -1 } });
};

module.exports = {
  getRandomSongs,
  getSongsByIds,
  getNextSong,
  getPrevSong
};
