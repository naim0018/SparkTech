import { FaShippingFast, FaCreditCard, FaExchangeAlt, FaHeadset } from 'react-icons/fa';
import { TbCurrencyTaka } from "react-icons/tb";
import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const Benefits = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isInView]);

  const benefitItems = [
    {
      icon: <FaShippingFast className="text-2xl sm:text-3xl text-blue-500" />,
      title: "Swift Delivery",
      description: (
        <>
          Free for orders above 2000 <TbCurrencyTaka className="inline" />
        </>
      ),
    },
    {
      icon: <FaCreditCard className="text-2xl sm:text-3xl text-green-500" />,
      title: "Safe Transactions",
      description: "Secure payment options",
    },
    {
      icon: <FaExchangeAlt className="text-2xl sm:text-3xl text-purple-500" />,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: <FaHeadset className="text-2xl sm:text-3xl text-red-500" />,
      title: "24/7 Support",
      description: "Expert assistance anytime",
    },
  ];

  return (
    <div ref={ref} className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefitItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{  y: 20 }}
              animate={isVisible ? { y: 0 } : { y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <div className="p-4">
                <motion.div
                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-gray-100"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-center mb-1">{item.title}</h3>
                <p className="text-gray-600 text-center text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
