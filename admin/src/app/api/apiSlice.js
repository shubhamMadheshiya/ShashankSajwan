import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000";

// Basic baseQuery setup without any authorization
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

// Creating the API slice with the base query and defining the tags
export const apiSlice = createApi({
  baseQuery, // Using baseQuery directly since no authorization is needed
  tagTypes: ["Auth", "News"], // Tags for automatic cache invalidation
  endpoints: (builder) => ({}), // Placeholder for API endpoints
});

export default apiSlice;
