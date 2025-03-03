import { baseApi } from "./baseApi";

// Helper function to build query string
const buildQuery = (options) => {
  const queryParams = new URLSearchParams();
  
  if (options.search) {
    queryParams.append('search', options.search.trim());
  }
  if (options.category) {
    queryParams.append('category', options.category);
  }
  if (options.stockStatus) {
    queryParams.append('stockStatus', options.stockStatus);
  }
  if (options.minPrice) {
    queryParams.append('minPrice', options.minPrice);
  }
  if (options.maxPrice) {
    queryParams.append('maxPrice', options.maxPrice);
  }
  if (options.sort) {
    queryParams.append('sort', options.sort);
  }
  if (options.page) {
    queryParams.append('page', options.page);
  }
  if (options.limit) {
    queryParams.append('limit', options.limit);
  }

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
      transformResponse: (response) => {
        return {
          products: response.data,
          pagination: response.meta,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Products', id: _id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
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
      invalidatesTags: ["Product", "Products", "Categories"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}/delete-product`,
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
