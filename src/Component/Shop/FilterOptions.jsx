// Importing necessary dependencies and components
import { useState } from "react";
import { FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import ProductCard from "./ProductCard";
import { useTheme } from "../../ThemeContext";
import { useGetAllProductsQuery } from "../../redux/api/ProductApi";

// Main component for displaying all products
const FilterOptions = () => {
  // Using the theme context to determine if dark mode is active
  const { isDarkMode } = useTheme();

  // State variables for filtering and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    stockStatus: '',
    minPrice: 0,
    maxPrice: 10000,
    sortPrice: ''
  });

  // Constructing query parameters for the API call
  const queryParams = {
    page: currentPage,
    limit: productsPerPage,
    ...(filters.searchTerm && { search: filters.searchTerm }),
    ...(filters.category && { category: filters.category }),
    ...(filters.stockStatus && { stockStatus: filters.stockStatus }),
    ...(filters.sortPrice && { sort: filters.sortPrice === 'lowToHigh' ? 'price.regular' : '-price.regular' })
  };

  const { data: productsData, isLoading, isError } = useGetAllProductsQuery(queryParams);

  // Filter products based on price range
  const filteredProducts = productsData?.products?.filter(product => {
    return product.price.regular >= filters.minPrice && 
           product.price.regular <= filters.maxPrice;
  });

  // Loading state
  if (isLoading) return (
    <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 180, 180, 0, 0],
          borderRadius: ["25%", "25%", "50%", "50%", "25%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
        className="w-16 h-16 border-4 border-blue-500"
      />
    </div>
  );

  // Error state
  if (isError) return <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Error loading products</div>;

  // Get unique categories for filter
  const uniqueCategories = [...new Set(productsData?.products?.map(p => p.basicInfo?.category))];

  return (
    <div className={`max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Filter sidebar for desktop */}
          <div className={`lg:col-span-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg mb-4 lg:mb-0`}>
            <div className="space-y-6">
              {/* Search input */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className={`w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'
                  }`}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Category</h3>
                <div className="pr-2">
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={filters.category === ''}
                        onChange={() => setFilters(prev => ({ ...prev, category: '' }))}
                        className="mr-2"
                      />
                      All Categories
                    </label>
                    {uniqueCategories?.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          checked={filters.category === category}
                          onChange={() => setFilters(prev => ({ ...prev, category: category }))}
                          className="mr-2"
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-300 my-4"></div>

              {/* Stock Status Filter */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Stock Status</h3>
                <div className="pr-2">
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={filters.stockStatus === ''}
                        onChange={() => setFilters(prev => ({ ...prev, stockStatus: '' }))}
                        className="mr-2"
                      />
                      All Status
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={filters.stockStatus === 'In Stock'}
                        onChange={() => setFilters(prev => ({ ...prev, stockStatus: 'In Stock' }))}
                        className="mr-2"
                      />
                      In Stock
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={filters.stockStatus === 'Out of Stock'}
                        onChange={() => setFilters(prev => ({ ...prev, stockStatus: 'Out of Stock' }))}
                        className="mr-2"
                      />
                      Out of Stock
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-300 my-4"></div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Min: ৳{filters.minPrice}</span>
                    <input
                      type="range"
                      min="0"
                      max={filters.maxPrice}
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Max: ৳{filters.maxPrice}</span>
                    <input
                      type="range"
                      min={filters.minPrice}
                      max="10000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: productsPerPage }).map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}
                    >
                      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} h-48 mb-4 rounded animate-pulse`}></div>
                      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} h-4 w-3/4 mb-2 rounded animate-pulse`}></div>
                      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} h-4 w-1/2 rounded animate-pulse`}></div>
                    </motion.div>
                  ))
                ) : (
                  // Actual product cards
                  filteredProducts?.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Pagination controls */}
            <div className="mt-10 flex justify-center items-center space-x-4">
              {[...Array(productsData?.pagination.totalPage || 1)].map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      pageNumber === currentPage
                        ? isDarkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterOptions;