/* eslint-disable react/prop-types */
import { navbarGenerator } from "../utils/navbarGenerator";
import { navbarRoute } from "../Router/NavbarRoute";
import { NavLink } from "react-router-dom";
import { TfiAngleRight } from "react-icons/tfi";
import { MdGridView } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { PiPercentBold } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { MdFavorite } from "react-icons/md";
import { motion } from "framer-motion";
import DarkMode from "./DarkMode";
import { logout } from "../redux/features/AuthSlice";
import Search from "./Search";
import CartSidebar from "../Component/Common/CartSidebar";
import WishlistSidebar from "../Component/Common/WishlistSidebar";

// NavItem component for rendering individual navigation items
const NavItem = ({ item, onClick }) => (
  <NavLink
    to={`/${item.path}`}
    onClick={onClick}
    className={({ isActive }) =>
      `px-4 md:px-5 py-2.5 rounded-lg transition-all duration-300 relative group text-gray-200 hover:text-white ${
        isActive ? "after:content-[''] after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-0.5 after:bg-white" : ""
      }`
    }
  >
    <p className="text-sm sm:text-base font-medium relative z-10">{item.name}</p>
    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </NavLink>
);

// MobileNav component for mobile navigation menu
const MobileNav = ({ isOpen, navbar, setIsOpen }) => {
  const navRef = useRef(null);
  const handleNavItemClick = () => {
    setIsOpen(false);
  };

  return (
    <motion.div
      ref={navRef}
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 20 }}
      className={`fixed z-40 top-0 right-0 lg:hidden bg-gradient-to-b from-[#1a2234] to-[#222934] w-full sm:w-2/5 h-screen p-4 sm:p-6 shadow-2xl`}
    >
      <div className="mt-16 flex flex-col gap-3">
        {navbar.map((item) => (
          <NavItem 
            key={item.name} 
            item={item} 
            onClick={handleNavItemClick}
          />
        ))}
      </div>
    </motion.div>
  );
};

// DesktopNav component for desktop navigation menu
const DesktopNav = ({ navbar }) => (
  <div className="hidden lg:flex items-center gap-6 xl:gap-8 container mx-auto">
    <div className="flex items-center justify-start min-w-0">
      <CategoryButton />
      <div className="flex gap-2 ml-4">
        {navbar.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </div>
    </div>
  </div>
);

// CategoryButton component for displaying categories
const CategoryButton = () => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center justify-between w-[306px] px-5 py-2.5 bg-gradient-to-r from-[#2c3544] to-[#333d4b] cursor-pointer  shadow-black/10 group"
  >
    <div className="text-white flex items-center gap-3">
      <MdGridView className="text-lg text-blue-400 group-hover:text-blue-300 transition-colors" />
      <p className="text-base font-medium">Categories</p>
    </div>
    <motion.div
      animate={{ rotate: 90 }}
      transition={{ duration: 0.2 }}
    >
      <TfiAngleRight className="text-blue-400 text-sm group-hover:text-blue-300 transition-colors" />
    </motion.div>
  </motion.div>
);

// Logo component for displaying the site logo
const Logo = () => (
  <NavLink to="/" className="group">
    <motion.img 
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      src="https://i.imgur.com/TGLPFni.png" 
      alt="BestBuy4uBD" 
      className="h-10" 
    />
  </NavLink>
);

// SaleInfo component for displaying sale information
const SaleInfo = () => ( 
  <div className="hidden lg:flex items-center justify-center gap-3  px-4 py-2 rounded-lg">
    <motion.div 
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
      className="size-11 bg-gradient-to-br from-[#333D4C] to-[#2c3544] rounded-full flex items-center justify-center shadow-lg"
    >
      <PiPercentBold className="text-[#F55266] text-xl" />
    </motion.div>
    <div>
      <p className="text-xs font-normal text-blue-200/80">Only this month</p>
      <p className="text-base font-medium text-white">Super Sale 20%</p>
    </div>
  </div>
);

// UserActions component for user-related actions (theme toggle, cart, etc.)
const UserActions = ({ toggleCart, cartItems, toggleWishlist }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const {user} = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserDropdown(false);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <DarkMode />
      
      {/* Search Icon - Mobile Only */}
      <CiSearch className="lg:hidden text-xl text-white cursor-pointer hover:text-gray-300" />
      
      {/* User Profile */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full hover:bg-[#333D4C] transition-colors border border-white/20"
        >
          {user ? (
            <>
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-xl sm:text-2xl text-white" />
              )}
              <span className="hidden lg:block text-white text-xs sm:text-sm">
                {user.name || user.email.split('@')[0]}
              </span>
            </>
          ) : (
            <FaUserCircle className="text-xl sm:text-2xl text-white" />
          )}
        </button>

        {/* Dropdown Menu */}
        {showUserDropdown && (
          <div className="absolute right-0 mt-2 w-36 sm:w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            {user ? (
              <>
                <NavLink
                  to={`/${user.role}/dashboard`}
                  className="block px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="block px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 hover:bg-blue-50 transition-colors"
              >
                Login/Signup
              </NavLink>
            )}
          </div>
        )}
      </div>

      {/* Wishlist */}
      <button
        className="relative p-1.5 sm:p-2 rounded-full bg-[#333D4C] hover:bg-[#3a4556] transition-colors"
        onClick={toggleWishlist}
      >
        <span className="absolute -top-2 -right-2 bg-blue-500 text-white w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm rounded-full flex items-center justify-center">
          {wishlistItems.length}
        </span>
        <MdFavorite className="text-xl sm:text-2xl text-white" />
      </button>

      {/* Cart */}
      <button
        className="relative p-1.5 sm:p-2 rounded-full bg-[#333D4C] hover:bg-[#3a4556] transition-colors"
        onClick={toggleCart}
      >
        <span className="absolute -top-2 -right-2 bg-blue-500 text-white w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm rounded-full flex items-center justify-center">
          {cartItems.length}
        </span>
        <IoCartOutline className="text-xl sm:text-2xl text-white" />
      </button>
    </div>
  );
};

