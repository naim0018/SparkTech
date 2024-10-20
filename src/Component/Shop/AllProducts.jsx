import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaTags, FaIndustry, FaCheckCircle, FaSortAmountDown } from 'react-icons/fa';
import { useGetAllProductsQuery, useGetAllBrandsAndCategoriesQuery } from "../../redux/api/ProductApi";
import ProductCard from "./ProductCard";
import { useTheme } from "../../ThemeContext";


const AllProducts = () => {
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});

  const [filterOptions, setFilterOptions] = useState({
    category: [],
    brand: [],
    stockStatus: [],
    priceSort: 'default',
    priceRange: { min: 0, max: 10000 },
    rating: 0
  });

  const [queryFilters, setQueryFilters] = useState({});

  const { data: productsData, isLoading, isError } = useGetAllProductsQuery(queryFilters);
  const { data: brandsAndCategories } = useGetAllBrandsAndCategoriesQuery();

  useEffect(() => {
    const newQueryFilters = {
      page: currentPage,
      limit: productsPerPage,
      search: searchTerm,
      sort: filterOptions.priceSort === 'lowToHigh' ? 'price.regular' : filterOptions.priceSort === 'highToLow' ? '-price.regular' : '-createdAt',
      category: filterOptions.category,
      brand: filterOptions.brand,
      stockStatus: filterOptions.stockStatus,
      priceMin: filterOptions.priceRange.min,
      priceMax: filterOptions.priceRange.max,
      rating: filterOptions.rating
    };

    setQueryFilters(newQueryFilters);
  }, [filterOptions, searchTerm, currentPage, productsPerPage]);

  useEffect(() => {
    if (productsData) {
      setFilteredProducts(productsData.products);
      setPaginationInfo(productsData.pagination);
    }
  }, [productsData]);

  useEffect(() => {
    if (brandsAndCategories) {
      setBrands(brandsAndCategories.brands);
      setCategories(brandsAndCategories.categories);
    }
  }, [brandsAndCategories]);

  if (isLoading) return <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Loading...</div>;
  if (isError) return <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Error loading products</div>;

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === 'reset') {
      setFilterOptions({
        category: [],
        brand: [],
        stockStatus: [],
        priceSort: 'default',
        priceRange: { min: 0, max: 10000 },
        rating: 0
      });
    } else {
      setFilterOptions(prev => ({ ...prev, [name]: value }));
    }
    setCurrentPage(1);
  };

  const handleCheckboxChange = (name, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterOptions({
      category: [],
      brand: [],
      stockStatus: [],
      priceSort: 'default',
      priceRange: { min: 0, max: 10000 },
      rating: 0
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const FilterOptions = () => (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">RefineResults</h2>
        <button
          onClick={resetFilters}
          className={`text-sm px-4 py-2 rounded-full ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition duration-300 font-semibold flex items-center`}
        >
          <FaFilter className="mr-2" />
          ClearAll
        </button>
      </div>

      <div className="space-y-6">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="font-semibold mb-3 flex items-center">
            <FaCheckCircle className="text-green-500 mr-2" />
            Availability
          </h3>
          {['In Stock', 'Out of Stock', 'Pre-order'].map((status) => (
            <label key={status} className="flex items-center cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={filterOptions.stockStatus.includes(status)}
                onChange={() => handleCheckboxChange('stockStatus', status)}
                className="mr-3 w-5 h-5"
              />
              <span className="text-lg">{status}</span>
            </label>
          ))}
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="font-semibold mb-3 flex items-center">
            <FaSortAmountDown className="text-yellow-500 mr-2" />
            PriceRange
          </h3>
          <div className="space-y-2">
            {['default', 'lowToHigh', 'highToLow'].map((sort) => (
              <label key={sort} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priceSort"
                  value={sort}
                  checked={filterOptions.priceSort === sort}
                  onChange={(e) => handleFilterChange({
                    target: { name: 'priceSort', value: e.target.value }
                  })}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-sm">{sort === 'default' ? 'Default' : sort === 'lowToHigh' ? 'Price: Low to High' : 'Price: High to Low'}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="font-semibold mb-3 flex items-center">
            <FaTags className="text-blue-500 mr-2" />
            Categories
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categories.map((category) => (
              <label key={category} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterOptions.category.includes(category)}
                  onChange={() => handleCheckboxChange('category', category)}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-sm capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="font-semibold mb-3 flex items-center">
            <FaIndustry className="text-purple-500 mr-2" />
            Brands
          </h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterOptions.brand.includes(brand)}
                  onChange={() => handleCheckboxChange('brand', brand)}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-sm capitalize">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>
        
        <div className="flex flex-col lg:flex-row">
          {/* Filter sidebar */}
          <div className={`lg:w-80 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg mb-4 lg:mb-0 lg:mr-6`}>
            <FilterOptions />
          </div>
          
          {/* Main content */}
          <div className="flex-grow">
            {/* Search and sort */}
            <div className={`mb-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} px-4 sm:px-6 py-5 rounded-lg shadow-md`}>
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
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
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label htmlFor="sortBy" className={`mr-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sort by:</label>
                    <select
                      id="sortBy"
                      className={`p-2 rounded-lg shadow-sm cursor-pointer transition-all duration-300 ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                      }`}
                      value={filterOptions.priceSort}
                      onChange={(e) => handleFilterChange({ target: { name: 'priceSort', value: e.target.value } })}
                    >
                      <option value="default">Default</option>
                      <option value="lowToHigh">Price: Low to High</option>
                      <option value="highToLow">Price: High to Low</option>
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
                        setProductsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                      <option value={40}>40</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-l-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Previous
              </button>
              <span className={`px-4 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                Page {currentPage} of {paginationInfo.totalPage || 1}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, paginationInfo.totalPage || 1))}
                disabled={currentPage === (paginationInfo.totalPage || 1)}
                className={`px-4 py-2 rounded-r-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Next
              </button>
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
      <div className={`fixed inset-0 z-50 lg:hidden ${showMobileFilters ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowMobileFilters(false)}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 overflow-y-auto`}>
          <FilterOptions />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
