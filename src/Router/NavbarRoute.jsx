
import About from "../Component/About/About";
import BestSellers from "../Component/BestSellers/BestSellers";
import Shop from "../Pages/Shop";

export const navbarRoute = [
    
    {
        name:'Shop',
        path:'shop',
        element:<Shop/>
    },
    {
        name:'Best Sellers',
        path:'shop/best-sellers',
        element:<BestSellers/> 
    },
    {
        name:"Today's Deals",
        path:'shop/todays-deals',
        element:<Shop/>
    },
    {
        name:'New Arrivals',
        path:'shop/new-arrivals',
        element:<Shop/>
    },
    {
        name:'About',
        path:'about',
        element:<About/>
    },
   
]