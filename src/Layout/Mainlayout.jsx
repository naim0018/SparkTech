import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"



const Mainlayout = () => {
  return (
    <div className="">
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Mainlayout