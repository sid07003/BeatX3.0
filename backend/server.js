require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3001;
const userRoutes = require("./routes/user.routes");
const systemPlaylistRoutes = require("./routes/SystemPlaylist.routes");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use("/api/users", userRoutes);
app.use("/api/albums", systemPlaylistRoutes);

// Connect DB & Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});