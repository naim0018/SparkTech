import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { routeGenerator } from "../utils/routesGenerator";
import { navbarRoute } from "./NavbarRoute";
import ErrorPage from "../Component/ErrorPage/ErrorPage";
import Home from "../Pages/Home";
import AdminDashboard from "../Component/Admin/AdminDashboard/AdminDashboard";
import AdminLayout from "../Layout/AdminLayout/AdminLayout";
import { adminRoute } from "./AdminRoute";
import ProductDetails from "../Component/ProductDetails/ProductDetails";
import Checkout from "../Component/Checkout/Checkout";
import { FaSignInAlt } from "react-icons/fa";
import LogIn from "../Component/SignUpAndLogin/LogIn";


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
            {
                path: 'product/:productId',
                element: <ProductDetails/>
            },
            {
                path: 'checkout',
                element: <Checkout/>
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
            {
                path:'dashboard',
                element:<AdminDashboard/>            
            },
            ...routeGenerator(adminRoute)
        ]
    },
    {
        icon:<FaSignInAlt/>,
        name:'Login',
        path:'login',
        element:<LogIn/>
    },

])
