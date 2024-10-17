import { baseApi } from "./baseApi";

// Helper function to build query string
const buildQuery = (options) => {
  const {
    search,
    sort,
    page,
    limit,
    fields,
    category,
    brand,
    minPrice,
    maxPrice,
    ...otherFilters
  } = options;

  const queryParams = new URLSearchParams();

  if (search) queryParams.append('search', search);
  if (sort) queryParams.append('sort', sort);
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (fields) queryParams.append('fields', fields);
  
  // Add filter parameters
  if (category) queryParams.append('category', category);
  if (brand) queryParams.append('brand', brand);
  if (minPrice) queryParams.append('price[gte]', minPrice);
  if (maxPrice) queryParams.append('price[lte]', maxPrice);

  // Add any other filters
  Object.entries(otherFilters).forEach(([key, value]) => {
    queryParams.append(key, value);
  });

  return queryParams.toString();
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (options = {}) => ({
        url: `/product?${buildQuery(options)}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: `/product`,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/product/${id}/update`,
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
