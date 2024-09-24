import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:2000/api/v1",
    credentials: "include",
});

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQuery, 
    endpoints: () => ({}), // Keep this empty for base API
});
