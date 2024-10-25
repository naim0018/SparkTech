import { baseApi } from "./baseApi";

// Helper function to build query string
const buildQuery = (options) => {
  const queryParams = new URLSearchParams();
  
  // Handle search
  if (options.search) {
    queryParams.append('search', options.search);
  }

  // Handle filters
  if (options.category && options.category !== 'all') {
    queryParams.append('category', options.category);
  }
  if (options.subcategory && options.subcategory !== 'all') {
    queryParams.append('subcategory', options.subcategory);
  }
  if (options.brand && options.brand !== 'all') {
    queryParams.append('brand', options.brand);
  }
  if (options.stockStatus && options.stockStatus !== 'all') {
    queryParams.append('stockStatus', options.stockStatus);
  }

  // Handle price range
  if (options.priceRange && Array.isArray(options.priceRange)) {
    queryParams.append('minPrice', options.priceRange[0]);
    queryParams.append('maxPrice', options.priceRange[1]);
  }

  // Handle sorting
  if (options.sort) queryParams.append('sort', options.sort);

  // Handle pagination
  if (options.page) queryParams.append('page', options.page);
  if (options.limit) queryParams.append('limit', options.limit);

  // Handle fields selection
  if (options.fields) queryParams.append('fields', options.fields);

  return queryParams.toString();
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (options = {}) => {
        console.log('Query options:', options);
        const queryString = buildQuery(options);
        return {
          url: `/product?${queryString}`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        // Assuming the backend returns { data: [...], meta: {...} }
        return {
          products: response.data,
          pagination: response.meta,
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
