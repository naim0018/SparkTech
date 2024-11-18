/* eslint-disable react/prop-types */
import { useGetAllProductsQuery } from "../../../redux/api/ProductApi";
import Title from "../../../UI/Title";
import { MdOutlineShoppingCart, MdFavorite } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/features/CartSlice";
import { addToWishlist } from "../../../redux/features/wishlistSlice";
import { toast } from "react-toastify";
import { useTheme } from "../../../ThemeContext";

const TrendingProducts = () => {
  const { data, isLoading } = useGetAllProductsQuery();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const ref = useRef(null);
  const isInView = useInView(ref ,{once: false});
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (data?.products) {
      const filtered = data.products
        .filter((product) => product?.additionalInfo?.isOnSale)
        .slice(0, 8);
      setTrendingProducts(filtered);
    }
  }, [data]);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product?._id,
        title: product?.basicInfo?.title,
        price: product?.price?.discounted || product?.price?.regular,
        image: product?.images?.[0]?.url,
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

  const handleAddToWishlist = (product) => {
    dispatch(
      addToWishlist({
        _id: product?._id,
        title: product?.basicInfo?.title,
        price: product?.price?.discounted || product?.price?.regular,
        image: product?.images?.[0]?.url,
      })
    );
    toast.success("Product added to wishlist!", {
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
      className={`container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 ${
        isDarkMode ? "bg-gray-900" : ""
      }`}
    >
      <Title
        ref={ref}
        title="Trending Products"
        className="text-center text-xl sm:text-2xl lg:text-3xl"
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 50 }}
          animate={isInView ? { y: 0 } : { y: 50 }}
          transition={{ duration: 1.5 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            <AnimatePresence>
              {trendingProducts?.map((product, index) => (
                <motion.div
                  key={product?._id}
                  initial={{ y: 20 }}
                  animate={isInView ? { y: 0 } : { y: 20 }}
                  exit={{ y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex"
                >
                  <div className="w-full">
                    <motion.div
                      className={`h-full flex flex-col justify-between rounded-lg sm:rounded-xl overflow-hidden shadow ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      }`}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <Link
                        to={`/product/${product?._id}`}
                        className="relative w-full aspect-square overflow-hidden"
                      >
                        <motion.img
                          src={product?.images?.[0]?.url}
                          alt={
                            product?.images?.[0]?.alt || product?.basicInfo?.title
                          }
                          className="absolute top-0 left-0 w-full h-full object-fill"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                        {product?.additionalInfo?.isOnSale && (
                          <span className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-bold rounded">
                            TRENDING
                          </span>
                        )}
                      </Link>
                      <div className="p-2 sm:p-4">
                        <h2
                          className={`text-sm sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {product?.basicInfo?.title}
                        </h2>
                        <div
                          className={`text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {product?.basicInfo?.description}
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center">
                            <span
                              className={`text-sm sm:text-lg font-bold ${
                                isDarkMode ? "text-gray-300" : "text-gray-900"
                              }`}
                            >
                              $
                              {product?.price?.discounted ||
                                product?.price?.regular ||
                                "N/A"}
                            </span>
                            {product?.price?.discounted &&
                              product?.price?.regular && (
                                <span
                                  className={`line-through ml-1 sm:ml-2 text-xs sm:text-sm ${
                                    isDarkMode ? "text-gray-500" : "text-gray-500"
                                  }`}
                                >
                                  ${product?.price?.regular}
                                </span>
                              )}
                          </div>
                          <div className="flex space-x-1 sm:space-x-2">
                            <motion.button
                              className={`p-1.5 sm:p-2 rounded-full ${
                                isDarkMode
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAddToCart(product)}
                            >
                              <MdOutlineShoppingCart className="text-base sm:text-xl" />
                            </motion.button>
                            <motion.button
                              className={`p-1.5 sm:p-2 rounded-full ${
                                isDarkMode
                                  ? "bg-gray-700 text-white hover:bg-gray-600"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAddToWishlist(product)}
                            >
                              <MdFavorite className="text-base sm:text-xl" />
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
        </motion.div>
      )}
    </div>
  );
};

export default TrendingProducts;
