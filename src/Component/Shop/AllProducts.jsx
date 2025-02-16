// Importing necessary dependencies and components
import { useState } from "react";
import { FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from "./ProductCard";
import { useTheme } from "../../ThemeContext";
import { useGetAllProductsQuery } from "../../redux/api/ProductApi";
import { useSearchParams } from "react-router-dom";
import { fixedCategory } from "../../utils/variables";
import { Helmet } from 'react-helmet';

// Main component for displaying all products
const AllProducts = () => {
  // Using the theme context to determine if dark mode is active
  const { isDarkMode } = useTheme();

  // Get and set search params
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State variables for filtering and pagination
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [productsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    stockStatus: searchParams.get('stockStatus') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 10000,
    sortPrice: searchParams.get('sort') || ''
  });

  // Update URL search params when filters change
  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.searchTerm) params.set('search', newFilters.searchTerm);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.stockStatus) params.set('stockStatus', newFilters.stockStatus);
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice < 10000) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.sortPrice) params.set('sort', newFilters.sortPrice);
    if (currentPage > 1) params.set('page', currentPage);

    setSearchParams(params);
  };

  // Constructing query parameters for the API call
  const queryParams = {
    page: currentPage,
    limit: productsPerPage,
    search: filters.searchTerm,
    category: filters.category,
    stockStatus: filters.stockStatus,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sortPrice === "lowToHigh" ? "price.regular" : filters.sortPrice === "highToLow" ? "-price.regular" : ""
  };

  // Fetching products data using RTK Query
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery(queryParams);

  // Update filters and search params
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  // Loading state - Shows animated loading spinner
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

  // Error state - Shows error message if data fetching fails
  if (isError) return <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Error loading products</div>;

  // Filter sidebar content
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search input with icon */}
      <div className="lg:hidden">
        <h3 className="text-lg font-semibold mb-2">Search</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title or category..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange({ ...filters, searchTerm: e.target.value })}
            className={`w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
              isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'
            }`}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="border-t border-gray-300 my-4 lg:hidden"></div>

      {/* Sort by Price */}
      <div className="lg:hidden">
        <h3 className="text-lg font-semibold mb-2">Sort by Price</h3>
        <select
          value={filters.sortPrice}
          onChange={(e) => handleFilterChange({ ...filters, sortPrice: e.target.value })}
          className={`w-full p-2 border border-gray-300 rounded-lg ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
          }`}
        >
          <option value="">Default</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      <div className="border-t border-gray-300 my-4 lg:hidden"></div>

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
              onChange={(e) => handleFilterChange({ ...filters, minPrice: Number(e.target.value) })}
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
              onChange={(e) => handleFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Category</h3>
        <div className="pr-2">
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                checked={filters.category === ''}
                onChange={() => handleFilterChange({ ...filters, category: '' })}
                className="mr-2"
              />
              All Categories
            </label>
            {fixedCategory.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  checked={filters.category === category}
                  onChange={() => handleFilterChange({ ...filters, category: category })}
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
                onChange={() => handleFilterChange({ ...filters, stockStatus: '' })}
                className="mr-2"
              />
              All Status
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={filters.stockStatus === 'In Stock'}
                onChange={() => handleFilterChange({ ...filters, stockStatus: 'In Stock' })}
                className="mr-2"
              />
              In Stock
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={filters.stockStatus === 'Out of Stock'}
                onChange={() => handleFilterChange({ ...filters, stockStatus: 'Out of Stock' })}
                className="mr-2"
              />
              Out of Stock
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
      <Helmet>
        <title>All Products | BestBuy4uBD</title>
        <meta name="description" content="Browse our complete collection of electronics, gadgets, and accessories. Filter by category, price range, and stock status." />
        <meta name="keywords" content="electronics, gadgets, products, online shopping, BestBuy4uBD" />
      </Helmet>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Our Products</h1>

        {/* Mobile filter button */}
        <button
          className="lg:hidden w-full mb-4 p-3 flex items-center justify-center gap-2 rounded-lg bg-blue-500 text-white"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaSearch className="text-lg" />
          <span>Filters & Search</span>
        </button>

        {/* Mobile filters modal */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}></div>
            <div className={`absolute right-0 top-0 h-full w-80 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-y-auto`}>
              <button
                className="absolute top-4 right-4 text-2xl"
                onClick={() => setShowFilters(false)}
              >
                ×
              </button>
              <FilterSidebar />
            </div>
          </div>
        )}
        
        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Desktop filter sidebar */}
          <div className={`hidden lg:block lg:col-span-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg mb-4 lg:mb-0`}>
            <FilterSidebar />
          </div>
            
          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Top bar for search and sort - Only visible on desktop */}
            <div className={`hidden lg:flex flex-col md:flex-row justify-between items-center gap-4 mb-8 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
              {/* Search input with icon */}
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search by title or category..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange({ ...filters, searchTerm: e.target.value })}
                  className={`w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'
                  }`}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <span className="text-sm font-medium whitespace-nowrap">Sort by Price:</span>
                <select
                  value={filters.sortPrice}
                  onChange={(e) => handleFilterChange({ ...filters, sortPrice: e.target.value })}
                  className={`p-2 border border-gray-300 rounded-lg flex-grow md:flex-grow-0 ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                  }`}
                >
                  <option value="">Default</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 min-h-[500px]">
              <AnimatePresence>
                {isLoading ? (
                  // Loading skeleton grid
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
                ) : productsData?.products?.length === 0 ? (
                  // No products found message
                  <div className="col-span-full flex flex-col justify-center items-center">
                    <div className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <h3 className="text-3xl font-bold mb-4">Oops! No Products Found</h3>
                      <p className="text-lg">We couldn&apos;t find any products matching your criteria.</p>
                      <p className="mt-2">Please try adjusting your filters or search terms.</p>
                    </div>
                  </div>
                ) : (
                  // Actual product cards with animation
                  productsData?.products?.map((product) => (
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
            <div className="mt-10 flex flex-wrap justify-center items-center gap-2">
              {[...Array(productsData?.pagination.totalPage || 1)].map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('page', pageNumber);
                      setSearchParams(newParams);
                    }}
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

export default AllProducts;