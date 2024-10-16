/* eslint-disable react/prop-types */
import { navbarGenerator } from "../utils/navbarGenerator";
import { navbarRoute } from "../Router/NavbarRoute";
import { NavLink } from "react-router-dom";
import { TfiAngleRight } from "react-icons/tfi";
import { MdGridView } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { PiPercentBold } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { useTheme } from "../ThemeContext";
import { useSelector } from "react-redux";
import { RiMoonLine, RiSunLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import Cart from "../Component/Cart/Cart";

import Search from "./Search";

// NavItem component for rendering individual navigation items
const NavItem = ({ item, isActive }) => (
  <NavLink
    to={`/${item.path}`}
    className={`px-6 py-3 rounded-md transition-all duration-300 ${
      isActive
        ? "bg-[#3a4556] text-white shadow-md"
        : "text-white/80 hover:bg-[#2c3544] hover:text-white"
    }`}
  >
    <p className="text-base font-medium">{item.name}</p>
  </NavLink>
);

// MobileNav component for mobile navigation menu
const MobileNav = ({ isOpen, navbar }) => (
  <div
    className={`absolute z-40 ${
      isOpen
        ? "flex flex-col gap-5 top-0 right-0 duration-500"
        : "top-0 left-96 hidden"
    } lg:hidden bg-[#222934] w-2/3 h-screen p-5 shadow-lg`}
  >
    <div className="mt-16 flex flex-col gap-3">
      {navbar.map((item) => (
        <NavItem key={item.name} item={item} isActive={false} />
      ))}
    </div>
  </div>
);

// DesktopNav component for desktop navigation menu
const DesktopNav = ({ navbar }) => (
  <div className="hidden lg:flex items-center gap-10 container mx-auto">
    <div className="flex items-center justify-start">
      <CategoryButton />
      <div className="flex gap-2 ml-4">
        {navbar.map((item) => (
          <NavItem key={item.name} item={item} isActive={false} />
        ))}
      </div>
    </div>
  </div>
);

// CategoryButton component for displaying categories
const CategoryButton = () => (
  <div className="flex items-center justify-between w-[306px] px-6 py-3 bg-[#333d4b] rounded-tl-md rounded-tr-md hover:bg-[#3a4556] transition-colors duration-300 cursor-pointer">
    <div className="text-white flex items-center gap-2">
      <MdGridView className="text-lg" />
      <p className="text-white font-medium">Categories</p>
    </div>
    <TfiAngleRight className="text-white text-xs rotate-90" />
  </div>
);

// Logo component for displaying the site logo
const Logo = () => (
  <NavLink to="/" className="hover:opacity-80 transition-opacity duration-300">
    <h5 className="text-white text-xl md:text-2xl font-bold">SparkTech</h5>
  </NavLink>
);

// SearchBar component for search functionality
// const SearchBar = () => {
//   return (
//     <div  className="lg:w-[490px] lg:px-5 lg:border border-white rounded-full flex items-center relative">
//       <CiSearch className="hidden lg:flex text-xl text-white" />
//       <input
//         type="text"
//         placeholder="Search the products"
//         className="hidden lg:flex outline-none py-2 bg-transparent w-full text-white font-normal px-4 placeholder:text-[#6c727f]"
//       />

//     </div>
//   );
// };

// SaleInfo component for displaying sale information
const SaleInfo = () => (
  <div className="hidden lg:flex items-center justify-center gap-2">
    <div className="size-12 bg-[#333D4C] rounded-full flex items-center justify-center">
      <PiPercentBold className="text-[#F55266] text-xl" />
    </div>
    <div>
      <p className="text-xs font-normal text-[#CAD0D9]">Only this month</p>
      <p className="text-base font-medium text-white">Super Sale 20%</p>
    </div>
  </div>
);

// UserActions component for user-related actions (theme toggle, cart, etc.)
const UserActions = ({ isDarkMode, toggleTheme, toggleCart, cartItems, isCartOpen, cartRef }) => (
  <div className="lg:w-[204px] flex items-center lg:justify-between gap-[2px]">
    <button onClick={toggleTheme} className="m-[10px]">
      {isDarkMode ? (
        <RiSunLine className="text-xl text-white" />
      ) : (
        <RiMoonLine className="text-xl text-white" />
      )}
    </button>
    <CiSearch className="lg:hidden m-[10px] text-xl text-white" />
    <NavLink to="/admin">
      <FaUserCircle className="hidden lg:flex text-xl text-white" />
    </NavLink>
    <div
      className="relative bg-[#333D4C] m-[10px] size-12 flex items-center justify-center rounded-full cursor-pointer"
      onClick={toggleCart}
    >
      <p className="bg-[#33b36b] size-6 text-sm rounded-full flex items-center justify-center absolute translate-x-5 -translate-y-4 border-[3px] border-[#222934]">
        {cartItems.length}
      </p>
      <IoCartOutline className="text-xl text-white" />
    </div>
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          ref={cartRef}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 overflow-y-auto"
        >
          <Cart toggleCart={toggleCart} />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Main Navbar component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCompactNav, setShowCompactNav] = useState(false);
  const navbar = navbarGenerator(navbarRoute);
  
  const cartRef = useRef(null);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Effect to handle clicking outside the cart to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Effect to handle scroll and show compact nav
  useEffect(() => {
    const handleScroll = () => {
      setShowCompactNav(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className="bg-[#222934] relative shadow-md">
        <div className="container mx-auto flex items-center justify-between lg:flex-row px-5 sm:p-5">
          <div className="flex items-center gap-[15px] lg:gap-0 lg:justify-between lg:w-fit pb-2">
            <div className="lg:hidden relative z-50">
              <label
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-col gap-2 w-[22px] sm:w-8 cursor-pointer"
              >
                <div
                  className={`rounded-2xl h-[3px] w-1/2 bg-white duration-200 ease-out ${
                    isOpen
                      ? "rotate-[225deg] origin-right -translate-x-[8px] translate-y-[3px] sm:-translate-x-[12px] sm:-translate-y-[1px]"
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
                      ? "rotate-[225deg] origin-left translate-x-[8px] -translate-y-[3px] sm:translate-x-[12px] sm:translate-y-[1px]"
                      : ""
                  }`}
                ></div>
              </label>
            </div>
            <Logo />
          </div>
          <Search />
          <SaleInfo />
          <UserActions
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            toggleCart={toggleCart}
            cartItems={cartItems}
            isCartOpen={isCartOpen}
            cartRef={cartRef}
          />
        </div>
        <MobileNav isOpen={isOpen} navbar={navbar} />
        <DesktopNav navbar={navbar} />
      </nav>
      {showCompactNav && (
        <nav className="fixed top-0 left-0 right-0 bg-[#222934] shadow-md z-50 transition-all duration-300">
          <div className="container mx-auto flex items-center justify-between px-5 py-3">
            <Logo />
            {/* <SearchBar /> */}
            <UserActions
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              toggleCart={toggleCart}
              cartItems={cartItems}
              isCartOpen={isCartOpen}
              cartRef={cartRef}
            />
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
