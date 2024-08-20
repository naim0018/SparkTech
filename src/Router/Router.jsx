import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { routeGenerator } from "../utils/routesGenerator";
import { navbarRoute } from "./NavbarRoute";


export const router = createBrowserRouter([
    {
        path:'/',
        element:<App/>,
        children:routeGenerator(navbarRoute),
    },
])

