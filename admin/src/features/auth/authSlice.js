import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null, // Persist token across sessions
  
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload); // Save token to localStorage
    },
 
    clearAuth: (state) => {
      state.token = null;
      
      localStorage.removeItem("token"); // Clear token from localStorage
    },
  },
});

export const { setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
