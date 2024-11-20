import About from "../Component/About/About";
// import BestSellers from "../Component/BestSellers/BestSellers";
import Shop from "../Pages/Shop";
import NewArrivals from "../Component/NewArrivals/NewArrivals";
import BestDeals from "../Component/BestDeals/BestDeals";
export const navbarRoute = [
    
    {
        name:'Shop',
        path:'shop',
        element:<Shop/>
    },
    // {
    //     name:'Best Sellers',
    //     path:'shop/best-sellers',
    //     element:<BestSellers/> 
    // },
    {
        name:"Best Deals",
        path:'shop/best-deals',
        element:<BestDeals/>
    },
    {
        name:'New Arrivals',
        path:'shop/new-arrivals',
        element:<NewArrivals/>
    },
    {
        name:'About',
        path:'about',
        element:<About/>
    },
   
]