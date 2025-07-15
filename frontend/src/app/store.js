import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import albumsReducer from '../features/albums/albumSlice';
import loginPromptReducer from '../features/loginPrompt/loginPromptSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    albums: albumsReducer,
    loginPrompt: loginPromptReducer
  },
});
