import { baseApi } from './baseApi';

const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: (queryParams) => ({
                url: '/product',
                method: 'GET',
                params: queryParams,
            }),
            providesTags: ['Product'],
            transformResponse: (response, meta, arg) => {
                return {
                    products: response,
                    meta: {
                        page: arg.page || 1,
                        limit: arg.limit || 10,
                        total: response.length,
                        totalPage: Math.ceil(response.length / (arg.limit || 10)),
                    },
                };
            },
        }),
        getProductById: builder.query({
            query: (id) => ({
                url: `/product/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),
        addProduct: builder.mutation({
            query: (product) => ({
                url: '/product',
                method: 'POST',
                body: product,
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...product }) => ({
                url: `/product/${id}`,
                method: 'PUT',
                body: product,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/product/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Product', id }],
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

export default productApi.reducer;
