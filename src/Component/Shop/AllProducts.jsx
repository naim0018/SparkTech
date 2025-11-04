import { useState } from "react";
import { FaSearch, FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from "./ProductCard";
import { useTheme } from "../../ThemeContext";
import { useGetAllProductsQuery } from "../../redux/api/ProductApi";
import { useSearchParams } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { useGetAllCategoriesQuery } from "../../redux/api/CategoriesApi";

const AllProducts = () => {
  const { isDarkMode } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [productsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    stockStatus: searchParams.get('stockStatus') || '',
    sortPrice: searchParams.get('sort') || ''
  });

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

  const { data: productsData, isLoading, error } = useGetAllProductsQuery(queryParams);
  const { data: categoriesData } = useGetAllCategoriesQuery();

  const handleFilterChange = (newFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      category: '',
      subcategory: '',
      stockStatus: '',
      sortPrice: ''
    };
    setFilters(clearedFilters);
    updateSearchParams(clearedFilters);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1.2, 1, 1],
            rotate: [0, 180, 360, 540, 720],
          }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="w-16 h-16 border-4 border-transparent rounded-full border-t-indigo-500 border-r-purple-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="mb-4 text-6xl">😕</div>
          <p className={`text-xl font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Oops! Something went wrong
          </p>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  const categoriesWithProducts = categoriesData?.data?.filter(category =>
    productsData?.products?.some(product => product.basicInfo?.category === category.name)
  ) || [];

  const activeFiltersCount = [
    filters.searchTerm,
    filters.category,
    filters.subcategory,
    filters.stockStatus,
    filters.sortPrice
  ].filter(Boolean).length;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border border-indigo-900/50' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
              Active Filters ({activeFiltersCount})
            </span>
            <button
              onClick={clearFilters}
              className={`text-xs px-3 py-1 rounded-full transition-all ${isDarkMode ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="lg:hidden">
        <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Search Products
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange({ ...filters, searchTerm: e.target.value })}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20'
            }`}
          />
          <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
      </div>

      {/* Sort */}
      <div className="lg:hidden">
        <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Sort By Price
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleFilterChange({ ...filters, sortPrice: 'lowToHigh' })}
            className={`py-2.5 px-4 rounded-xl font-medium transition-all duration-300 ${
              filters.sortPrice === 'lowToHigh'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                : isDarkMode
                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Low to High
          </button>
          <button
            onClick={() => handleFilterChange({ ...filters, sortPrice: 'highToLow' })}
            className={`py-2.5 px-4 rounded-xl font-medium transition-all duration-300 ${
              filters.sortPrice === 'highToLow'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                : isDarkMode
                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            High to Low
          </button>
        </div>
      </div>

      {/* Stock Status */}
      <div>
        <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Stock Status
        </label>
        <div className="space-y-2">
          {['', 'In Stock', 'Out of Stock'].map((status) => (
            <label
              key={status || 'all'}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                filters.stockStatus === status
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500'
                    : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-400'
                  : isDarkMode
                  ? 'bg-slate-800/50 hover:bg-slate-800 border-2 border-transparent'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <input
                type="radio"
                checked={filters.stockStatus === status}
                className="w-4 h-4 mr-3 accent-indigo-600"
              />
              <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {status || 'All Status'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Categories
        </label>
        <div className="space-y-2">
          <label
            className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
              filters.category === ''
                                  ? isDarkMode
                                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500'
                                    : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-400'                : isDarkMode
                ? 'bg-slate-800/50 hover:bg-slate-800 border-2 border-transparent'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            <input
              type="radio"
              checked={filters.category === ''}
              className="w-4 h-4 mr-3 accent-indigo-600"
            />
            <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              All Categories
            </span>
          </label>

          {categoriesWithProducts.map(category => (
            <div key={category._id}>
              <div
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  filters.category === category.name
                                      ? isDarkMode
                                        ? 'bg-gradient-to-r from-primary-dark/20 to-primary-dark/20 border-2 border-primary'
                                        : 'bg-gradient-to-r from-primary-light/20 to-primary-light/20 border-2 border-primary-light'                    : isDarkMode
                    ? 'bg-slate-800/50 hover:bg-slate-800 border-2 border-transparent'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                onClick={() => {
                  handleFilterChange({ ...filters, category: category.name, subcategory: '' });
                  setExpandedCategory(expandedCategory === category._id ? null : category._id);
                }}
              >
                <label className="flex items-center flex-1 cursor-pointer">
                  <input
                    type="radio"
                    checked={filters.category === category.name}
                    onChange={() => handleFilterChange({ ...filters, category: category.name, subcategory: '' })}
                    className="w-4 h-4 mr-3 accent-indigo-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {category.name}
                  </span>
                </label>
                {category.subCategories && category.subCategories.length > 0 && (
                  <FaChevronDown
                    className={`text-sm transition-transform duration-300 ${
                      expandedCategory === category._id ? 'rotate-180' : ''
                    } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  />
                )}
              </div>

              <AnimatePresence>
                {expandedCategory === category._id && category.subCategories && category.subCategories.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 ml-6 space-y-2">
                      {category.subCategories.map(subcategory => (
                        <label
                          key={subcategory.name}
                          className={`flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-300 ${
                            filters.subcategory === subcategory.name
                              ? isDarkMode
                                ? 'bg-indigo-600/30 border border-indigo-500'
                                : 'bg-indigo-200 border border-indigo-400'
                              : isDarkMode
                              ? 'bg-slate-800/30 hover:bg-slate-800/50'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            checked={filters.subcategory === subcategory.name}
                            onChange={() => handleFilterChange({ ...filters, subcategory: subcategory.name })}
                                                      className="mr-2 w-3.5 h-3.5 accent-indigo-600"
                                                    />                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {subcategory.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      <Helmet>
        <title>All Products | BestBuy4uBD</title>
        <meta name="description" content="Browse our complete collection of electronics, gadgets, and accessories." />
      </Helmet>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Pills */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2 min-w-max">
            {categoriesWithProducts.map(category => (
              <motion.button
                key={category._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange({ ...filters, category: category.name, subcategory: '' })}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  filters.category === category.name
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : isDarkMode
                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                }`}
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="object-contain w-6 h-6"
                />
                <span className="whitespace-nowrap">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center justify-center w-full gap-3 px-6 py-4 mb-6 text-white shadow-lg rounded-2xl lg:hidden bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/30"
        >
          <FaFilter className="text-lg" />
          <span className="font-semibold">Filters & Search</span>
          {activeFiltersCount > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-bold bg-white text-indigo-600 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className={`fixed right-0 top-0 h-full w-[85%] max-w-md z-50 overflow-y-auto lg:hidden ${
                  isDarkMode ? 'bg-slate-900' : 'bg-white'
                } shadow-2xl`}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-opacity-50 bg-inherit backdrop-blur-lg">
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className={`p-2 rounded-xl transition-colors ${
                      isDarkMode ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                <div className="p-6">
                  <FilterSidebar />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Desktop Sidebar */}
          <div className={`hidden lg:block lg:col-span-1 ${
            isDarkMode ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800' : 'bg-white/80 backdrop-blur-xl border border-gray-200'
          } p-6 rounded-2xl shadow-xl sticky top-8 h-fit`}>
            <FilterSidebar />
          </div>

          {/* Products Section */}
          <div className="lg:col-span-4">
            {/* Desktop Search & Sort */}
            <div className={`hidden lg:flex items-center gap-4 mb-8 p-6 rounded-2xl shadow-lg ${
              isDarkMode ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800' : 'bg-white/80 backdrop-blur-xl border border-gray-200'
            }`}>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange({ ...filters, searchTerm: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold whitespace-nowrap ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Sort:
                </span>
                <button
                  onClick={() => handleFilterChange({ ...filters, sortPrice: 'lowToHigh' })}
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    filters.sortPrice === 'lowToHigh'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : isDarkMode
                      ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Low → High
                </button>
                <button
                  onClick={() => handleFilterChange({ ...filters, sortPrice: 'highToLow' })}
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    filters.sortPrice === 'highToLow'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : isDarkMode
                      ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  High → Low
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[600px]">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  Array.from({ length: productsPerPage }).map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${
                        isDarkMode ? 'bg-slate-800/50' : 'bg-white'
                      } p-4 rounded-2xl shadow-lg`}
                    >
                      <div className={`${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                      } h-48 mb-4 rounded-xl animate-pulse`} />
                      <div className={`${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                      } h-4 w-3/4 mb-3 rounded animate-pulse`} />
                      <div className={`${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                      } h-4 w-1/2 rounded animate-pulse`} />
                    </motion.div>
                  ))
                ) : productsData?.products?.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 col-span-full"
                  >
                    <div className="mb-6 text-8xl">🔍</div>
                    <h3 className={`text-3xl font-bold mb-3 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      No Products Found
                    </h3>
                    <p className={`text-lg mb-6 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Try adjusting your filters or search terms
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 font-medium text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                ) : (
                  productsData?.products?.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {productsData?.pagination?.totalPage > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
                {[...Array(productsData.pagination.totalPage)].map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCurrentPage(pageNumber);
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('page', pageNumber);
                        setSearchParams(newParams);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold transition-all duration-300 ${
                        pageNumber === currentPage
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-110'
                          : isDarkMode
                          ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isLoading}
                    >
                      {pageNumber}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;