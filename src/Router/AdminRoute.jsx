import { BiPackage, BiListUl, BiCart, BiGroup } from "react-icons/bi";
import Orders from "../Component/Admin/AdminDashboard/Orders/index";
import Customers from "../Component/Admin/AdminDashboard/Customers";
import Products from "../Component/Admin/AdminDashboard/Products";
import AddProduct01 from "../Component/Admin/AdminDashboard/AddProduct/AddProduct01";


export const adminRoute = [
    

    {
        icon:<BiPackage/>,
        name:'Add Product',
        path:'add-product',
        element:<AddProduct01/>
    },
    {
        icon:<BiListUl/>,
        name:'Products',
        path:'products',
        element:<Products/>
    },
    {
        icon:<BiCart/>,  
        name:'Orders',
        path:'orders',
        element:<Orders/>
    },
    {
        icon:<BiGroup/>,
        name:'Customers',
        path:'customers',
        element:<Customers/>
    },
   
    
]
