import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  albums: [],
};

const albumsSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    setAlbums: (state, action) => {
      state.albums = action.payload;
    },
    clearAlbums: (state) => {
      state.albums = [];
    },
  },
});

export const { setAlbums, clearAlbums } = albumsSlice.actions;
export default albumsSlice.reducer;
