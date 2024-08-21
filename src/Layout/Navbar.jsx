import { CiSearch } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { PiPercentBold } from "react-icons/pi";
import { RiMoonLine } from "react-icons/ri";
import { navbarGenerator } from "../utils/navbarGenerator";
import { navbarRoute } from "../Router/NavbarRoute";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { TfiAngleRight } from "react-icons/tfi";
import { MdGridView } from "react-icons/md";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navbar = navbarGenerator(navbarRoute);

  const navItems = navbar.map((item) => {
    return (
      <NavLink key={item.key} to={`/${item.label}`} className="">
        <p className="px-6 py-2 border border-gray-500 md:border-none mb-2 md:mb-0 text-base font-medium text-white/80 ">
          {item.key}
        </p>
      </NavLink>
    );
  });

  return (
    <div className="bg-[#222934] relative">
      {/* Logo */}
      <div className="w-[1296px] mx-auto flex flex-col md:flex-row items-center justify-between  p-5">
        <div className="flex items-center justify-between w-full md:w-fit pb-2 mr-[179px]">
         <NavLink to="/">
         <h5 className="text-white">SparkTech</h5>
         </NavLink>
          <div className=" md:hidden relative z-10">
            <label
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col gap-2 w-8 cursor-pointer"
            >
              <div
                className={`rounded-2xl h-[3px] w-1/2 bg-white duration-200 ease-out ${
                  isOpen
                    ? "rotate-[225deg] origin-right  -translate-x-[12px] -translate-y-[1px]"
                    : ""
                }`}
              ></div>
              <div
                className={`rounded-2xl h-[3px] w-full bg-white duration-200 ease-in ${
                  isOpen ? "-rotate-45" : ""
                }`}
              ></div>
              <div
                className={`rounded-2xl h-[3px] w-1/2 bg-white duration-200 ease-out place-self-end ${
                  isOpen
                    ? "rotate-[225deg] origin-left translate-x-[12px] translate-y-[1px]"
                    : ""
                }`}
              ></div>
            </label>
          </div>
        </div>
        {/* Search Input */}
        <div className="w-[490px] px-5 border border-white rounded-full flex items-center">
          <CiSearch className="text-xl text-white" />
          <input
            type="text"
            placeholder="Search the products"
            className="outline-none py-2 bg-transparent w-full text-white font-normal px-4 placeholder:text-[#6c727f]"
          />
        </div>

        {/* Sale */}
        <div className="flex items-center justify-center gap-2">
          <div className="size-12 bg-[#333D4C] rounded-full flex items-center justify-center">
            <PiPercentBold className="text-[#F55266] text-xl" />
          </div>
          <div>
            <p className="text-xs font-normal text-[#CAD0D9]">
              Only this month
            </p>
            <p className="text-base font-medium text-white">Super Sale 20%</p>
          </div>
        </div>

        {/* Social Button */}
        <div className=" w-[204px] flex items-center justify-between">
          <RiMoonLine className="text-xl text-white" />
          <FaUserCircle className="text-xl text-white" />
          <div className="relative bg-[#333D4C] size-12 flex items-center justify-center rounded-full">
            <p className="bg-[#33b36b] size-6 text-sm rounded-full flex items-center justify-center text-center absolute translate-x-5 -translate-y-4 border-[3px] border-[#222934]">
              3
            </p>
            <IoCartOutline className="text-xl text-white" />
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={` absolute 
          ${
            isOpen
              ? "flex flex-col gap-5 top-0 right-0 duration-500"
              : "top-0 left-96 hidden"
          } 
            md:hidden bg-[#222934] w-full h-screen p-5
        `}
      >
        <div className="mt-16">{navItems}</div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-10  w-[1296px] mx-auto">
        <div className="flex items-center justify-start ">
          <div className="flex items-center justify-between w-[306px] px-6 py-3 bg-[#333d4b] rounded-tl-md rounded-tr-md">
            <div className="text-white flex items-center gap-2">
              <MdGridView className="text-lg"/>
              <p className="text-white">Categories</p>
            </div>
            <TfiAngleRight className="text-white text-xs rotate-90" />
          </div>
          <div className="flex">{navItems}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
