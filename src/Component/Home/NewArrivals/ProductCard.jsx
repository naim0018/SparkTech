/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { motion, useSpring, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '../../../ThemeContext';
import { TbCurrencyTaka } from "react-icons/tb";

const ProductCard = ({ product, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const imageSpring = useSpring(1, {
    stiffness: 300,
    damping: 10
  });

  const controls = useAnimation();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [isInView, controls]);

  const handleHover = () => {
    setIsHovered(true);
    imageSpring.set(1.1);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    imageSpring.set(1);
  };

  return (
   <motion.div 
     initial={{ y: 50 }}
     animate={controls}
     transition={{ duration: 0.5 }}
   >
     <Link to={`/product/${product._id}`} className="block">
      <motion.div
      className={`${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg p-4 flex items-start space-x-5 transition duration-300 ease-in-out h-36 hover:shadow-lg`}
      onHoverStart={handleHover}
      onHoverEnd={handleHoverEnd}
      >
        <motion.div
          className="w-28 h-28 rounded-lg flex-shrink-0 overflow-hidden"
          style={{ scale: imageSpring }}
        >
          {product.images && product.images.length > 0 && (
            <motion.img
              src={product.images[0].url}
              alt={product.images[0].alt || product.basicInfo.title}
              className="w-full h-full object-contain bg-white rounded-lg"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'path/to/fallback/image.jpg';
              }}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
        <motion.div 
          className="flex-grow"
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 300, damping: 10 }
          }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h3 
            className={`font-semibold text-sm mb-2 line-clamp-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
          >
            {product.basicInfo.title}
          </motion.h3>
          <motion.div className="flex gap-5 items-center mt-2">
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <strong>Category:</strong> {product.basicInfo.category}
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <strong>Brand:</strong> {product.basicInfo.brand}
            </span>
          </motion.div>
          <motion.div 
            className="mt-3 flex flex-wrap items-center"
            whileHover={{ y: -2 }}
            animate={{ y: isHovered ? -2 : 0 }}
          >
            <motion.span 
              className={`font-bold text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center`}
              whileHover={{ scale: 1.1 }}
              animate={{ scale: isHovered ? 1.1 : 1 }}
            >
              <TbCurrencyTaka />{product.price.discounted || product.price.regular || 'N/A'}
            </motion.span>
            {product.price.discounted && product.price.regular && (
              <motion.span 
                className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} line-through flex items-center`}
                whileHover={{ opacity: 0.7 }}
                animate={{ opacity: isHovered ? 0.7 : 1 }}
              >
                <TbCurrencyTaka />{product.price.regular}
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
   </motion.div>
  )
}

export default ProductCard
