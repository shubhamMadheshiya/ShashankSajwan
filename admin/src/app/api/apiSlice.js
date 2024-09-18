import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000";

// Base query with authorization token logic
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; // Centralized token handling
    if (token) {
      headers.set("Authorization", `Bearer ${token}`); // Use Bearer token convention
    }
    return headers;
  },
});

// Creating the API slice with the base query and tags
export const apiSlice = createApi({
  reducerPath: "api", // Reducer path for clarity
  baseQuery,
  tagTypes: ["Auth", "News"], // Tags for cache management
  endpoints: (builder) => ({}), // Define your endpoints later
});

export default apiSlice;
