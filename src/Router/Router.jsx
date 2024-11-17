import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { routeGenerator } from "../utils/routesGenerator";
import { navbarRoute } from "./NavbarRoute";
import ErrorPage from "../Component/ErrorPage/ErrorPage";
import Home from "../Pages/Home";
import AdminDashboard from "../Component/Admin/AdminDashboard/AdminDashboard";
import { adminRoute } from "./AdminRoute";
import ProductDetails from "../Component/ProductDetails/ProductDetails";
import Checkout from "../Component/Checkout/Checkout";
import { FaSignInAlt } from "react-icons/fa";
import LogIn from "../Component/SignUpAndLogin/LogIn";
import { userRoute } from "./UserRoute";
import Dashboard from "../Layout/DashboardLayout/DashboardLayout";
import ProtectedRoute from "../Layout/ProtectedRoute";
import Unauthorized from "../Component/ErrorPage/Unauthorized";

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
        path:'admin/dashboard',
        element: (
            <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard/>
            </ProtectedRoute>
        ),
        children:[
            {
                index: true,
                element: <AdminDashboard/>
            },
            ...routeGenerator(adminRoute)
        ]
    },
    {
        path:'user/dashboard',
        element: (
            <ProtectedRoute allowedRoles={['user']}>
                <Dashboard/>
            </ProtectedRoute>
        ),
        children:[
            ...routeGenerator(userRoute)
        ]
    },
    {
        icon:<FaSignInAlt/>,
        name:'Login',
        path:'login',
        element:<LogIn/>
    },
    {
        path: 'unauthorized',
        element: <Unauthorized/>
    }
])
