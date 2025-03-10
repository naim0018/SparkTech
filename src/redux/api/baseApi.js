import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://spark-tech-server.vercel.app/api/v1",
    // baseUrl: "http://localhost:2000/api/v1",
    _credentials: "include",
    get credentials() {
        return this._credentials;
    },
    set credentials(value) {
        this._credentials = value;
    },
});

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQuery, 
    tagTypes: ['Product', 'Orders', 'Customer', 'Category', 'Subcategory', 'Brand', 'Categories'],
    endpoints: () => ({}),
});
