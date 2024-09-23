
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
        element:<Shop/> 
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
    }
]