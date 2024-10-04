/* eslint-disable react/prop-types */
import { useGetAllProductsQuery } from "../../../redux/api/ProductApi";
import { FaStar } from "react-icons/fa";
import Title from "../../../UI/Title";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";

// Component to display new arrivals section
const NewArrivals = () => {
  const { data, isLoading } = useGetAllProductsQuery({});
  const [products, setProducts] = useState([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  // Update products when data changes
  useEffect(() => {
    if (data?.data) {
      setProducts(data.data.slice(0, 8)); // Limit to 4 products for better responsiveness
    }
  }, [data]);

  return (
    <section ref={ref} className="container mx-auto px-4 py-8">
      <Title title="New Arrivals" className="mb-6 text-center" />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            className="md:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <FeaturedProduct />
          </motion.div>
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGrid products={products} />
          </motion.div>
        </div>
      )}
    </section>
  );
};

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Featured product component
const FeaturedProduct = () => (
  <motion.div 
    className="w-full h-56 md:h-[100%]"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <AnimatePresence>
      <motion.img
        key="featured-image"
        src="https://i.imgur.com/vZLZS8L.png"
        alt="Featured Product"
        className="w-full h-full object-contain rounded-lg"
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
    </AnimatePresence>
  </motion.div>
);

// Product grid component
const ProductGrid = ({ products }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <AnimatePresence>
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// Individual product card component
const ProductCard = ({ product }) => (
  <Link to={`/product/${product._id}`} className="block">
    <motion.div 
      className="bg-white rounded-lg p-4 flex items-start space-x-3 transition duration-300 ease-in-out h-36 hover:shadow-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <div className="w-28 h-28 rounded-lg flex-shrink-0 overflow-hidden">
        {product.images && product.images.length > 0 && (
          <motion.img
            src={product.images[0].url}
            alt={product.images[0].alt}
            className="w-full h-full object-contain"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
          {product.title}
        </h3>
        {product?.rating && <RatingStars rating={product.rating.average} count={product.rating.count} />}
        <div className="mt-3 flex flex-wrap items-center">
          <span className="font-bold text-base">
            ${product.price?.discounted || product.price?.regular || 'N/A'}
          </span>
          {product.price?.discounted && product.price?.regular && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${product.price.regular}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  </Link>
);

// Rating stars component
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

export default NewArrivals;
