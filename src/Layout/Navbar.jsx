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
import { AnimatePresence, motion } from "framer-motion";
import Cart from "../Component/Cart/Cart";
import DarkMode from "./DarkMode";
import { logout } from "../redux/features/AuthSlice";
import { removeFromWishlist } from "../redux/features/wishlistSlice";

import Search from "./Search";

// NavItem component for rendering individual navigation items
const NavItem = ({ item, isActive }) => (
  <NavLink
    to={`/${item.path}`}
    className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-md transition-all duration-300 ${
      isActive
        ? "bg-[#3a4556] text-white shadow-md"
        : "text-white/80 hover:bg-[#2c3544] hover:text-white"
    }`}
  >
    <p className="text-sm sm:text-base font-medium">{item.name}</p>
  </NavLink>
);

// MobileNav component for mobile navigation menu
const MobileNav = ({ isOpen, navbar }) => (
  <div
    className={`absolute z-40 ${
      isOpen
        ? "flex flex-col gap-3 sm:gap-5 top-0 right-0 duration-500"
        : "top-0 left-96 hidden"
    } lg:hidden bg-[#222934] w-full sm:w-2/3 h-screen p-3 sm:p-5 shadow-lg`}
  >
    <div className="mt-16 flex flex-col gap-2 sm:gap-3">
      {navbar.map((item) => (
        <NavItem key={item.name} item={item} isActive={false} />
      ))}
    </div>
  </div>
);

// DesktopNav component for desktop navigation menu
const DesktopNav = ({ navbar }) => (
  <div className="hidden lg:flex items-center gap-4 xl:gap-10 container mx-auto overflow-x-auto">
    <div className="flex items-center justify-start min-w-0">
      <CategoryButton />
      <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-4">
        {navbar.map((item) => (
          <NavItem key={item.name} item={item} isActive={false} />
        ))}
      </div>
    </div>
  </div>
);

// CategoryButton component for displaying categories
const CategoryButton = () => (
  <div className="flex items-center justify-between w-[306px] px-4 sm:px-6 py-2 sm:py-3 bg-[#333d4b] rounded-tl-md rounded-tr-md hover:bg-[#3a4556] transition-colors duration-300 cursor-pointer">
    <div className="text-white flex items-center gap-2">
      <MdGridView className="text-base sm:text-lg" />
      <p className="text-white text-sm sm:text-base font-medium">Categories</p>
    </div>
    <TfiAngleRight className="text-white text-xs rotate-90" />
  </div>
);

// Logo component for displaying the site logo
const Logo = () => (
  <NavLink to="/" className="hover:opacity-80 transition-opacity duration-300">
    <h5 className="text-white text-lg sm:text-xl md:text-2xl font-bold">ajkerbazarbd</h5>
  </NavLink>
);

// SaleInfo component for displaying sale information
const SaleInfo = () => (
  <div className="hidden lg:flex items-center justify-center gap-2">
    <div className="size-10 sm:size-12 bg-[#333D4C] rounded-full flex items-center justify-center">
      <PiPercentBold className="text-[#F55266] text-lg sm:text-xl" />
    </div>
    <div>
      <p className="text-xs font-normal text-[#CAD0D9]">Only this month</p>
      <p className="text-sm sm:text-base font-medium text-white">Super Sale 20%</p>
    </div>
  </div>
);

// UserActions component for user-related actions (theme toggle, cart, etc.)
const UserActions = ({ toggleCart, cartItems, isCartOpen, cartRef }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const {user} = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const dropdownRef = useRef(null);
  const wishlistRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (wishlistRef.current && !wishlistRef.current.contains(event.target)) {
        setIsWishlistOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserDropdown(false);
  };

  const toggleWishlist = () => setIsWishlistOpen(!isWishlistOpen);

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
                  className="block px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 hover:bg-emerald-50 transition-colors"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 hover:bg-emerald-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="block px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 hover:bg-emerald-50 transition-colors"
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
        <span className="absolute -top-2 -right-2 bg-emerald-500 text-white w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm rounded-full flex items-center justify-center">
          {wishlistItems.length}
        </span>
        <MdFavorite className="text-xl sm:text-2xl text-white" />
      </button>

      {/* Cart */}
      <button
        className="relative p-1.5 sm:p-2 rounded-full bg-[#333D4C] hover:bg-[#3a4556] transition-colors"
        onClick={toggleCart}
      >
        <span className="absolute -top-2 -right-2 bg-emerald-500 text-white w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm rounded-full flex items-center justify-center">
          {cartItems.length}
        </span>
        <IoCartOutline className="text-xl sm:text-2xl text-white" />
      </button>

      {/* Cart Sidebar */}
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

      {/* Wishlist Sidebar */}
      <AnimatePresence>
        {isWishlistOpen && (
          <motion.div
            ref={wishlistRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">My Wishlist</h2>
                <button 
                  onClick={toggleWishlist}
                  className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
                >
                  ×
                </button>
              </div>
              {wishlistItems.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {wishlistItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <img src={item.image} alt={item.title} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-medium mb-1">{item.title}</h3>
                        <p className="text-emerald-600 font-semibold text-sm sm:text-base">${item.price}</p>
                        <div className="flex gap-2 mt-2">
                          <NavLink 
                            to={`/product/${item._id}`}
                            onClick={toggleWishlist}
                            className="text-xs sm:text-sm text-blue-500 hover:text-blue-600"
                          >
                            View Details
                          </NavLink>
                          <button 
                            className="text-xs sm:text-sm text-red-500 hover:text-red-600"
                            onClick={() => dispatch(removeFromWishlist(item._id))}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">Your wishlist is empty</p>
                  <NavLink 
                    to="/shop" 
                    className="text-emerald-600 hover:text-emerald-700 text-sm sm:text-base"
                    onClick={toggleWishlist}
                  >
                    Continue Shopping
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Navbar component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCompactNav, setShowCompactNav] = useState(false);
  const navbar = navbarGenerator(navbarRoute);
  
  const cartRef = useRef(null);
  const cartItems = useSelector((state) => state.cart.cartItems);
  

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
        <div className="container mx-auto flex items-center justify-between lg:flex-row px-3 sm:px-5 py-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-[15px] lg:gap-0 lg:justify-between lg:w-fit pb-0 sm:pb-2">
            <div className="lg:hidden relative z-50">
              <label
                onClick={() => setIsOpen(!isOpen)}
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
          />
        </div>
        <MobileNav isOpen={isOpen} navbar={navbar} />
        <DesktopNav navbar={navbar} />
      </nav>
      {showCompactNav && (
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 bg-[#222934] shadow-md z-50 transition-all duration-300"
        >
          <div className="container mx-auto flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3">
            <div className="flex items-center gap-4">
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
              <Logo />
              <div className="hidden lg:flex gap-1 sm:gap-2">
                {navbar.map((item) => (
                  <NavItem key={item.name} item={item} isActive={false} />
                ))}
              </div>
            </div>
            <UserActions
              toggleCart={toggleCart}
              cartItems={cartItems}
              isCartOpen={isCartOpen}
              cartRef={cartRef}
            />
          </div>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden bg-[#222934] py-2"
            >
              <div className="container mx-auto px-3 sm:px-5">
                <div className="flex flex-col gap-2">
                  {navbar.map((item) => (
                    <NavItem key={item.name} item={item} isActive={false} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.nav>
      )}
    </>
  );
};

export default Navbar;
