import { FaShippingFast, FaCreditCard, FaExchangeAlt, FaHeadset } from 'react-icons/fa';
import { TbCurrencyTaka } from "react-icons/tb";
import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../ThemeContext';

const Benefits = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setIsVisible(isInView);
  }, [isInView]);

  const benefitItems = [
    {
      icon: <FaShippingFast className="text-xl sm:text-2xl md:text-3xl text-blue-500" />,
      title: "Swift Delivery",
      description: (
        <div className="flex items-center justify-center">
          <span className="">Free for orders above 2000</span>
          <TbCurrencyTaka className="" />
        </div>
      ),
    },
    {
      icon: <FaCreditCard className="text-xl sm:text-2xl md:text-3xl text-green-500" />,
      title: "Safe Transactions",
      description: "Secure payment options",
    },
    {
      icon: <FaExchangeAlt className="text-xl sm:text-2xl md:text-3xl text-purple-500" />,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: <FaHeadset className="text-xl sm:text-2xl md:text-3xl text-red-500" />,
      title: "24/7 Support",
      description: "Expert assistance anytime",
    },
  ];

  return (
    <div ref={ref} className="py-2 sm:py-4 md:py-6 lg:py-8">
      <div className="container mx-auto px-2 sm:px-0">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6">
          {benefitItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 20 }}
              animate={isVisible ? { y: 0 } : { y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 ${
                isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'
              }`}
            >
              <div className="p-2 sm:p-3 md:p-4">
                <motion.div
                  className={`w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 sm:mb-3 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                  }`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xs sm:text-base md:text-lg lg:text-xl font-semibold text-center mb-1">{item.title}</h3>
                <div className={`text-center text-[10px] sm:text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                  {item.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
