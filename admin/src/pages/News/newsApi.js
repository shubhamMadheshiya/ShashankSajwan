import { apiSlice } from "../../app/api/apiSlice";

export const newsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query({
      query: ({ page = 1, limit = 12, month, year }) => {
        let query = `/news?page=${page}&limit=${limit}`;
        if (month) query += `&month=${month}`;
        if (year) query += `&year=${year}`;
        return query;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "News", id: _id })),
              "News",
            ]
          : ["News"],
    }),

    addNews: builder.mutation({
      query: (formData) => ({
        url: "/news",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["News"], // Invalidate all news data
    }),

    editNews: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/news/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "News", id }], // Invalidate specific news item
    }),

    deleteNews: builder.mutation({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "News", id }], // Invalidate specific news item
    }),
  }),
});

export const {
  useGetNewsQuery,
  useAddNewsMutation,
  useEditNewsMutation,
  useDeleteNewsMutation,
} = newsApi;
