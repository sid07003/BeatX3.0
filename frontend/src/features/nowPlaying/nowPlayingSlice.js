import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null,          // Currently playing song object
  isPlayerVisible: false,      // Controls visibility of player UI
  isMusicPlaying: false,       // Indicates play/pause status

  // Playlist mode
  queue: [],                   // For playlist-based playback
  queueIndex: 0,               // Index within the queue

  // Single-song mode
  allSongs: [],                // Fallback: All songs from DB (used only in index-based mode)
  currentIndex: 0,             // Current index in allSongs

  isUsingQueue: false          // true if playing a playlist; false if playing a single random song
};

const nowPlayingSlice = createSlice({
  name: 'nowPlaying',
  initialState,
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
      state.isUsingQueue = false;
    },
    showPlayer: (state) => {
      state.isPlayerVisible = true;
    },
    hidePlayer: (state) => {
      state.isPlayerVisible = false;
    },
    playMusic: (state) => {
      state.isMusicPlaying = true;
    },
    pauseMusic: (state) => {
      state.isMusicPlaying = false;
    },
    clearNowPlaying: (state) => {
      state.currentTrack = null;
      state.isPlayerVisible = false;
      state.isMusicPlaying = false;
      state.queue = [];
      state.queueIndex = 0;
      state.allSongs = [];
      state.currentIndex = 0;
      state.isUsingQueue = false;
    },

    // 🔁 Playlist-based playback
    setQueue: (state, action) => {
      state.queue = action.payload.songs;
      state.queueIndex = action.payload.startIndex || 0;
      state.currentTrack = state.queue[state.queueIndex];
      state.isUsingQueue = true;
    },
    playNextInQueue: (state) => {
      if (state.queue.length > 0) {
        state.queueIndex = (state.queueIndex + 1) % state.queue.length;
        state.currentTrack = state.queue[state.queueIndex];
      }
    },
    playPrevInQueue: (state) => {
      if (state.queue.length > 0) {
        state.queueIndex = (state.queueIndex - 1 + state.queue.length) % state.queue.length;
        state.currentTrack = state.queue[state.queueIndex];
      }
    },
  }
});

export const {
  setCurrentTrack,
  showPlayer,
  hidePlayer,
  playMusic,
  pauseMusic,
  clearNowPlaying,
  setQueue,
  playNextInQueue,
  playPrevInQueue,
} = nowPlayingSlice.actions;

export default nowPlayingSlice.reducer;
