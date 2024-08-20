import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Home from "../Pages/Home"


const Mainlayout = () => {
  return (
    <div>
        <Navbar/>
        <Home/>
        <Outlet/>
    </div>
  )
}

export default Mainlayout