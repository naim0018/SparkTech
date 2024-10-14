import { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { RiMoonLine, RiSunLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cart from "../../Component/Cart/Cart";
import { useSelector } from "react-redux";
import { useTheme } from "../../ThemeContext";

const SocialButton = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
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
};

export default SocialButton;
