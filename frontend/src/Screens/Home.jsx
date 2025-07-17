import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../CSS/Home.scss";

import LoginPrompt from "../Components/LoginPrompt";
import {
  setCurrentTrack,
  playMusic,
  showPlayer,
} from "../features/nowPlaying/nowPlayingSlice";
import { showLoginPrompt } from "../features/loginPrompt/loginPromptSlice";
import { login, logout } from "../features/auth/authSlice";
import { setLikedSongs } from "../features/likedSongs/likedSongsSlice";

export default function Home() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const albums = useSelector((state) => state.albums.albums);
  const isPlayerVisible = useSelector(
    (state) => state.nowPlaying.isPlayerVisible
  );

  const [artistPlaylists, setArtistPlaylists] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);

  const getData = () => {
    fetch("http://localhost:3001/api/getBeatxData", {
      method: "GET",
      headers: { "content-type": "application/json" },
      withCredentials: true,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        setArtistPlaylists(result.artistPlaylists);
        setTrendingSongs(result.trendingSongs);

        if (
          result.lastPlayedMusic &&
          Object.keys(result.lastPlayedMusic).length > 0
        ) {
          dispatch(setCurrentTrack(result.lastPlayedMusic));
          dispatch(showPlayer());
        }

        if (result.isAuthenticated) {
          dispatch(login());
        } else {
          dispatch(logout());
        }

        if (Array.isArray(result.likedSongs)) {
          dispatch(setLikedSongs(result.likedSongs));
        }
      })
      .catch(console.log);
  };

  useEffect(() => {
    getData();
  }, []);

  const scroll = (id, direction) => {
    const element = document.querySelector(`#${id}`);
    element.scrollLeft +=
      direction === "right" ? element.offsetWidth : -element.offsetWidth;
  };

  const logoutUser = () => {
    fetch("http://localhost:3001/api/users/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {dispatch(logout())});
  };

  const handlePlaySong = (song) => {
    dispatch(setCurrentTrack(song));
    dispatch(showPlayer());
    dispatch(playMusic());
  };

  return (
    <div
      id="home"
      style={{ height: isPlayerVisible ? "calc(100vh - 70px)" : "100vh" }}
    >
      <LoginPrompt />

      <nav>
        <div>
          <Link to="/search">
            <input
              type="text"
              className="searchbar"
              placeholder="Search"
              onMouseEnter={() => {
                let searchbar = document.querySelector(".searchbar");
                searchbar.style.border = "2px solid rgb(56, 221, 78)";
              }}
              onMouseLeave={() => {
                let searchbar = document.querySelector(".searchbar");
                searchbar.style.border = "2px solid white";
              }}
            />
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="profile" style={{ cursor: "pointer" }}>
            <i
              className="fa-solid fa-right-from-bracket"
              style={{ color: "#fff", fontSize: "25px", padding: "10px" }}
              onClick={() => logoutUser()}
            ></i>
          </div>
        ) : (
          <Link to="/login" className="profile">
            <i
              className="fa-solid fa-user"
              style={{ color: "#fff", fontSize: "25px", padding: "10px" }}
            ></i>
          </Link>
        )}
      </nav>

      {/* --------------------- Popular Artists --------------------- */}
      <div id="popularArtists">
        <div id="popular">Popular Artists</div>
        <div id="sideScroll">
          <div id="leftscroll" onClick={() => scroll("artists", "left")}>
            <i
              className="fa-solid fa-angles-left"
              style={{ color: "#ffffff", fontSize: "35px" }}
            ></i>
          </div>
          <div id="artists">
            {artistPlaylists.map((el, idx) => (
              <Link
                to={`/artist/${el._id}`}
                style={{ textDecoration: "none" }}
                key={idx}
              >
                <div style={{ cursor: "pointer" }}>
                  <img src={el.imagePath} alt={el.name} id="artist" />
                  <p style={{ paddingTop: "5px" }}>{el.name}</p>
                </div>
              </Link>
            ))}
          </div>
          <div id="rightscroll" onClick={() => scroll("artists", "right")}>
            <i
              className="fa-solid fa-angles-right"
              style={{ color: "#ffffff", fontSize: "35px" }}
            ></i>
          </div>
        </div>
      </div>

      {/* --------------------- Trending Songs --------------------- */}
      <div id="popularArtists">
        <div id="popular">Trending Songs</div>
        <div id="sideScroll">
          <div id="leftscroll" onClick={() => scroll("trendingSongs", "left")}>
            <i
              className="fa-solid fa-angles-left"
              style={{ color: "#ffffff", fontSize: "35px" }}
            ></i>
          </div>

          <div id="trendingSongs">
            {trendingSongs.map((el, idx) => (
              <div
                key={idx}
                style={{ textDecoration: "none" }}
                onClick={() =>
                  isLoggedIn ? handlePlaySong(el) : dispatch(showLoginPrompt())
                }
              >
                <div style={{ cursor: "pointer" }}>
                  <img src={el.imagePath} alt={el.name} id="trending" />
                  <p style={{ paddingTop: "5px" }}>{el.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            id="rightscroll"
            onClick={() => scroll("trendingSongs", "right")}
          >
            <i
              className="fa-solid fa-angles-right"
              style={{ color: "#ffffff", fontSize: "35px" }}
            ></i>
          </div>
        </div>
      </div>

      {/* --------------------- Popular Playlists --------------------- */}
      <div id="albums">
        <div id="popular">Popular Playlists</div>
        <div id="album_playlists">
          {albums.map((el, idx) => (
            <Link
              to={`/beatx/${el._id}`}
              style={{ textDecoration: "none", cursor: "pointer" }}
              id="album_playlist"
              key={idx}
            >
              <img src={el.imagePath} alt={el.name} id="playlist_image" />
              <p style={{ paddingTop: "5px" }}>{el.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
