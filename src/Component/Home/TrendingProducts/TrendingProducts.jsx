/* eslint-disable react/prop-types */
import { useGetAllProductsQuery } from "../../../redux/api/ProductApi";
import Title from "../../../UI/Title";
import { MdOutlineShoppingCart, MdFavorite } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/features/CartSlice";
import { toast } from "react-toastify";
import { useTheme } from "../../../ThemeContext";

const FeaturedProducts = () => {
  const { data, isLoading } = useGetAllProductsQuery();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (data?.data) {
      const filtered = data.data
        .filter((product) => product.additionalInfo.isFeatured)
        .slice(0, 8);
      setFeaturedProducts(filtered);
    }
  }, [data]);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        image: product.images[0].url,
        quantity: 1,
      })
    );
    toast.success("Product added to cart!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div
      ref={ref}
      className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 ${
        isDarkMode ? "bg-gray-900" : ""
      }`}
    >
      <Title title="Featured Products" className="mb-8 text-center text-2xl sm:text-3xl lg:text-4xl" />
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div
            className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${
              isDarkMode ? "border-blue-400" : "border-blue-500"
            }`}
          ></div>
        </div>
      ) : !data || !data.data ? (
        <div
          className={`text-center py-8 text-lg sm:text-xl ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          No data available
        </div>
      ) : (
        <motion.div
          initial={{ y: 50 }}
          animate={isInView ? { y: 0 } : { y: 50 }}
          transition={{ duration: 1.5 }}
        >
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              <AnimatePresence>
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex"
                  >
                    <div className="w-full">
                      <motion.div
                        className={`h-full flex flex-col justify-between rounded-xl overflow-hidden shadow-lg ${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <Link
                          to={`/product/${product._id}`}
                          className="relative w-full aspect-square overflow-hidden"
                        >
                          <motion.img
                            src={product.images[0]?.url}
                            alt={product.images[0]?.alt || product.basicInfo.title}
                            className="absolute top-0 left-0 w-full h-full object-fill"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          />
                          {product.price?.discounted && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                              SALE
                            </span>
                          )}
                        </Link>
                        <div className="p-4">
                          <h2
                            className={`text-lg font-semibold mb-2 line-clamp-2 ${
                              isDarkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {product.basicInfo.title}
                          </h2>
                          <div
                            className={`text-sm mb-4 line-clamp-2 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {product.basicInfo.description}
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center">
                              <span
                                className={`text-lg font-bold ${
                                  isDarkMode ? "text-gray-300" : "text-gray-900"
                                }`}
                              >
                                ${product.price?.discounted || product.price?.regular || "N/A"}
                              </span>
                              {product.price?.discounted && product.price?.regular && (
                                <span
                                  className={`line-through ml-2 text-sm ${
                                    isDarkMode ? "text-gray-500" : "text-gray-500"
                                  }`}
                                >
                                  ${product.price.regular}
                                </span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <motion.button
                                className={`p-2 rounded-full ${
                                  isDarkMode
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAddToCart(product)}
                              >
                                <MdOutlineShoppingCart className="text-xl" />
                              </motion.button>
                              <motion.button
                                className={`p-2 rounded-full ${
                                  isDarkMode
                                    ? "bg-gray-700 text-white hover:bg-gray-600"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <MdFavorite className="text-xl" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div
              className={`text-center py-8 text-lg sm:text-xl ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              No featured products available.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FeaturedProducts;
