# BeatX3.0
Media Streaming Platform

-------------------  Users --------------------------------------------------
{
  _id: ObjectId,
  email: String,
  password: String,         // Hashed with bcrypt
  lastPlayedSong: {
    songId: ObjectId,
    playedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}

-------------------- User Playlist ------------------------------------------
{
  _id: ObjectId,
  name: String,                       // e.g., "Gym Bangers"
  description: String,               // Optional
  imagePath: String,                 // Optional
  createdBy: ObjectId("userId"),     // Owner of the playlist
  isPublic: Boolean,                 // false = private
  type: "user",                      // Could also be "liked" or "system"
  createdAt: Date,
  updatedAt: Date
}

------------------- Playlist Songs ------------------------------------------
{
  _id: ObjectId,
  playlistId: ObjectId("user_playlists"),
  songId: ObjectId("songs"),
  addedAt: Date,
  order: Number // Optional, for custom song order
}

------------------ user likes -----------------------------------------------
{
  _id: ObjectId,
  userId: ObjectId,
  songId: ObjectId,
  likedAt: Date
}