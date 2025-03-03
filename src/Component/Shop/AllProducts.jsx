// Importing necessary dependencies and components
import { useState } from "react";
import { FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from "./ProductCard";
import { useTheme } from "../../ThemeContext";
import { useGetAllProductsQuery } from "../../redux/api/ProductApi";
import { useSearchParams } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { useGetAllCategoriesQuery } from "../../redux/api/CategoriesApi";

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
    subcategory: searchParams.get('subcategory') || '',
    stockStatus: searchParams.get('stockStatus') || '',
    sortPrice: searchParams.get('sort') || ''
  });

  // Update URL search params when filters change
  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.searchTerm) params.set('search', newFilters.searchTerm);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.subcategory) params.set('subcategory', newFilters.subcategory);
    if (newFilters.stockStatus) params.set('stockStatus', newFilters.stockStatus);
    if (newFilters.sortPrice) params.set('sort', newFilters.sortPrice);
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params);
  };

  // Construct query parameters
  const queryParams = {
    page: currentPage,
    limit: productsPerPage,
    ...(filters.searchTerm && { search: filters.searchTerm }),
    ...(filters.category && { category: filters.category }),
    ...(filters.subcategory && { subcategory: filters.subcategory }),
    ...(filters.stockStatus && { stockStatus: filters.stockStatus }),
    sort: filters.sortPrice === "lowToHigh" ? "price.regular" : 
          filters.sortPrice === "highToLow" ? "-price.regular" : "-createdAt"
  };

  // Use RTK Query hook with the updated params
  const { data: productsData, isLoading, error } = useGetAllProductsQuery(queryParams);

  // Fetch categories data
  const { data: categoriesData } = useGetAllCategoriesQuery();

  // Update filters and search params
  const handleFilterChange = (newFilters) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  // Loading state - Shows animated loading spinner
  if (isLoading) return (
    <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'text-orange-500' : 'text-black'}`}>
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
        className="w-16 h-16 border-4 border-orange-500"
      />
    </div>
  );

  // Error state - Shows error message if data fetching fails
  if (error) {
    console.error('Error loading products:', error);
    return (
      <div className="text-center py-8">
        <p className="text-orange-500">Error loading products. Please try again later.</p>
      </div>
    );
  }

  // Filter sidebar content
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search input with icon */}
      <div className="lg:hidden">
        <h3 className="text-lg font-semibold mb-2 text-orange-500">Search</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title or category..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange({ ...filters, searchTerm: e.target.value })}
            className={`w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm transition-all duration-300 focus:ring-2 focus:ring-orange-500 ${
              isDarkMode ? 'bg-gray-700 text-orange-300 placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'
            }`}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" />
        </div>
      </div>

      <div className="border-t border-gray-300 my-4 lg:hidden"></div>

      {/* Sort by Price */}
      <div className="lg:hidden">
        <h3 className="text-lg font-semibold mb-2 text-orange-500">Sort by Price</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleFilterChange({ ...filters, sortPrice: 'lowToHigh' })}
            className={`p-2 rounded-lg ${filters.sortPrice === 'lowToHigh' ? 'bg-orange-300 text-white' : 'bg-gray-200 text-black'} transition duration-200`}
          >
            Low to High
          </button>
          <button
            onClick={() => handleFilterChange({ ...filters, sortPrice: 'highToLow' })}
            className={`p-2 rounded-lg ${filters.sortPrice === 'highToLow' ? 'bg-orange-300 text-white' : 'bg-gray-200 text-black'} transition duration-200`}
          >
            High to Low
          </button>
        </div>
      </div>

      <div className="border-t border-gray-300 my-4 lg:hidden"></div>

      {/* Stock Status Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-orange-500">Stock Status</h3>
        <div className="flex flex-col space-y-2">
          <label className={`flex items-center p-2 rounded-lg cursor-pointer ${filters.stockStatus === '' ? 'bg-orange-500 ' : ''} ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <input
              type="radio"
              checked={filters.stockStatus === ''}
              onChange={() => handleFilterChange({ ...filters, stockStatus: '' })}
              className="mr-2"
            />
            All Status
          </label>
          <label className={`flex items-center p-2 rounded-lg cursor-pointer ${filters.stockStatus === 'In Stock' ? 'bg-orange-500 ' : ''} ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <input
              type="radio"
              checked={filters.stockStatus === 'In Stock'}
              onChange={() => handleFilterChange({ ...filters, stockStatus: 'In Stock' })}
              className="mr-2"
            />
            In Stock
          </label>
          <label className={`flex items-center p-2 rounded-lg cursor-pointer ${filters.stockStatus === 'Out of Stock' ? 'bg-orange-500 ' : ''} ${isDarkMode ? 'text-white' : 'text-black'}`}>
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

      <div className="border-t border-gray-300 my-4"></div>

      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-orange-500">Category</h3>
        <div className="flex flex-col space-y-2">
          <label className={`flex items-center p-2 rounded-lg cursor-pointer ${filters.category === '' ? 'bg-orange-500 ' : ''} ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <input
              type="radio"
              checked={filters.category === ''}
              onChange={() => handleFilterChange({ ...filters, category: '', subcategory: '' })}
              className="mr-2"
            />
            All Categories
          </label>
            {categoriesData?.data?.map(category => (
            <div key={category._id}>
              <label className={`flex items-center p-2 rounded-lg cursor-pointer ${filters.category === category.name ? 'bg-orange-500 ' : ''} ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <input
                  type="radio"
                  checked={filters.category === category.name}
                  onChange={() => handleFilterChange({ ...filters, category: category.name, subcategory: '' })}
                  className="mr-2"
                />
                {category.name}
              </label>
              {filters.category === category.name && category.subCategories && category.subCategories.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  {category.subCategories.map(subcategory => (
                    <label key={subcategory.name} className={`flex items-center p-2 rounded-lg cursor-pointer ${filters.subcategory === subcategory.name ? 'bg-orange-500 ' : ''} ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      <input
                        type="radio"
                        checked={filters.subcategory === subcategory.name}
                        onChange={() => handleFilterChange({ ...filters, subcategory: subcategory.name })}
                        className="mr-2"
                      />
                      {subcategory.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-orange-200' : 'bg-gray-100 text-black'}`}>
      <Helmet>
        <title>All Products | BestBuy4uBD</title>
        <meta name="description" content="Browse our complete collection of electronics, gadgets, and accessories. Filter by category, price range, and stock status." />
        <meta name="keywords" content="electronics, gadgets, products, online shopping, BestBuy4uBD" />
      </Helmet>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        {/* Show Categories */}
        <div className="flex items-center gap-4 mb-6 overflow-x-auto p-2">
          {categoriesData?.data?.map(category => (
            <div
              key={category._id}
              onClick={() => handleFilterChange({ ...filters, category: category.name, subcategory: '' })}
              className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} 
                flex-1 min-w-[160px] h-24 p-2 rounded-lg shadow-sm cursor-pointer transition-all duration-300 
                ${filters.category === category.name ? 'ring-2 ring-orange-300' : ''}`}
            >
              <div className="h-full flex flex-col items-center justify-center text-center">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-10 h-10 object-contain mb-2"
                />
                <h3 className={`text-xs font-medium line-clamp-1 ${isDarkMode ? 'text-white' : 'text-orange-300'}`}>{category.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile filter button */}
        <button
          className="lg:hidden w-full mb-4 p-3 flex items-center justify-center gap-2 rounded-lg bg-orange-300 text-white"
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
                className="absolute top-4 right-4 text-2xl text-orange-300"
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
                  className={`w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm transition-all duration-300 focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode ? 'bg-gray-700 text-orange-300 placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'
                  }`}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" />
              </div>

              {/* Sort buttons */}
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <span className="text-sm font-medium whitespace-nowrap text-orange-500">Sort by Price:</span>
                <button
                  onClick={() => handleFilterChange({ ...filters, sortPrice: 'lowToHigh' })}
                  className={`p-2 rounded-lg ${filters.sortPrice === 'lowToHigh' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'} transition duration-200`}
                >
                  Low to High
                </button>
                <button
                  onClick={() => handleFilterChange({ ...filters, sortPrice: 'highToLow' })}
                  className={`p-2 rounded-lg ${filters.sortPrice === 'highToLow' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'} transition duration-200`}
                >
                  High to Low
                </button>
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
                    <div className={`text-center ${isDarkMode ? 'text-orange-600' : 'text-black'}`}>
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
                          ? 'bg-orange-600 text-white'
                          : 'bg-black text-white'
                        : isDarkMode
                        ? 'bg-gray-700 text-orange-200 hover:bg-gray-600'
                        : 'bg-white text-black hover:bg-gray-100'
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