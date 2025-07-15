const express = require("express");
const fs = require("fs");
const { MongoClient } = require("mongodb");

const app = express();
const MONGO_URL = "mongodb+srv://SiddharthSharma:siddharthsharma@cluster0.gacgrpw.mongodb.net/";
const DB_NAME = "beatxUpgrade";

const JSON_FILE_PATH = "f:/My projects/beatx3.0/backend/Temperory_data/songs_data.json";
const ARTIST_JSON_PATH = "f:/My Projects/BeatX3.0/backend/Temperory_data/artist_data.json";
const Playlist_JSON_PATH = "f:/My Projects/BeatX3.0/backend/Temperory_data/playlist_data.json";

let dbinstance;

// --------------------------- INSERT SONGS ---------------------------
async function insertSongs(db) {
    try {
        const data = fs.readFileSync(JSON_FILE_PATH, "utf-8");
        const songs = JSON.parse(data).map((song, index) => ({
            ...song,
            index,
        }));

        const result = await db.collection("songs").insertMany(songs);
        console.log(`Inserted ${result.insertedCount} songs.`);
    } catch (err) {
        console.error("Failed to insert songs:", err);
    }
}

// --------------------------- INSERT ARTISTS ---------------------------
async function insertArtists(db) {
    try {
        const data = fs.readFileSync(ARTIST_JSON_PATH, "utf-8");
        const parsed = JSON.parse(data);

        const result = await db.collection("artists").insertMany(parsed);
        console.log(`Inserted ${result.insertedCount} artists.`);
    } catch (err) {
        console.error("Failed to insert artists:", err);
    }
}

// --------------------------- INSERT SYSTEM PLAYLISTS ---------------------------
async function insertSystemPlaylists(db) {
    try {
        const data = fs.readFileSync(Playlist_JSON_PATH, "utf-8");
        const parsed = JSON.parse(data);

        const result = await db.collection("system_playlist").insertMany(parsed);
        console.log(`Inserted ${result.insertedCount} system playlists.`);
    } catch (err) {
        console.error("Failed to insert system playlists:", err);
    }
}

// --------------------------- ADD SONGS TO PLAYLISTS ---------------------------
async function populateSystemPlaylists(db) {
    const songsCollection = db.collection("songs");
    const playlistCollection = db.collection("system_playlist");

    // 1. Popular Songs — Random 15
    const randomPopular = await songsCollection.aggregate([{ $sample: { size: 15 } }]).toArray();
    await playlistCollection.updateOne(
        { name: "Popular Songs" },
        { $addToSet: { songs: { $each: randomPopular.map(s => s._id) } } }
    );
    console.log("✅ Added songs to Popular Songs");

    // 2. Punjabi Hits — By Artists
    const punjabiArtists = ["Diljit Dosanjh", "Shubh", "Guru Randhawa"];
    const punjabiSongs = await songsCollection.find({ artists: { $in: punjabiArtists } }).toArray();
    await playlistCollection.updateOne(
        { name: "Punjabi Hits" },
        { $addToSet: { songs: { $each: punjabiSongs.map(s => s._id) } } }
    );
    console.log("✅ Added songs to Punjabi Hits");

    // 3. Romantic Hits — By Artists
    const romanticArtists = ["Arijit Singh", "Shreya Ghoshal", "Atif Aslam"];
    const romanticSongs = await songsCollection.find({ artists: { $in: romanticArtists } }).toArray();
    await playlistCollection.updateOne(
        { name: "Romantic Hits" },
        { $addToSet: { songs: { $each: romanticSongs.map(s => s._id) } } }
    );
    console.log("✅ Added songs to Romantic Hits");

    // 4. Animal — By Exact Song Names
    const animalTitles = ["Arjan Vailly", "Haiwaan", "Hua Mein", "Pehle Bhi Mein", "Satranga"];
    const animalSongs = await songsCollection.find({ name: { $in: animalTitles } }).toArray();
    await playlistCollection.updateOne(
        { name: "Animal" },
        { $addToSet: { songs: { $each: animalSongs.map(s => s._id) } } }
    );
    console.log("✅ Added songs to Animal playlist");
}

async function populateArtistsWithSongs(db) {
    const songsCollection = db.collection("songs");
    const artistsCollection = db.collection("artists");

    const artistData = [
        { name: "Arijit Singh", imagePath: "../images/Arijit Singh.jpeg" },
        { name: "Shreya Ghoshal", imagePath: "../images//Shreya Ghoshal.jpeg" },
        { name: "Sonu Nigam", imagePath: "../images//Sonu Nigam.jpeg" },
        { name: "Atif Aslam", imagePath: "../images//Atif Aslam.jpeg" },
        { name: "Badshah", imagePath: "../images//Badshah.jpeg" },
        { name: "Jubin Nautiyal", imagePath: "../images//Jubin Nautiyal.jpeg" },
        { name: "Shubh", imagePath: "../images//Shubh.jpeg" },
        { name: "Honey Singh", imagePath: "../images//Honey Singh.jpeg" },
        { name: "Diljit Dosanjh", imagePath: "../images//Diljit Dosanjh.jpeg" },
        { name: "Armaan Malik", imagePath: "../images//Armaan Malik.jpeg" }
    ];

    for (const artist of artistData) {
        const matchingSongs = await songsCollection.find({
            artists: { $in: [artist.name] }
        }).toArray();

        await artistsCollection.updateOne(
            { name: artist.name },
            {
                $set: {
                    name: artist.name,
                    imagePath: artist.imagePath,
                    songs: matchingSongs.map(song => song._id)
                }
            },
            { upsert: true }
        );
    }

    console.log("✅ Populated artists collection with song references");
}


// --------------------------- INIT ---------------------------
MongoClient.connect(MONGO_URL)
    .then((client) => {
        dbinstance = client.db(DB_NAME);
        console.log("MongoDB connected");

        insertSongs(dbinstance);
        insertArtists(dbinstance);
        insertSystemPlaylists(dbinstance);

        setTimeout(() => {
            populateSystemPlaylists(dbinstance);
            populateArtistsWithSongs(dbinstance);
        }, 2000); // Give time for songs to insert
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });

// --------------------------- START SERVER ---------------------------
app.listen(3002, () => {
    console.log("Server running on port 3002");
});
