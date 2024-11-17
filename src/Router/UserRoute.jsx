import { FaUser, FaShoppingBag, FaHeart } from 'react-icons/fa';
import Profile from '../Component/Admin/UserDashboard/Profile';
import Orders from '../Component/Admin/UserDashboard/Orders';
import Wishlist from '../Component/Admin/UserDashboard/Wishlist';



export const userRoute = [
    {
        icon: <FaUser/>,
        name: 'Profile',
        path: 'profile',
        element: <Profile/>
    },
    {
        icon: <FaShoppingBag/>,
        name: 'Orders', 
        path: 'orders',
        element: <Orders/>
    },
    {
        icon: <FaHeart/>,
        name: 'Wishlist',
        path: 'wishlist',
        element: <Wishlist/>
    },
    
];
