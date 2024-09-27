import { BiPackage, BiListUl, BiCart, BiGroup, BiCog } from "react-icons/bi";
import AddProduct from "../Component/Admin/AdminDashboard/AddProduct";

export const adminRoute = [
    {
        icon:<BiPackage/>,
        name:'Add Product',
        path:'add-product',
        element:<AddProduct/>
    },
    {
        icon:<BiListUl/>,
        name:'Products',
        path:'products',
        // element:<Products/>
    },
    {
        icon:<BiCart/>,  
        name:'Orders',
        path:'orders',
        // element:<Orders/>
    },
    {
        icon:<BiGroup/>,
        name:'Customers',
        path:'customers',
        // element:<Customers/>
    },
    {
        icon:<BiCog/>,
        name:'Settings',
        path:'settings',
        // element:<Settings/>
    }
]
