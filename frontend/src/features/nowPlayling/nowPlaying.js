import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null,      // the full song object (image, url, name, id, etc.)
  isPlayerVisible: false,  // whether the player bar should show
  isMusicClicked: false    // optional: useful to trigger animation or autoplay
};

const nowPlayingSlice = createSlice({
  name: 'nowPlaying',
  initialState,
  reducers: {
    setNowPlaying: (state, action) => {
      state.currentTrack = action.payload;
      state.isPlayerVisible = true;
      state.isMusicClicked = true;
    },
    clearNowPlaying: (state) => {
      state.currentTrack = null;
      state.isPlayerVisible = false;
      state.isMusicClicked = false;
    },
    togglePlayerVisibility: (state) => {
      state.isPlayerVisible = !state.isPlayerVisible;
    },
    setMusicClicked: (state, action) => {
      state.isMusicClicked = action.payload;
    }
  }
});

export const {
  setNowPlaying,
  clearNowPlaying,
  togglePlayerVisibility,
  setMusicClicked
} = nowPlayingSlice.actions;

export default nowPlayingSlice.reducer;
