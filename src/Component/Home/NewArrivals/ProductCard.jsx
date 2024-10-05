/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { motion, useSpring, useAnimation } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { useState, useEffect } from 'react';

// ProductCard component for displaying individual product information
const ProductCard = ({ product, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const imageSpring = useSpring(1, {
    stiffness: 300,
    damping: 10
  });

  const controls = useAnimation();

  // Effect to control animation based on view status
  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [isInView, controls]);

  // Handler for mouse hover start
  const handleHover = () => {
    setIsHovered(true);
    imageSpring.set(1.1);
  };

  // Handler for mouse hover end
  const handleHoverEnd = () => {
    setIsHovered(false);
    imageSpring.set(1);
  };

  return (
   // Individual product card component
   <motion.div 
     initial={{  y: 50 }}
     animate={controls}
     transition={{ duration: 0.5 }}
   >
     <Link to={`/product/${product._id}`} className="block">
      <motion.div
      className="bg-white rounded-lg p-4 flex items-start  space-x-5 transition duration-300 ease-in-out h-36 hover:shadow-lg"
      onHoverStart={handleHover}
      onHoverEnd={handleHoverEnd}
      >
        {/* Product image container */}
        <motion.div
          className="w-28 h-28 rounded-lg flex-shrink-0 overflow-hidden"
          style={{ scale: imageSpring }}
        >
          {product.images && product.images.length > 0 && (
            <motion.img
              src={product.images[0].url}
              alt={product.images[0].alt || product.title}
              className="w-full h-full object-contain"
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
        {/* Product details container */}
        <motion.div 
          className="flex-grow"
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 300, damping: 10 }
          }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Product title */}
          <motion.h3 
            className="font-semibold text-sm mb-2 line-clamp-2"
          >
            {product.title}
          </motion.h3>
          {/* Product rating */}
          {product?.rating && <RatingStars rating={product.rating.average} count={product.rating.count} />}
          {/* Product price */}
          <motion.div 
            className="mt-3 flex flex-wrap items-center"
            whileHover={{ y: -2 }}
            animate={{ y: isHovered ? -2 : 0 }}
          >
            <motion.span 
              className="font-bold text-base"
              whileHover={{ scale: 1.1 }}
              animate={{ scale: isHovered ? 1.1 : 1 }}
            >
              ${product.price?.discounted || product.price?.regular || 'N/A'}
            </motion.span>
            {product.price?.discounted && product.price?.regular && (
              <motion.span 
                className="ml-2 text-sm text-gray-500 line-through"
                whileHover={{ opacity: 0.7 }}
                animate={{ opacity: isHovered ? 0.7 : 1 }}
              >
                ${product.price.regular}
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  
   </motion.div>
  )
}

// RatingStars component for displaying product ratings
const RatingStars = ({ rating, count }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`w-3 h-3 ${
            i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-600">
        {rating ? `(${rating.toFixed(1)})` : ''} {count} reviews
      </span>
    </div>
  );

export default ProductCard
