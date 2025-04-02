import { POEMS_URL } from "../constants"; 
import { apiSlice } from "./apiSlice";

export const poemsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPoems: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: POEMS_URL,
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["Poem"],
      keepUnusedDataFor: 5,
    }),
    getPoemDetails: builder.query({
      query: (poemId) => ({
        url: `${POEMS_URL}/${poemId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createPoem: builder.mutation({
      query: (data) => ({
        url: POEMS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Poem"], // Invalidate Poem cache after creating
    }),
    updatePoem: builder.mutation({
      query: ({ id, title, author, content }) => ({
        url: `${POEMS_URL}/${id}`, // Use 'id' directly here
        method: "PUT",
        body: { title, author, content },
      }),
      invalidatesTags: ["Poem"], // Invalidate Poem cache after updating
    }),
    
    deletePoem: builder.mutation({
      query: (poemId) => ({
        url: `${POEMS_URL}/${poemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Poem"], // Invalidate Poem cache after deleting
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${POEMS_URL}/${data.poemId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Poem"], // Invalidate Poem cache after adding review
    }),
    getTopPoems: builder.query({
      query: () => ({
        url: `${POEMS_URL}/top`, // Assuming the API path for top poems is /poems/top
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetPoemsQuery,
  useGetPoemDetailsQuery,
  useCreatePoemMutation,
  useUpdatePoemMutation,
  useDeletePoemMutation,
  useCreateReviewMutation,
  useGetTopPoemsQuery,
} = poemsApiSlice;
