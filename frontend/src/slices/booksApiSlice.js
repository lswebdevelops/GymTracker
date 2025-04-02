import { BOOKS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: BOOKS_URL,
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["Book"] /** > reloads page */,
      keepUnusedDataFor: 5,
    }),
    getBookDetails: builder.query({
      query: (bookId) => ({
        url: `${BOOKS_URL}/${bookId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createBook: builder.mutation({
      query: () => ({
        url: BOOKS_URL,
        method: "POST",
      }),
      invalidatesTags: [
        "Book",
      ] /* stops it from being cashed (always new data loading to the page) */,
    }),
    updateBook: builder.mutation({
      query: (data) => ({
        url: `${BOOKS_URL}/${data.bookId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Book"] /**cleans cash for later reload */,
    }),
    uploadBookImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    deleteBook: builder.mutation({
      query: (bookId) => ({
        url: `${BOOKS_URL}/${bookId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${BOOKS_URL}/${data.bookId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Book"],
    }),
    getTopBooks: builder.query({
      query: () => ({
        url: `${BOOKS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookDetailsQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useUploadBookImageMutation,
  useDeleteBookMutation,
  useCreateReviewMutation,
  useGetTopBooksQuery,
} = booksApiSlice;
