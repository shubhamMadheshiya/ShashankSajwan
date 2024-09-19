// src/store/messageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    message: null,
    severity: null, // "success", "error", "warning", "info"
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    clearMessage: (state) => {
      state.message = null;
      state.severity = null;
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;
