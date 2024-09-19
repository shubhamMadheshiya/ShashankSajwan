// authApiSlice.js file
import { apiSlice } from "../../app/api/apiSlice"; // Import the base API slice

// Inject endpoints specific to authentication
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/user", // API endpoint for getting the user
      providesTags: ["Auth"], // Optional caching tag
    }),
  }),
  overrideExisting: false, // Ensure we don't override existing endpoints
});

export const { useGetUserQuery } = authApiSlice; // Export the hook
