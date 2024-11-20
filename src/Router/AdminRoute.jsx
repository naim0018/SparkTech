import { BiPackage, BiListUl, BiCart, BiGroup } from "react-icons/bi";
import Orders from "../Component/Admin/AdminDashboard/Orders";
import Customers from "../Component/Admin/AdminDashboard/Customers";
import AddProductForm from "../Component/Admin/AdminDashboard/AddProduct";
import Products from "../Component/Admin/AdminDashboard/Products";


export const adminRoute = [
    

    {
        icon:<BiPackage/>,
        name:'Add Product',
        path:'add-product',
        element:<AddProductForm/>
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
