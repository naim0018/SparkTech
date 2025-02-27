import { CiSearch } from "react-icons/ci";
import { useState, useEffect, useRef } from "react";
import { useGetAllProductsQuery } from "../redux/api/ProductApi";
import { useNavigate } from "react-router-dom";
import { TbCurrencyTaka } from "react-icons/tb";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Get all products and filter on frontend
  const { data: productsData, isLoading } = useGetAllProductsQuery({
    limit: 20 // Get more products for better search results
  }, {
    skip: !searchTerm || searchTerm.length < 2,
  });

  // Filter products based on search term
  const filteredProducts = productsData?.products?.filter(product => 
    product.basicInfo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.basicInfo.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.basicInfo.brand.toLowerCase().includes(searchTerm.toLowerCase())
  )?.slice(0, 5); // Only show first 5 results

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="lg:w-[490px] lg:px-5 lg:border border-white rounded-full relative search-container">
      <form onSubmit={handleSearch} className="flex items-center w-full">
        <CiSearch className="hidden lg:flex text-xl text-white" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search products"
          className="hidden lg:flex outline-none py-2 bg-transparent w-full text-white font-normal px-4 placeholder:text-[#6c727f]"
        />
      </form>

      {/* Search Suggestions */}
      {showSuggestions && searchTerm.length >= 2 && !isLoading && filteredProducts && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 mt-2 rounded-lg shadow-lg z-50 overflow-hidden">
          {filteredProducts.length > 0 ? (
            <>
              {filteredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-0" 
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                    setShowSuggestions(false);
                    setSearchTerm("");
                  }}
                >
                  <img 
                    src={product.images[0]?.url} 
                    alt={product.basicInfo.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {product.basicInfo.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {product.basicInfo.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <TbCurrencyTaka className="text-lg" />
                        <span>{product.price.discounted || product.price.regular}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleSearch}
                className="w-full p-3 text-center text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
              >
                View all results
              </button>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
