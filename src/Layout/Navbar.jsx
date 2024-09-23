import { navbarGenerator } from "../utils/navbarGenerator";
import { navbarRoute } from "../Router/NavbarRoute";
import { NavLink } from "react-router-dom";
import { TfiAngleRight } from "react-icons/tfi";
import { MdGridView } from "react-icons/md";
import Menu from "./Navbar/Menu";
import SocialButton from "./Navbar/SocialButton";
import Sale from "./Navbar/Sale";
import SearchInput from "./Navbar/SearchInput";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navbar = navbarGenerator(navbarRoute);

  const navItems = navbar.map((item) => {
    return (
      <NavLink key={item.name} to={`/${item.path}`} className="">
        <p className="px-6 py-2 border border-gray-500 lg:border-none  lg:mb-0 text-base font-medium text-white/80 ">
          {item.name}
        </p>
      </NavLink>
    );
  });

  return (
    <div className="bg-[#222934] relative">
      {/* Logo */}
      <div className="container mx-auto flex items-center justify-between lg:flex-row px-5 sm:p-5">
        <div className=" flex items-center gap-[15px] lg:gap-0 lg:justify-between  lg:w-fit pb-2">
          {/* Menu */}
          <Menu isOpen={isOpen} setIsOpen={setIsOpen}/>
          {/* Logo */}
          <NavLink to="/">
            <h5 className="text-white text-xl md:text-2xl">SparkTech</h5>
          </NavLink>
        </div>
        {/* Search Input */}
        <SearchInput />
        {/* Sale */}
        <Sale />
        {/* Social Button */}
        <SocialButton />
      </div>

      {/* Mobile Nav */}
      <div
        className={` absolute z-40
          ${
            isOpen
              ? "flex flex-col gap-5 top-0 right-0 duration-500"
              : "top-0 left-96 hidden"
          } 
            lg:hidden bg-[#222934] w-1/2 h-screen p-5
        `}
      >
        <div className="mt-16">{navItems}</div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center gap-10 container mx-auto">
        <div className="flex items-center justify-start ">
          <div className="flex items-center justify-between w-[306px] px-6 py-3 bg-[#333d4b] rounded-tl-md rounded-tr-md">
            <div className="text-white flex items-center gap-2">
              <MdGridView className="text-lg" />
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
