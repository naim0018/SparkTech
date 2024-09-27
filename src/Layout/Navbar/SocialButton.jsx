import { CiSearch } from "react-icons/ci"
import { FaUserCircle } from "react-icons/fa"
import { IoCartOutline } from "react-icons/io5"
import { RiMoonLine } from "react-icons/ri"
import { NavLink } from "react-router-dom"


const SocialButton = () => {
  return (
    <div className=" lg:w-[204px] flex items-center lg:justify-between gap-[2px]">
    <RiMoonLine className="text-xl m-[10px] text-white" />
    <CiSearch className=" lg:hidden m-[10px] text-xl text-white " />
    <NavLink to="/admin">
    <FaUserCircle className="hidden lg:flex text-xl text-white" />
    </NavLink>
    <div className="relative bg-[#333D4C] m-[10px] size-12 flex items-center justify-center rounded-full">
      <p className="bg-[#33b36b] size-6 text-sm rounded-full flex items-center justify-center text-center absolute translate-x-5 -translate-y-4 border-[3px] border-[#222934]">
        3
      </p>
      <IoCartOutline className="text-xl text-white" />
    </div>
  </div>
  )
}

export default SocialButton