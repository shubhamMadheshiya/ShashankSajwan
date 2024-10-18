import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "../app/api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import messageReducer from "../features/messageSlice"

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  // Add other reducers here if needed
});

// Store configuration
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.REACT_APP_NODE_ENV !== "production", // Enable Redux DevTools in development mode only
});

// Enable automatic cache refetching, invalidations, etc.
setupListeners(store.dispatch);

export default store;
