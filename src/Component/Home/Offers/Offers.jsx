import { useState, useEffect } from 'react';
import { FaGift, FaClock, FaShoppingCart } from 'react-icons/fa';
import { useTheme } from '../../../ThemeContext';
import { motion } from 'framer-motion';

const Offers = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const { isDarkMode } = useTheme();

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

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className={`py-8 sm:py-12 md:py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl md:shadow-2xl overflow-hidden`}
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 sm:p-8 md:p-10 lg:p-12">
              <motion.h2 
                className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} mb-4 sm:mb-6`}
                variants={itemVariants}
              >
                Exclusive Holiday Deals
              </motion.h2>
              <motion.p 
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-base sm:text-lg mb-6 sm:mb-8`}
                variants={itemVariants}
              >
                Unwrap savings with code <span className="font-semibold text-indigo-400">HOLIDAY2024</span> for an incredible 30% off storewide!
              </motion.p>
              <motion.div 
                className="flex items-center mb-6 sm:mb-8"
                variants={itemVariants}
              >
                <FaGift className="text-2xl sm:text-3xl text-indigo-400 mr-3 sm:mr-4" />
                <span className="text-2xl sm:text-3xl font-bold text-indigo-400">30% OFF</span>
              </motion.div>
              <motion.button 
                className="bg-indigo-600 text-white py-2 px-6 sm:py-3 sm:px-8 rounded-full text-base sm:text-lg font-semibold hover:bg-indigo-700 transition duration-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShoppingCart className="mr-2" />
                Shop Now
              </motion.button>
            </div>
            <div className="bg-indigo-600 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center items-center">
              <motion.h3 
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 sm:mb-8 text-center"
                variants={itemVariants}
              >
                Limited Time Offer
              </motion.h3>
              <motion.div 
                className="flex flex-wrap justify-center gap-4 sm:gap-6"
                variants={itemVariants}
              >
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="text-center">
                    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 mb-2 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600">{value}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-indigo-200 capitalize">{unit}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div 
                className="mt-6 sm:mt-8 flex items-center text-white"
                variants={itemVariants}
              >
                <FaClock className="mr-2" />
                <span className="text-sm sm:text-base">Hurry! Offer ends soon</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Offers;
