import { FaShoppingCart, FaGift, FaClock } from 'react-icons/fa';
import { useTheme } from '../../../ThemeContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const OfferBanner = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date("2024-12-31") - +new Date();
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-10">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} mb-4`}>
            Exclusive Holiday Deals
          </h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Unwrap savings with code <span className="font-semibold text-indigo-400">HOLIDAY2024</span>
          </p>
          <div className="flex items-center mb-6">
            <FaGift className="text-3xl text-indigo-400 mr-4" />
            <span className="text-3xl font-bold text-indigo-400">30% OFF</span>
          </div>
          <button 
            onClick={() => navigate('/shop')}
            className="bg-indigo-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-indigo-700 transition duration-300 flex items-center"
          >
            <FaShoppingCart className="mr-2" />
            Shop Now
          </button>
        </div>
        <div className="bg-indigo-600 p-10 flex flex-col justify-center items-center">
          <h3 className="text-2xl font-semibold text-white mb-8">Limited Time Offer</h3>
          <div className="flex gap-6">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="bg-white rounded-lg p-4 mb-2 w-20 h-20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">{value}</span>
                </div>
                <span className="text-sm text-indigo-200 capitalize">{unit}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center text-white">
            <FaClock className="mr-2" />
            <span>Hurry! Offer ends soon</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SimpleBanner = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <motion.div 
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-8 md:p-12">              
          <h2 className={`text-4xl md:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 leading-tight`}>
            Discover Our <span className="text-teal-500">Latest Collection</span>
          </h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg mb-8 leading-relaxed`}>
            Explore our curated selection of premium products designed to enhance your lifestyle.
          </p>
          <button 
            onClick={() => navigate('/shop')}
            className="bg-teal-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-teal-600 transition duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaShoppingCart />
            Shop Now
          </button>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="h-full">
            <img 
              src="https://i.imgur.com/YbKN2D7.jpg" 
              alt="Shop Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-teal-500/40" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Offers = () => {
  const { isDarkMode } = useTheme();
  const [showOffers] = useState(true); // Set to true when you want to show offers

  return (
    <div className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        {showOffers ? <OfferBanner /> : <SimpleBanner />}
      </div>
    </div>
  );
};

export default Offers;
