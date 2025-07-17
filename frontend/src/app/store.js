import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import albumsReducer from '../features/albums/albumSlice';
import loginPromptReducer from '../features/loginPrompt/loginPromptSlice';
import nowPlayingReducer from '../features/nowPlaying/nowPlayingSlice';
import likedSongsReducer from '../features/likedSongs/likedSongsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    albums: albumsReducer,
    loginPrompt: loginPromptReducer,
    nowPlaying: nowPlayingReducer,
    likedSongs: likedSongsReducer
  },
});
