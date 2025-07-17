import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../CSS/MusicPlayer.scss";
import {
  setCurrentTrack,
  playMusic,
  pauseMusic,
  playNextInQueue,
  playPrevInQueue,
} from "../features/nowPlaying/nowPlayingSlice";
import { toggleLike } from "../features/likedSongs/likedSongsSlice";

export default function MusicPlayer() {
  const dispatch = useDispatch();

  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const likedSongs = useSelector((state) => state.likedSongs.likedSongs);
  const { currentTrack, isMusicPlaying, isPlayerVisible, isUsingQueue } =
    useSelector((state) => state.nowPlaying);

  const playAudio = () => {
    const music = document.getElementById("music");
    music.play();
    dispatch(playMusic());
  };

  const pauseAudio = () => {
    const music = document.getElementById("music");
    music.pause();
    dispatch(pauseMusic());
  };

  const handleTimeUpdate = () => {
    const music = document.getElementById("music");
    setCurrentTime(music.currentTime);
  };

  const handleToggleLike = (songId, e) => {
    e.stopPropagation(); // prevent triggering the play event
    dispatch(toggleLike(songId));
  };

  const handleSeeking = (e) => {
    if (e.type === "click") {
      const music = document.getElementById("music");
      const progress =
        parseFloat(e.nativeEvent.offsetX) /
        parseFloat(e.currentTarget.offsetWidth);
      const durationInSeconds = parseDurationToSeconds(currentTrack.duration);
      setCurrentTime(progress * durationInSeconds);
      music.currentTime = progress * durationInSeconds;
    }
  };

  const parseDurationToSeconds = (duration) => {
    const [minutes, seconds] = duration.split(":").map(parseFloat);
    return minutes * 60 + seconds;
  };

  useEffect(() => {
    const music = document.getElementById("music");

    const handleSongEnd = () => {
      if (isUsingQueue) {
        dispatch(playNextInQueue());
      } else {
        nextSong(currentTrack.index);
      }
    };

    music.addEventListener("timeupdate", handleTimeUpdate);
    music.addEventListener("ended", handleSongEnd);

    return () => {
      music.removeEventListener("timeupdate", handleTimeUpdate);
      music.removeEventListener("ended", handleSongEnd);
    };
  }, [currentTrack, isUsingQueue]); // important: add dependencies

  useEffect(() => {
    if (isMusicPlaying) {
      playAudio();
    }
  }, [currentTrack]);

  const convert_current_time = (currentTime) => {
    const minutes = Math.floor(currentTime / 60);
    let seconds = Math.floor(currentTime % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    const duration = `${minutes}:${seconds}`;
    return duration;
  };

  const handleVolumeChange = (e) => {
    const music = document.getElementById("music");
    const volumeLevel = parseFloat(e.target.value) / 100;
    setVolume(e.target.value);
    music.volume = volumeLevel;
  };

  const nextSong = async (index) => {
    console.log("IsUsingQueue: ", isUsingQueue);
    if (isUsingQueue) {
      dispatch(playNextInQueue());
    } else {
      try {
        const res = await fetch(`http://localhost:3001/api/next/${index}`);
        const data = await res.json();
        dispatch(setCurrentTrack(data));
        dispatch(playMusic());
      } catch (error) {
        console.error("Error fetching next song:", error);
      }
    }
  };

  const PrevSong = async (index) => {
    console.log("IsUsingQueue: ", isUsingQueue);
    if (isUsingQueue) {
      dispatch(playPrevInQueue());
    } else {
      try {
        const res = await fetch(`http://localhost:3001/api/prev/${index}`);
        const data = await res.json();
        dispatch(setCurrentTrack(data));
        dispatch(playMusic());
      } catch (error) {
        console.error("Error fetching previous song:", error);
      }
    }
  };

  return (
    <div
      id="music_player"
      style={
        isPlayerVisible ? { visibility: "visible" } : { visibility: "hidden" }
      }
    >
      <audio
        controls
        src={currentTrack.audioPath}
        type="audio/mp3"
        id="music"
      ></audio>
      <div id="left_part">
        <div>
          <img src={currentTrack.imagePath} alt={currentTrack.name}></img>
        </div>
        <div
          style={{
            color: "white",
            overflow: "hidden",
            width: "200px",
            height: "55px",
          }}
        >
          <p
            style={{
              height: "30px",
              fontSize: "20px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "left",
            }}
          >
            {currentTrack.name}
          </p>

          <p
            style={{
              opacity: "50%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginTop: "-20px",
              textAlign: "left",
            }}
          >
            {currentTrack.artists.join(", ")}
          </p>
        </div>
        <div id="likes" style={{ cursor: "pointer" }}>
          {likedSongs.includes(currentTrack._id) ? (
            <i
              className="fa-solid fa-heart"
              style={{ color: "#ffffff" }}
              onClick={(e) => {
                handleToggleLike(currentTrack._id, e);
              }}
            ></i>
          ) : (
            <i
              className="fa-regular fa-heart"
              style={{ color: "#ffffff" }}
              onClick={(e) => {
                handleToggleLike(currentTrack._id, e);
              }}
            ></i>
          )}
        </div>
      </div>
      <div id="current_time">{convert_current_time(currentTime)}</div>
      <div id="middle_part">
        <div id="music_controllers">
          <div>
            <i
              className="fa-solid fa-backward"
              style={{ color: "#ffffff", cursor: "pointer" }}
              onClick={() => {
                PrevSong(currentTrack.index);
              }}
            ></i>
          </div>
          <div>
            {!isMusicPlaying ? (
              <i
                className="fa-solid fa-play"
                style={{ color: "#ffffff", cursor: "pointer" }}
                onClick={playAudio}
              ></i>
            ) : (
              <i
                className="fa-solid fa-pause"
                style={{ color: "#ffffff", cursor: "pointer" }}
                onClick={pauseAudio}
              ></i>
            )}
          </div>
          <div>
            <i
              className="fa-solid fa-forward"
              style={{ color: "#ffffff", cursor: "pointer" }}
              onClick={() => {
                nextSong(currentTrack.index);
              }}
            ></i>
          </div>
        </div>

        <div
          id="music_progress"
          style={{
            width: "70%",
            backgroundColor: "gray",
            height: "5px",
            cursor: "pointer",
          }}
          onClick={handleSeeking}
        >
          <div
            style={{
              width: `${
                (currentTime / parseDurationToSeconds(currentTrack.duration)) *
                100
              }%`,
              height: "100%",
              backgroundColor: "blue",
              borderRadius: "10px",
            }}
          ></div>
        </div>
      </div>
      <div id="duration">{currentTrack.duration}</div>
      <div>
        <div id="sound_controller">
          <div>
            <i
              className="fa-solid fa-volume-high"
              style={{ color: "#ffffff", cursor: "pointer" }}
            ></i>
          </div>
          <div style={{ marginTop: "2px" }}>
            <input
              type="range"
              max="100"
              style={{ width: "100px", cursor: "pointer" }}
              id="sound_progress"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
