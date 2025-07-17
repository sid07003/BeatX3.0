import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentTrack,
  playMusic,
  showPlayer,
} from "../features/nowPlaying/nowPlayingSlice";
import "../CSS/Search.scss";

export default function Search() {
  const [allSongs, setAllSongs] = useState([]);
  const [recentlySearchedSongs, setRecentlySearchedSongs] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSearchEmpty, setIsSearchEmpty] = useState(true);
  const [isDataFound, setIsDataFound] = useState(true);
  const [searchedData, setSearchedData] = useState([]);
  const [cross, setCross] = useState(false);

  const isPlayerVisible = useSelector(
    (state) => state.nowPlaying.isPlayerVisible
  );

  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://localhost:3001/searchData", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.recentlySearchedSongs.length > 0) {
          setIsSearchEmpty(false);
        }
        setAllSongs(data.allSongs || []);
        setRecentlySearchedSongs(data.recentlySearchedSongs);
      })
      .catch(console.error);
  }, [recentlySearchedSongs]);

  const read_substring = (event) => {
    const subString = event.target.value.toLowerCase().replace(/\s/g, "");
    setCross(true);

    if (subString.length === 0) {
      setIsTyping(false);
      setSearchedData([]);
      return;
    }

    const filtered = allSongs.filter((song) =>
      song.name.toLowerCase().replace(/\s/g, "").includes(subString)
    );

    setSearchedData(filtered);
    setIsTyping(true);
    setIsDataFound(filtered.length > 0);
  };

  const playSong = (song) => {
    fetch("http://localhost:3001/setCurrentlyPlayingMusicAndRecentlySearched", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ song }),
    })
      .then((res) => res.json())
      .then(() => {
        dispatch(setCurrentTrack(song));
        dispatch(showPlayer());
        dispatch(playMusic());
      })
      .catch(console.error);
  };

  const backToSearch = () => {
    const searchbar = document.querySelector("#search_bar");
    if (searchbar) searchbar.value = "";
    setIsTyping(false);
    setCross(false);
  };

  const renderSongRow = (song) => (
    <div id="songs" key={song._id}>
      <div id="blank" onClick={() => playSong(song)}>
        <img
          src={song.imagePath}
          alt={song.name}
          style={{
            height: "50px",
            width: "50px",
            borderRadius: "5px",
          }}
        />
      </div>

      <div id="body_name" onClick={() => playSong(song)}>
        <div>{song.name}</div>
      </div>

      <div id="body_duration" onClick={() => playSong(song)}>
        {song.duration}
      </div>
    </div>
  );

  return (
    <div
      id="search"
      style={
        isPlayerVisible
          ? { height: "calc(100vh  - 70px)" }
          : { height: "100vh" }
      }
    >
      <div id="search_div" style={{ position: "relative" }}>
        <div>
          <input
            type="text"
            className="searchbar"
            placeholder="Search"
            onChange={read_substring}
            id="search_bar"
            style={{ color: "white", paddingRight: "40px" }}
          />
          <div
            id="cross"
            style={cross ? { visibility: "visible" } : { visibility: "hidden" }}
            onClick={backToSearch}
          >
            X
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          height: "50px",
          width: "92%",
        }}
      >
        <div style={{ fontSize: "25px", color: "white" }}>Recent Searches</div>
      </div>

      <div id="playlist1">
        <div id="title">
          <div id="blank"></div>
          <div id="title_name">Name</div>
          <div id="title_duration">Duration</div>
          <div id="title_likes"></div>
        </div>

        {isTyping ? (
          isDataFound ? (
            searchedData.map(renderSongRow)
          ) : (
            <div id="corrections">No Data Found</div>
          )
        ) : isSearchEmpty ? (
          <div id="corrections">No Data Found</div>
        ) : (
          recentlySearchedSongs.map(renderSongRow)
        )}
      </div>
    </div>
  );
}
