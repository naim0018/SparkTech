import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/user/create-user',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),
    getAllUsers: builder.query({
      query: () => '/user/all-users',
      providesTags: ['Users'],
    }),
    getUserById: builder.query({
      query: (id) => `/user/${id}`,
      providesTags: ['Users'],
    }),
    getUserByEmail: builder.query({
      query: (email) => `/user/${email}`,
      providesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/user/${id}`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