// Main Navbar component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [showCompactNav, setShowCompactNav] = useState(false);
  const navbar = navbarGenerator(navbarRoute);
  
  const cartRef = useRef(null);
  const wishlistRef = useRef(null);
  const cartItems = useSelector((state) => state.cart.cartItems);
  
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleWishlist = () => setIsWishlistOpen(!isWishlistOpen);

  // Effect to handle scroll and show compact nav
  useEffect(() => {
    const handleScroll = () => {
      setShowCompactNav(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className="bg-[#222934] relative shadow-md">
        <div className="container mx-auto flex items-center justify-between lg:flex-row px-3 sm:px-5 py-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-[15px] lg:gap-0 lg:justify-between lg:w-fit pb-0 sm:pb-2">
            <div className="lg:hidden relative z-50 " onClick={() => setIsOpen(!isOpen)}>
              <label
                className="flex flex-col gap-1.5 sm:gap-2 w-[18px] sm:w-[22px] cursor-pointer"
              >
                <div
                  className={`rounded-2xl h-[2px] sm:h-[3px] w-1/2 bg-white duration-200 ease-out ${
                    isOpen
                      ? "rotate-[225deg] origin-right -translate-x-[6px] translate-y-[2px] sm:-translate-x-[8px] sm:translate-y-[3px]"
                      : ""
                  }`}
                ></div>
                <div 
                  className={`rounded-2xl h-[2px] sm:h-[3px] w-full bg-white duration-200 ease-in ${
                    isOpen ? "-rotate-45" : ""
                  }`}
                ></div>
                <div
                  className={`rounded-2xl h-[2px] sm:h-[3px] w-1/2 bg-white duration-200 ease-out place-self-end ${
                    isOpen
                      ? "rotate-[225deg] origin-left translate-x-[6px] -translate-y-[2px] sm:translate-x-[8px] sm:-translate-y-[3px]"
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
            toggleCart={toggleCart}
            cartItems={cartItems}
            isCartOpen={isCartOpen}
            cartRef={cartRef}
            isWishlistOpen={isWishlistOpen}
            toggleWishlist={toggleWishlist}
            wishlistRef={wishlistRef}
          />
        </div>
        <MobileNav isOpen={isOpen} navbar={navbar} setIsOpen={setIsOpen} />
        <DesktopNav navbar={navbar} />
      </nav>

      {/* Compact navigation bar */}
      {showCompactNav && (
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 bg-[#222934] shadow-md z-50 transition-all duration-300"
        >
          <div className="container mx-auto flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3">
            <div className="flex items-center gap-4">
              {/* Mobile menu toggle button */}
              <div className="lg:hidden">
                <label
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex flex-col gap-1.5 sm:gap-2 w-[18px] sm:w-[22px] cursor-pointer"
                >
                  <div className="rounded-2xl h-[2px] sm:h-[3px] w-1/2 bg-white"></div>
                  <div className="rounded-2xl h-[2px] sm:h-[3px] w-full bg-white"></div>
                  <div className="rounded-2xl h-[2px] sm:h-[3px] w-1/2 bg-white place-self-end"></div>
                </label>
              </div>
              {/* Site logo */}
              <Logo />
            </div>
              {/* Desktop navigation items */}
              <div className="hidden lg:flex gap-1 sm:gap-2">
                {navbar.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </div>
            {/* Use the same UserActions component with the same state */}
            <UserActions
              toggleCart={toggleCart}
              cartItems={cartItems}
              isCartOpen={isCartOpen}
              cartRef={cartRef}
              isWishlistOpen={isWishlistOpen}
              toggleWishlist={toggleWishlist}
              wishlistRef={wishlistRef}
            />
          </div>
        </motion.nav>
      )}

      {/* Single instance of Cart and Wishlist sidebars */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
};

export default Navbar;