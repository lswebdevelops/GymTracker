import { TRAININGTYPES_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const TrainingTypesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTrainingTypes: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: TRAININGTYPES_URL,
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["TrainingType"] /** > reloads page */,
      keepUnusedDataFor: 5,
    }),
    getTrainingTypeDetails: builder.query({
      query: (TrainingTypeId) => ({
        url: `${TRAININGTYPES_URL}/${TrainingTypeId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createTrainingType: builder.mutation({
      query: () => ({
        url: TRAININGTYPES_URL,
        method: "POST",
      }),
      invalidatesTags: [
        "TrainingType",
      ] /* stops it from being cashed (always new data loading to the page) */,
    }),
    updateTrainingType: builder.mutation({
      query: (data) => ({
        url: `${TRAININGTYPES_URL}/${data.TrainingTypeId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["TrainingType"] /**cleans cash for later reload */,
    }),
    uploadTrainingTypeImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    deleteTrainingType: builder.mutation({
      query: (TrainingTypeId) => ({
        url: `${TRAININGTYPES_URL}/${TrainingTypeId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${TRAININGTYPES_URL}/${data.TrainingTypeId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TrainingType"],
    }),
    getTopTrainingTypes: builder.query({
      query: () => ({
        url: `${TRAININGTYPES_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetTrainingTypesQuery,
  useGetTrainingTypeDetailsQuery,
  useCreateTrainingTypeMutation,
  useUpdateTrainingTypeMutation,
  useUploadTrainingTypeImageMutation,
  useDeleteTrainingTypeMutation,
  useCreateReviewMutation,
  useGetTopTrainingTypesQuery,
} = TrainingTypesApiSlice;
