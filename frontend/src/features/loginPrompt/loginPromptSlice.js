import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  visible: false,
};

const loginPromptSlice = createSlice({
  name: 'loginPrompt',
  initialState,
  reducers: {
    showLoginPrompt: (state) => {
      state.visible = true;
    },
    hideLoginPrompt: (state) => {
      state.visible = false;
    },
  },
});

export const { showLoginPrompt, hideLoginPrompt } = loginPromptSlice.actions;
export default loginPromptSlice.reducer;
