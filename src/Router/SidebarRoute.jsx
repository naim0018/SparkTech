// import Home from "../Pages/Home";

import { FaComputer, FaHeadphonesSimple } from "react-icons/fa6";
import { SlScreenSmartphone } from "react-icons/sl";
import Shop from "../Pages/Shop";


export const sidebarRoute = [
    {
        icon: <FaComputer />,
        name:'Computer & Accessories',
        path:'shop/computer-accessories',
        element:<Shop/> 
    },
    {
        icon: <SlScreenSmartphone />,
        name:'Smartphones & Tablets',
        path:'shop/smartphones-tablets',
        element:<Shop/> 
    },
    {
        icon: <FaHeadphonesSimple />,
        name:'Headphones',
        path:'shop/headphones',
        element:<Shop/> 
    },
]

