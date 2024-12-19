import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidenavRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidenavRef.current && !sidenavRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-700 text-white fixed w-full z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="text-4xl font-black italic tracking-wider hover:text-pink-300 transition-all duration-300 transform hover:scale-105">
            Portfolio
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link relative overflow-hidden group px-3 py-2">
              <span className="relative z-10 font-medium text-lg">Home</span>
              <div className="absolute inset-0 bg-pink-500 transform -skew-x-12 -translate-x-full transition-transform duration-300 group-hover:translate-x-0 opacity-20"></div>
            </Link>
            <Link to="/about" className="nav-link relative overflow-hidden group px-3 py-2">
              <span className="relative z-10 font-medium text-lg">About</span>
              <div className="absolute inset-0 bg-pink-500 transform -skew-x-12 -translate-x-full transition-transform duration-300 group-hover:translate-x-0 opacity-20"></div>
            </Link>
            <Link to="/projects" className="nav-link relative overflow-hidden group px-3 py-2">
              <span className="relative z-10 font-medium text-lg">Projects</span>
              <div className="absolute inset-0 bg-pink-500 transform -skew-x-12 -translate-x-full transition-transform duration-300 group-hover:translate-x-0 opacity-20"></div>
            </Link>
            <Link to="/skills" className="nav-link relative overflow-hidden group px-3 py-2">
              <span className="relative z-10 font-medium text-lg">Skills</span>
              <div className="absolute inset-0 bg-pink-500 transform -skew-x-12 -translate-x-full transition-transform duration-300 group-hover:translate-x-0 opacity-20"></div>
            </Link>
            <Link to="/contact" className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:text-pink-300 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <FaBars className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Sidenav */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 shadow-2xl transform transition-all duration-500 ease-out backdrop-blur-lg ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={sidenavRef}
      >
        <div className="p-8">
          <button
            className="absolute top-8 right-8 text-white hover:text-pink-300 transition-transform duration-300 hover:rotate-180"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes className="h-8 w-8" />
          </button>
          
          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-8 mt-20">
            {[
              { to: "/", text: "Home" },
              { to: "/about", text: "About" },
              { to: "/projects", text: "Projects" },
              { to: "/skills", text: "Skills" },
              { to: "/contact", text: "Contact" }
            ].map((link) => (
              <Link 
                key={link.text}
                to={link.to} 
                className="text-xl font-medium text-white hover:text-pink-300 transition-all duration-300 pl-4 border-l-4 border-transparent hover:border-pink-500 transform hover:translate-x-2" 
                onClick={() => setIsOpen(false)}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar1;
