const { MongoClient } = require("mongodb");

let dbInstance;

const connectDB = async () => {
  const client = await MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  dbInstance = client.db(process.env.DB_NAME);
  console.log("MongoDB connected");
};

const getDB = () => {
  if (!dbInstance) {
    throw new Error("DB not connected yet.");
  }
  return dbInstance;
};

module.exports = { connectDB, getDB };
