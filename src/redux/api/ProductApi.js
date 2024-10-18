import { baseApi } from "./baseApi";

// Helper function to build query string
const buildQuery = (options) => {
  const queryParams = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    if (value !== '' && value !== undefined) {
      if (key === 'tags') {
        // Keep tags as a comma-separated string
        queryParams.append('tags', value);
      } else {
        queryParams.append(key, value);
      }
    }
  });

  return queryParams.toString();
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (options = {}) => {
        const queryString = buildQuery(options);
        return {
          url: `/product?${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: `/product/add-product`,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/product/${id}/update-product`,
        method: "PATCH",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),

});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
