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
          ? [...result.data.map(({ id }) => ({ type: "News", id })), "News"]
          : ["News"],
    }),

    addNews: builder.mutation({
      query: (formData) => ({
        url: "/news",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["News"],
    }),

    editNews: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `/news/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "News", id }],
    }),

    deleteNews: builder.mutation({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "News", id }],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useAddNewsMutation,
  useEditNewsMutation,
  useDeleteNewsMutation,
} = newsApi;
