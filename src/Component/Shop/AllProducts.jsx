// Importing necessary dependencies and components
import { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { useGetAllProductsQuery } from "../../redux/api/ProductApi";
import ProductCard from "./ProductCard";
import { useTheme } from "../../ThemeContext"; // Import useTheme hook for dark mode
import FilterOptions from "./FilterOptions";

const AllProducts = () => {
  // Use the useTheme hook to access dark mode state
  const { isDarkMode } = useTheme();

  // State variables for pagination, sorting, filtering, and UI control
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: 'default'
  });

  // Fetching products data using Redux query
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery();

  // Effect to filter and sort products when data or filters change
  useEffect(() => {
    if (productsData?.data) {
      let sorted = [...productsData.data];
      
      // Apply filters
      sorted = sorted.filter(product => {
        if (filterOptions.category && product.category !== filterOptions.category) return false;
        if (filterOptions.brand && product.brand !== filterOptions.brand) return false;
        if (filterOptions.minPrice && product.price.regular < Number(filterOptions.minPrice)) return false;
        if (filterOptions.maxPrice && product.price.regular > Number(filterOptions.maxPrice)) return false;
        return true;
      });

      // Apply sorting
      if (filterOptions.sort === "price-low-high") {
        sorted.sort((a, b) => a.price.regular - b.price.regular);
      } else if (filterOptions.sort === "price-high-low") {
        sorted.sort((a, b) => b.price.regular - a.price.regular);
      }

      setFilteredProducts(sorted);
    }
  }, [productsData, filterOptions]);

  // Loading and error states
  if (isLoading)
    return (
      <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Error loading products
      </div>
    );

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'reset') {
      setFilterOptions({
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        sort: 'default'
      });
    } else {
      setFilterOptions(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className={`max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
      <div className="flex flex-col lg:flex-row">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`w-full ${isDarkMode ? 'bg-blue-700' : 'bg-blue-500'} text-white py-2 px-4 rounded flex items-center justify-center`}
          >
            <FaFilter className="mr-2" />{" "}
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Main content area */}
        <div className="w-full">
          {/* Header section */}
          <div className="w-full mb-4 mt-4">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 border-t border-gray-100 rounded-lg shadow-md`}>
              <div className="flex justify-end">
                <div className="flex items-center space-x-4">
                  {/* Products per page selector */}
                  <div className="flex items-center">
                    <span className="mr-2">Show:</span>
                    <select
                      className={`border px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'}`}
                      value={productsPerPage}
                      onChange={(e) => setProductsPerPage(Number(e.target.value))}
                    >
                      {[20, 40, 60].map((value) => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  {/* Sort by selector */}
                  <div className="flex items-center">
                    <span className="mr-2">Sort By:</span>
                    <select
                      className={`border px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'}`}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      {[
                        { value: "default", label: "Default" },
                        { value: "price-low-high", label: "Price: Low to High" },
                        { value: "price-high-low", label: "Price: High to Low" }
                      ].map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Filters */}
            <div
              className={`w-full lg:w-1/4 xl:w-1/5 lg:pr-4 mb-4 lg:mb-0 ${
                showMobileFilters ? "block" : "hidden lg:block"
              }`}
            >
              <FilterOptions
                filterOptions={filterOptions}
                handleFilterChange={handleFilterChange}
              />
            </div>
            {/* Product grid */}
            <div className="w-full lg:w-3/4 xl:w-4/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-md sm:rounded-l-md mb-2 sm:mb-0 w-full sm:w-auto`}
            >
              Previous
            </button>
            <span className={`px-4 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} mb-2 sm:mb-0`}>
              Page {currentPage} of{" "}
              {Math.ceil(filteredProducts.length / productsPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredProducts.length / productsPerPage)
                  )
                )
              }
              disabled={
                currentPage ===
                Math.ceil(filteredProducts.length / productsPerPage)
              }
              className={`px-4 py-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-md sm:rounded-r-md w-full sm:w-auto`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
