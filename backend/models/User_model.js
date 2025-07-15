const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "users";

const createUser = async (userData) => {
  const db = getDB();
  const result = await db.collection(COLLECTION_NAME).insertOne(userData);
  return result;
};

const findUserByEmail = async (email) => {
  const db = getDB();
  return await db.collection(COLLECTION_NAME).findOne({ email });
};

module.exports = {
  createUser,
  findUserByEmail
};
