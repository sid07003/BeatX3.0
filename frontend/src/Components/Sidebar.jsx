import React, { useRef, useEffect } from "react";
import "../CSS/Sidebar.scss";
import { useSelector, useDispatch } from "react-redux";
import { showLoginPrompt } from "../features/loginPrompt/loginPromptSlice";
import { setAlbums } from "../features/albums/albumSlice";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const albums = useSelector((state) => state.albums.albums);
  const likedSongs = useSelector((state) => state.likedSongs.likedSongs);
  const likedSongsRef = useRef(likedSongs);

  useEffect(() => {
    likedSongsRef.current = likedSongs;
  }, [likedSongs]);

  useEffect(() => {
    fetch("http://localhost:3001/api/getAlbumData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(setAlbums(result.albums));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (likedSongsRef.current.length > 0) {
        console.log("Syncing liked songs:", likedSongsRef.current);

        fetch("http://localhost:3001/api/likedSongs/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ likedSongs: likedSongsRef.current }),
        });
      }
    }, 5000);

    return () => clearInterval(interval); // clear on unmount
  }, []);

  const handleProtectedClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      dispatch(showLoginPrompt());
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <div style={{ margin: "5px" }}>
          <i
            className="fa-solid fa-music"
            style={{ color: "#ffffff", fontSize: "35px" }}
            id="beatxLogo"
          ></i>
        </div>
        <div
          className="homeText"
          style={{ color: "#ffffff", fontSize: "25px" }}
        >
          <b>
            <i>BEATX</i>
          </b>
        </div>
      </div>

      <Link to="/" className="home">
        <div style={{ margin: "10px" }}>
          <i className="fa-solid fa-house" style={{ color: "#ffffff" }}></i>
        </div>
        <div className="homeText">Home</div>
      </Link>

      <Link
        to={isLoggedIn ? "/search" : "#"}
        className="search"
        onClick={!isLoggedIn ? handleProtectedClick : null}
      >
        <div style={{ margin: "10px" }}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={{ color: "#ffffff" }}
          ></i>
        </div>
        <div style={{ margin: "5px", color: "white" }}>Search</div>
      </Link>

      <div className="library">
        <div className="heading">
          <div style={{ margin: "5px" }}>
            <i className="fa-solid fa-bars" style={{ color: "#ffffff" }}></i>
          </div>
          <div style={{ margin: "10px" }}>Library</div>
        </div>

        <ul className="content">
          <li className="liked">
            <Link
              to={isLoggedIn ? "/likedSongs" : "#"}
              onClick={!isLoggedIn ? handleProtectedClick : null}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <div style={{ margin: "5px" }}>
                <i
                  className="fa-solid fa-heart"
                  style={{ color: "#ffffff" }}
                ></i>
              </div>
              <div style={{ margin: "5px" }}>Liked Songs</div>
            </Link>
          </li>

          <li className="liked">
            <Link
              to={isLoggedIn ? "/myPlaylists" : "#"}
              onClick={!isLoggedIn ? handleProtectedClick : null}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <div style={{ margin: "5px" }}>
                <i
                  className="fa-solid fa-bars"
                  style={{ color: "#ffffff" }}
                ></i>
              </div>
              <div
                style={{
                  margin: "5px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                My Playlists
              </div>
            </Link>
          </li>

          {albums.map((item, index) => (
            <li className="liked" key={index}>
              <Link
                to={isLoggedIn ? `/beatx/${item._id}` : "#"}
                onClick={!isLoggedIn ? handleProtectedClick : null}
                style={{
                  margin: "5px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
