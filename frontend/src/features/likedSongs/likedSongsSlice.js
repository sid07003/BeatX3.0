// likedSongsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  likedSongs: []
};

const likedSongsSlice = createSlice({
  name: "likedSongs",
  initialState,
  reducers: {
    setLikedSongs: (state, action) => {
      state.likedSongs = action.payload;
    },
    toggleLike: (state, action) => {
      const songId = action.payload;
      if (state.likedSongs.includes(songId)) {
        state.likedSongs = state.likedSongs.filter(id => id !== songId);
      } else {
        state.likedSongs.push(songId);
      }
    }
  }
});

export const { setLikedSongs, toggleLike } = likedSongsSlice.actions;
export default likedSongsSlice.reducer;
