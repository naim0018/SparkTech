import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"



const Mainlayout = () => {
  return (
    <div className="">
      <Navbar/>
      {/* <Home/> */}
      <Outlet/>
      
    </div>
  )
}

export default Mainlayout