import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { routeGenerator } from "../utils/routesGenerator";
import { navbarRoute } from "./NavbarRoute";
import ErrorPage from "../Component/ErrorPage/ErrorPage";
import Home from "../Pages/Home";
import AdminDashboard from "../Component/Admin/AdminDashboard/AdminDashboard";
import AdminLayout from "../Layout/AdminLayout/AdminLayout";
import { adminRoute } from "./AdminRoute";


export const router = createBrowserRouter([
    {
        path:'/',
        element:<App/>,
        errorElement:<ErrorPage/>,
        children:[
            {
                index:true,
                element:<Home/>
            },
            ...routeGenerator(navbarRoute)
        ],
    },
    {
        path:'/admin',
        element:<AdminLayout/>,
        children:[
            {
                index:true,
                element:<AdminDashboard/>            
            },
            ...routeGenerator(adminRoute)

        ]
    }
])

