import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    // baseUrl: "https://spark-tech-server.vercel.app/api/v1",
    baseUrl: "http://localhost:2000/api/v1",
    credentials: "include",
});

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQuery, 
    tagTypes: ['Product', 'Orders', 'Customer', 'Category', 'Subcategory', 'Brand'],
    
    endpoints: () => ({}),
});
