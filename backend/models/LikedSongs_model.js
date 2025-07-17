const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "liked_songs";

const getLikedSongsByUserId = async (userId) => {
  const db = getDB();
  const docs = await db
    .collection(COLLECTION_NAME)
    .find({ userId: new ObjectId(userId) })
    .toArray();
  return docs.map(doc => doc.songId.toString());
};

const syncUserLikedSongs = async (userId, likedSongsArray) => {
  const db = getDB();
  const userObjectId = new ObjectId(userId);
  const likedSongsSet = new Set(likedSongsArray);

  const existingDocs = await db
    .collection(COLLECTION_NAME)
    .find({ userId: userObjectId })
    .toArray();
  const existingSongIds = existingDocs.map(doc => doc.songId.toString());

  // Songs to add
  const toAdd = likedSongsArray.filter(id => !existingSongIds.includes(id));
  // Songs to remove
  const toRemove = existingSongIds.filter(id => !likedSongsSet.has(id));

  for (const songId of toAdd) {
    await db.collection(COLLECTION_NAME).insertOne({
      userId: userObjectId,
      songId: new ObjectId(songId)
    });
  }

  for (const songId of toRemove) {
    await db.collection(COLLECTION_NAME).deleteOne({
      userId: userObjectId,
      songId: new ObjectId(songId)
    });
  }
};

module.exports = {
  getLikedSongsByUserId,
  syncUserLikedSongs
};
