import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../CSS/PlaylistManager.scss";
import { Link } from "react-router-dom";

export default function PlaylistManager() {
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [playlistData, setPlaylistData] = useState([]);
  const isPlayerVisible = useSelector(
    (state) => state.nowPlaying.isPlayerVisible
  );

  useEffect(() => {
    getPlaylists();
  }, []);

  const addPlaylist = () => {
    setIsCreatingPlaylist(false);
    let name = document.getElementById("create_playlist_form_input").value;
    document.getElementById("create_playlist_form_input").value = "";

    fetch("http://localhost:3001/api/addPlaylist", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name }),
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 404) {
            alert("Playlist with the same name already exists");
          } else {
            alert("Error adding playlist");
          }
        } else {
          setPlaylistData(data.playlistsData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPlaylists = () => {
    fetch("http://localhost:3001/api/getPlaylist", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setPlaylistData(data.playlistsData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const remove_playlist = (name) => {
    fetch("http://localhost:3001/api/removePlaylist", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: name }),
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();
        setPlaylistData(data.playlistsData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      id="myplaylist"
      style={
        isPlayerVisible
          ? { height: "calc(100vh  - 70px)" }
          : { height: "100vh" }
      }
    >
      <div
        id="create_playlist_area"
        style={
          isCreatingPlaylist
            ? { visibility: "visible" }
            : { visibility: "hidden" }
        }
      >
        <div id="create_playlist">
          <div id="create_playlist_heading_area">
            <div id="create_playlist_heading">Create New Playlist</div>
            <div
              id="create_playlist_heading_close"
              onClick={() => {
                setIsCreatingPlaylist(false);
              }}
            >
              X
            </div>
          </div>
          <form id="create_playlist_form">
            <div id="create_playlist_form_heading">Playlist Name</div>
            <input
              type="text"
              placeholder="Enter The Name"
              name="playlist_name"
              id="create_playlist_form_input"
            />
          </form>
          <div
            id="create_playlist_form_create"
            onClick={() => {
              addPlaylist();
            }}
            style={{ paddingTop: "10px" }}
          >
            Create Playlist
          </div>
        </div>
      </div>

      <div id="liked_heading">
        <div id="liked_heading_content">
          <img
            src={"../Images/playlist_icon.jpg"}
            alt="Header Song"
            id="header_image"
          />
        </div>
        <div id="liked_heading_content_right">
          <div id="description1">All Playlists</div>
          <div id="description2">{playlistData.length} Playlists</div>
          <div id="description3">
            <div
              id="btn1"
              onClick={() => {
                setIsCreatingPlaylist(true);
              }}
            >
              <div>
                <i
                  className="fa-solid fa-plus"
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
                Create New Playlist
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="playlist_area">
        <div id="title">
          <div id="blank"></div>
          <div id="playlist_name">Name</div>
          <div id="playlist_length">Length</div>
          <div id="add_to_playlist"></div>
        </div>
        <div id="body" style={{ width: "95%" }}>
          {playlistData.length > 0 ? (
            playlistData.map((element, index) => (
              <div key={index} id="playlists">
                <Link
                  to={`/playlist/${element._id}`}
                  id="blank"
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={"../Images/playlist_icon.jpg"}
                    style={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "10px",
                    }}
                    alt="playlist-icon"
                  />
                </Link>
                <Link
                  to={`/playlist/${element._id}`}
                  id="body_name"
                  style={{ textDecoration: "none" }}
                >
                  {element.name}
                </Link>
                <Link
                  to={`/playlist/${element._id}`}
                  id="body_length"
                  style={{ textDecoration: "none" }}
                >
                  {element.songsId.length} songs
                </Link>
                <div
                  id="add_to_playlist"
                  onClick={() => {
                    remove_playlist(element.name);
                  }}
                >
                  <div id="remove_playlist_btn">Remove Playlist</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", color: "gray" }}>
              <div style={{ paddingTop: "20px" }}>Currently No Playlist...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
