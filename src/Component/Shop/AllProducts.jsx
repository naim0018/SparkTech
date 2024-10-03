// Importing necessary dependencies and components
import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaFilter } from "react-icons/fa";
import { useGetAllProductsQuery } from "../../redux/api/ProductApi";
import ProductCard from "./ProductCard";

const AllProducts = () => {
  // State variables for pagination, sorting, filtering, and UI control
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    inStock: false,
    brands: [],
    priceRange: { min: 0, max: 20000 },
  });
  const [expandedFilters, setExpandedFilters] = useState({
    availability: true,
    brand: true,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetching products data using Redux query
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery();

  // Effect to filter and sort products when data or filters change
  useEffect(() => {
    if (productsData?.data) {
      let sorted = [...productsData.data];
      // Sorting logic
      if (sortBy === "price-low-high") {
        sorted.sort((a, b) => a.price.regular - b.price.regular);
      } else if (sortBy === "price-high-low") {
        sorted.sort((a, b) => b.price.regular - a.price.regular);
      }

      // Filtering logic
      sorted = sorted.filter((product) => {
        if (filters.inStock && product.stockStatus !== "In Stock") return false;
        if (filters.brands.length && !filters.brands.includes(product.brand))
          return false;
        if (
          product.price.regular < filters.priceRange.min ||
          product.price.regular > filters.priceRange.max
        )
          return false;
        return true;
      });

      setFilteredProducts(sorted);
    }
  }, [productsData, sortBy, filters]);

  // Loading and error states
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen">
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

  // Extracting unique brands for filter
  const brands = [
    ...new Set(productsData?.data.map((product) => product.brand)),
  ];

  // Function to toggle filter expansion
  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Filters component
  const Filters = () => (
    <div className="bg-white border rounded-lg shadow-md p-3">
      <h2 className="text-lg font-bold mb-3">Filters</h2>

      {/* Price Range Filter */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1 text-sm">Price Range</h3>
        <div className="flex flex-col space-y-1">
          <input
            type="range"
            min="0"
            max="20000"
            value={filters.priceRange.max}
            onChange={(e) =>
              setFilters({
                ...filters,
                priceRange: {
                  ...filters.priceRange,
                  max: Number(e.target.value),
                },
              })
            }
            className="w-full"
          />
          <div className="flex justify-between">
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: {
                    ...filters.priceRange,
                    min: Number(e.target.value),
                  },
                })
              }
              className="w-16 p-1 border rounded text-center text-sm"
              placeholder="Min"
            />
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: {
                    ...filters.priceRange,
                    max: Number(e.target.value),
                  },
                })
              }
              className="w-16 p-1 border rounded text-center text-sm"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Availability Filter */}
      <div className="mb-3 border-t pt-3">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleFilter("availability")}
        >
          <h3 className="font-semibold text-sm">Availability</h3>
          {expandedFilters.availability ? (
            <FaChevronUp size={12} />
          ) : (
            <FaChevronDown size={12} />
          )}
        </div>
        {expandedFilters.availability && (
          <div className="mt-1">
            {["In Stock", "Pre Order", "Up Coming"].map((status) => (
              <label key={status} className="flex items-center mt-1 text-sm">
                <input
                  type="checkbox"
                  checked={filters.availability === status}
                  onChange={() =>
                    setFilters({ ...filters, availability: status })
                  }
                  className="mr-2"
                />
                {status}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="mb-3 border-t pt-3">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleFilter("brand")}
        >
          <h3 className="font-semibold text-sm">Brand</h3>
          {expandedFilters.brand ? (
            <FaChevronUp size={12} />
          ) : (
            <FaChevronDown size={12} />
          )}
        </div>
        {expandedFilters.brand && (
          <div className="mt-1 max-h-36 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center mt-1 text-sm">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={(e) => {
                    const updatedBrands = e.target.checked
                      ? [...filters.brands, brand]
                      : filters.brands.filter((b) => b !== brand);
                    setFilters({ ...filters, brands: updatedBrands });
                  }}
                  className="mr-2"
                />
                {brand}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            <FaFilter className="mr-2" />{" "}
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Main content area */}
        <div className="w-full">
          {/* Header section */}
          <div className="w-full mb-4 mt-4">
            <div className="bg-white p-4 border-t border-gray-100 rounded-lg shadow-md">
              <div className="flex justify-end">
                <div className="flex items-center space-x-4">
                  {/* Products per page selector */}
                  <div className="flex items-center">
                    <span className="mr-2">Show:</span>
                    <select
                      className="border px-2 py-1 rounded"
                      value={productsPerPage}
                      onChange={(e) => setProductsPerPage(Number(e.target.value))}
                    >
                      <option value={20}>20</option>
                      <option value={40}>40</option>
                      <option value={60}>60</option>
                    </select>
                  </div>
                  {/* Sort by selector */}
                  <div className="flex items-center">
                    <span className="mr-2">Sort By:</span>
                    <select
                      className="border px-2 py-1 rounded"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">Default</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
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
              <Filters />
            </div>
            {/* Product grid */}
            <div className="w-full lg:w-3/4 xl:w-4/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md sm:rounded-l-md mb-2 sm:mb-0 w-full sm:w-auto"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-100 mb-2 sm:mb-0">
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
              className="px-4 py-2 bg-gray-200 rounded-md sm:rounded-r-md w-full sm:w-auto"
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
