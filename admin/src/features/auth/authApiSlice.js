import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./apiSlice"; // Reuse base query and token logic

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "user/",
      providesTags: ["Auth"], // Use Auth tag for cache invalidation
    }),
  }),
});

export const { useGetUserQuery } = authApi;
