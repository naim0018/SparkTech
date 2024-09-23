
import { baseApi } from "../api/baseApi";

const productApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getProduct : builder.query({
            query:()=>{                 
                return{
                    url:`product/`,
                    method:'GET'
                }                
            }
        })
    })
})

export const {useGetProductQuery} = productApi