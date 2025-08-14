# BeatX 3.0 🎵
A MERN-based media streaming prototype built to demonstrate clean code practices, modular architecture, and efficient development workflows. Includes JWT authentication, Redux state management, and a normalized MongoDB schema for songs, playlists, likes, and users.

---

## 🚀 Tech Stack
**Frontend:** React, Redux, HTML, CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (with join-style collections)  
**Other Tools:** Python (for dataset generation), JWT, bcrypt

---

## ✨ Features
- Secure JWT-based authentication
- Redux for global state management
- Public and private playlists
- Liked songs and recently played tracking
- Seeded database with realistic music data using Python scripts

---

## 🗄️ Database Schema

### **Users**
```json
{
  _id: ObjectId,
  email: String,
  password: String,         
  lastPlayedSong: {
    songId: ObjectId,
    playedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}

-------------------- User Playlist ------------------------------------------
```json
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
```json
{
  _id: ObjectId,
  playlistId: ObjectId("user_playlists"),
  songId: ObjectId("songs"),
  addedAt: Date,
  order: Number // Optional, for custom song order
}

------------------ user likes -----------------------------------------------
```json
{
  _id: ObjectId,
  userId: ObjectId,
  songId: ObjectId,
  likedAt: Date
}
