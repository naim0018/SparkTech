import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => {
        console.log("orderData", orderData)
        return {
          url: '/order/create-order',
          method: 'POST',
          body: orderData,
        }
      },
      invalidatesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: ['Orders'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/order/${id}/update-order`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: ['Orders'],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}/delete-order`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),
    getAllOrders: builder.query({
      query: () => '/order',
      providesTags: ['Orders'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
} = orderApi;