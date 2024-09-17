import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../app/api/apiSlice";
import { combineReducers } from "redux";
import { setupListeners } from "@reduxjs/toolkit/query";

// Combine reducers
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  // Other reducers can be added here
});

// Store configuration
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production", // Enable devTools only in development
});

// Enable automatic cache refetching
setupListeners(store.dispatch);

export default store;
