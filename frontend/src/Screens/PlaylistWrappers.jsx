import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  playMusic,
  showPlayer,
  setQueue,
} from "../features/nowPlaying/nowPlayingSlice";
import "../CSS/PlaylistWrapper.scss";
import { toggleLike } from "../features/likedSongs/likedSongsSlice";

export default function PlaylistWrapper() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const [playlistName, setPlaylistName] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [songs, setSongs] = useState([]);

  const isPlayerVisible = useSelector(
    (state) => state.nowPlaying.isPlayerVisible
  );
  const likedSongs = useSelector((state) => state.likedSongs.likedSongs);

  useEffect(() => {
    let apiUrl = "";
    let fetchOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };

    if (location.pathname === "/likedSongs") {
      apiUrl = `http://localhost:3001/api/likedSongs/details`;
      fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ songIds: likedSongs }),
      };
    } else if (location.pathname.startsWith("/artist/")) {
      apiUrl = `http://localhost:3001/api/artist/${id}`;
    } else if (location.pathname.startsWith("/playlist/")) {
      apiUrl = `http://localhost:3001/api/customPlaylist/${id}`;
    } else if (location.pathname.startsWith("/beatx/")) {
      apiUrl = `http://localhost:3001/api/systemPlaylist/${id}`;
    }

    if (!apiUrl) return;

    fetch(apiUrl, fetchOptions)
      .then((res) => res.json())
      .then((data) => {
        if (location.pathname === "/likedSongs") {
          setPlaylistName("Liked Songs");
          setImagePath("../images/heartImage.jpeg");
          setSongs(data.songs || []);
        } else if (location.pathname.startsWith("/playlist/")) {
          setImagePath("../Images/playlist_icon.jpg");
          setPlaylistName(data.playlistData.name);
          setSongs(data.playlistData.songs);
        } else {
          setPlaylistName(data.name || "My Playlist");
          setImagePath(data.imagePath || "../Images/playlist_icon.jpg");
          setSongs(data.songs || []);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch playlist data", err);
      });
  }, [location, likedSongs]);

  const handlePlaySong = (songs, index) => {
    console.log("songs: ", songs);
    console.log("startIndex: ", index);
    dispatch(setQueue({ songs: songs, startIndex: index }));
    dispatch(showPlayer());
    dispatch(playMusic());
  };

  const handleToggleLike = (songId, e) => {
    e.stopPropagation(); // prevent triggering the play event
    dispatch(toggleLike(songId));
  };

  return (
    <div
      id="Artist"
      style={
        isPlayerVisible
          ? { height: "calc(100vh  - 70px)" }
          : { height: "100vh" }
      }
    >
      <div id="info">
        <div id="container">
          <img src={imagePath} alt={playlistName} id="singer" />
        </div>
        <div id="details">
          <div id="Name">{playlistName}</div>
          <div id="song_info">
            <div>{songs.length} songs</div>
          </div>
          <div id="description3">
            <div
              id="btn1"
              onClick={() => {
                handlePlaySong(songs, 0);
              }}
            >
              <div>
                <i
                  className="fa-solid fa-play"
                  style={{
                    color: "#ffffff",
                    fontSize: "20px",
                    paddingTop: "2px",
                  }}
                ></i>
              </div>
              <div
                style={{ color: "white", fontSize: "20px", marginLeft: "10px" }}
              >
                Play All
              </div>
            </div>
            {location.pathname.startsWith("/playlist/") && (
              <Link to={`/addSongs/${id}`} style={{ textDecoration: "none" }}>
                <div id="btn1" style={{ marginLeft: "10px" }}>
                  <div style={{ color: "white" }}>Add Songs</div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div id="playlist">
        <div id="title">
          <div id="blank"></div>
          <div id="title_name">Name</div>
          <div id="title_duration">Duration</div>
          <div id="title_likes"></div>
        </div>

        {songs.length > 0 ? (
          songs.map((data, index) => (
            <div
              id="body"
              style={{ width: "95%" }}
              key={index}
              onClick={() => {
                handlePlaySong(songs, index);
              }}
            >
              <div id="songs">
                <div id="blank">
                  <img
                    src={data.imagePath}
                    alt={data.name}
                    style={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "5px",
                    }}
                  />
                </div>

                <div id="body_name">
                  <div>{data.name}</div>
                </div>

                <div id="body_duration">{data.duration}</div>
                <div
                  id="title_likes"
                  onClick={(e) => handleToggleLike(data._id, e)}
                >
                  {likedSongs.includes(data._id) ? (
                    <i
                      className="fa-solid fa-heart"
                      style={{ color: "#ffffff" }}
                      onClick={(e) => {
                        handleToggleLike(data._id, e);
                      }}
                    ></i>
                  ) : (
                    <i
                      className="fa-regular fa-heart"
                      style={{ color: "#ffffff" }}
                      onClick={(e) => {
                        handleToggleLike(data._id, e);
                      }}
                    ></i>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", color: "gray" }}>
            <div style={{ paddingTop: "20px" }}>Currently No Song...</div>
          </div>
        )}
      </div>
    </div>
  );
}
