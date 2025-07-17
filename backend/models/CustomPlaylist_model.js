const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const COLLECTION = "custom_playlists";

async function createPlaylist(userId, name) {
  const db = getDB();
  const existing = await db.collection(COLLECTION).findOne({ userId: new ObjectId(userId), name });
  if (existing) throw new Error("EXISTS");
  const newPlaylist = { userId: new ObjectId(userId), name, songsId: [], createdAt: new Date() };
  await db.collection(COLLECTION).insertOne(newPlaylist);
}

async function getUserPlaylists(userId) {
  const db = getDB();
  return db.collection(COLLECTION)
    .find({ userId: new ObjectId(userId) })
    .project({ name: 1, songsId: 1 })
    .toArray();
}

async function deletePlaylist(userId, name) {
  const db = getDB();
  await db.collection(COLLECTION).deleteOne({ userId: new ObjectId(userId), name });
}

module.exports = {
  createPlaylist,
  getUserPlaylists,
  deletePlaylist,
};
