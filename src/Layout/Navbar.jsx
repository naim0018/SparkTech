/* eslint-disable react/prop-types */
import { navbarGenerator } from "../utils/navbarGenerator";
import { navbarRoute } from "../Router/NavbarRoute";
import { NavLink, useLocation } from "react-router-dom";
import { TfiAngleRight } from "react-icons/tfi";
import { MdGridView } from "react-icons/md";
import { useState } from "react";
import Menu from "./Navbar/Menu";
import SocialButton from "./Navbar/SocialButton";
import Sale from "./Navbar/Sale";
import SearchInput from "./Navbar/SearchInput";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navbar = navbarGenerator(navbarRoute);
  const location = useLocation();

  const NavItem = ({ item }) => {
    const isActive = location.pathname === `/${item.path}`;
    return (
      <NavLink
        to={`/${item.path}`}
        className={`px-6 py-3 rounded-md transition-all duration-300 ${
          isActive
            ? "bg-[#3a4556] text-white shadow-md "
            : "text-white/80 hover:bg-[#2c3544] hover:text-white"
        }`}
      >
        <p className="text-base font-medium">{item.name}</p>
      </NavLink>
    );
  };

  const MobileNav = () => (
    <div
      className={`absolute z-40 ${
        isOpen
          ? "flex flex-col gap-5 top-0 right-0 duration-500"
          : "top-0 left-96 hidden"
      } lg:hidden bg-[#222934] w-2/3 h-screen p-5 shadow-lg`}
    >
      <div className="mt-16 flex flex-col gap-3">
        {navbar.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </div>
    </div>
  );

  const DesktopNav = () => (
    <div className="hidden lg:flex items-center gap-10 container mx-auto">
      <div className="flex items-center justify-start">
        <CategoryButton />
        <div className="flex gap-2 ml-4">
          {navbar.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </div>
  );

  const CategoryButton = () => (
    <div className="flex items-center justify-between w-[306px] px-6 py-3 bg-[#333d4b] rounded-tl-md rounded-tr-md hover:bg-[#3a4556] transition-colors duration-300 cursor-pointer">
      <div className="text-white flex items-center gap-2">
        <MdGridView className="text-lg" />
        <p className="text-white font-medium">Categories</p>
      </div>
      <TfiAngleRight className="text-white text-xs rotate-90" />
    </div>
  );

  return (
    <div className="bg-[#222934] relative shadow-md">
      <div className="container mx-auto flex items-center justify-between lg:flex-row px-5 sm:p-5">
        <div className="flex items-center gap-[15px] lg:gap-0 lg:justify-between lg:w-fit pb-2">
          <Menu isOpen={isOpen} setIsOpen={setIsOpen} />
          <NavLink to="/" className="hover:opacity-80 transition-opacity duration-300">
            <h5 className="text-white text-xl md:text-2xl font-bold">SparkTech</h5>
          </NavLink>
        </div>
        <SearchInput />
        <Sale />
        <SocialButton />
      </div>
      <MobileNav />
      <DesktopNav />
    </div>
  );
};

export default Navbar;
