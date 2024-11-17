

// Importing necessary dependencies and components
import { useState, useEffect } from "react";
import { FaSearch, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import ProductCard from "./ProductCard";
import { useTheme } from "../../ThemeContext";
import { useGetAllProductsQuery } from "../../redux/api/ProductApi";
import { fixedCategory } from "../../utils/variables";

// Main component for displaying all products
const AllProducts = () => {
  // Using the theme context to determine if dark mode is active
  const { isDarkMode } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // State variables for pagination, filtering, and product display
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 20000],
    stockStatus: decodeURIComponent(searchParams.get('stockStatus') || 'all'),
    category: decodeURIComponent(searchParams.get('category') || 'all'),
    subcategory: decodeURIComponent(searchParams.get('subcategory') || 'all'),
    brand: decodeURIComponent(searchParams.get('brand') || 'all'),
    sort: decodeURIComponent(searchParams.get('sort') || '-createdAt')
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Constructing query parameters for the API call
  const queryParams = {
    page: currentPage,
    limit: productsPerPage,
    ...(searchTerm && { search: searchTerm }),
    ...(searchParams.get('search') && { search: decodeURIComponent(searchParams.get('search')) }),
    ...(filters.category !== 'all' && { category: filters.category }),
    ...(filters.subcategory !== 'all' && { subcategory: filters.subcategory }),
    ...(filters.brand !== 'all' && { brand: filters.brand }),
    ...(filters.stockStatus !== 'all' && { stockStatus: filters.stockStatus }),
    sort: filters.sort,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1]
  };

  const { data: productsData, isLoading, isError } = useGetAllProductsQuery(queryParams);
  // Fetching products data using the custom hook
  console.log(productsData);

  // Effect hook to update state when product data changes
  useEffect(() => {
    if (productsData) {
      setFilteredProducts(productsData?.products);
 
      // Extracting unique categories, subcategories, and brands
      const uniqueCategories = fixedCategory;
      setCategories(uniqueCategories);
      const uniqueSubcategories = [...new Set(productsData?.products.map(product => product.basicInfo.subcategory))];
      setSubcategories(uniqueSubcategories);
      
      const uniqueBrands = [...new Set(productsData?.products.map(product => product.basicInfo.brand))];
      setBrands(uniqueBrands);
    }
  }, [productsData]);
  // Handler for filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      priceRange: [0, 20000],
      stockStatus: 'all',
      category: 'all',
      subcategory: 'all',
      brand: 'all',
      sort: '-createdAt'
    });
    setCurrentPage(1);
    setSearchParams({}); // Clear URL query parameters
  };

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

  // Component for filter options
  const FilterOptions = () => {
    return (
      <div className={`w-full max-w-md mx-auto p-6 ${isDarkMode ? 'bg-gray-800 text-white' : ' text-gray-800'} rounded-lg `}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Filters</h2>
          <button
            onClick={clearFilters}
            className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition duration-300 font-semibold flex items-center`}
          >
            <FaFilter className="mr-2" />
            Reset Filters
          </button>
        </div>

        <div className="space-y-6">
          {/* Price Range Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Price Range</h3>
            <input
              type="range"
              min="0"
              max="20000"
              step="1000"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [0, Number(e.target.value)])}
              className="w-full mb-2"
            />
            <div className="flex justify-between text-sm">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          {/* Availability Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Availability</h3>
            <div className="space-y-2">
              {['all', 'In Stock', 'Out of Stock', 'Pre-order'].map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="radio"
                    checked={filters.stockStatus === status}
                    onChange={() => handleFilterChange('stockStatus', status)}
                    className="mr-2"
                  />
                  {status === 'all' ? 'All' : status}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          {/* Category Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Category</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={filters.category === 'all'}
                  onChange={() => handleFilterChange('category', 'all')}
                  className="mr-2"
                />
                All Categories
              </label>
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    checked={filters.category === category}
                    onChange={() => handleFilterChange('category', category)}
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          {/* Subcategory Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Subcategory</h3>
            <div className="pr-2">
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={filters.subcategory === 'all'}
                    onChange={() => handleFilterChange('subcategory', 'all')}
                    className="mr-2"
                  />
                  All Subcategories
                </label>
                {subcategories.map((subcategory) => (
                  <label key={subcategory} className="flex items-center">
                    <input
                      type="radio"
                      checked={filters.subcategory === subcategory}
                      onChange={() => handleFilterChange('subcategory', subcategory)}
                      className="mr-2"
                    />
                    {subcategory}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          {/* Brand Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Brand</h3>
            <div className="pr-2">
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={filters.brand === 'all'}
                    onChange={() => handleFilterChange('brand', 'all')}
                    className="mr-2"
                  />
                  All Brands
                </label>
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="radio"
                      checked={filters.brand === brand}
                      onChange={() => handleFilterChange('brand', brand)}
                      className="mr-2"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main component return
  return (
    <div className={`max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Filter sidebar for desktop */}
          <div className={`lg:col-span-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg mb-4 lg:mb-0 hidden lg:block`}>
            <FilterOptions />
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-4">
            {/* Search and sort options */}
            <div className={`mb-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} px-4 sm:px-6 py-5 rounded-lg shadow-md`}>
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                {/* Search input */}
                <div className="relative w-full sm:w-1/2">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className={`w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'
                    }`}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {/* Sort and display options */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label htmlFor="sortBy" className={`mr-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sort by:</label>
                    <select
                      id="sortBy"
                      name="sort"
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className={`p-2 rounded-lg shadow-sm cursor-pointer transition-all duration-300 ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                      }`}
                    >
                      <option value="-createdAt">Newest</option>
                      <option value="createdAt">Oldest</option>
                      <option value="price.regular">Price: Low to High</option>
                      <option value="-price.regular">Price: High to Low</option>
                      <option value="-stockQuantity">Stock: High to Low</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="showItems" className={`mr-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Show:</label>
                    <select
                      id="showItems"
                      className={`p-2 rounded-lg shadow-sm cursor-pointer transition-all duration-300 ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                      }`}
                      value={productsPerPage}
                      onChange={(e) => {
                        const newLimit = Number(e.target.value);
                        setProductsPerPage(newLimit);
                        setCurrentPage(1);
                      }}
                    >
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={36}>36</option>
                      <option value={48}>48</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
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
      
      {/* Floating filter button for mobile */}
      <button
        className="fixed bottom-4 right-4 z-50 lg:hidden p-4 bg-blue-500 text-white rounded-full shadow-lg"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
      >
        <FaFilter />
      </button>
      
      {/* Mobile filter sidebar */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowMobileFilters(false)}></div>
            <div className={`absolute right-0 top-0 bottom-0 w-80 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 overflow-y-auto`}>
              <FilterOptions />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllProducts;
