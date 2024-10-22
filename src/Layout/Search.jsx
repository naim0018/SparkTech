import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import { useGetAllProductsQuery } from "../redux/api/ProductApi";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const { data: searchResults, isLoading } = useGetAllProductsQuery({
    search: searchTerm,
    limit: 5,
  }, {
    skip: !searchTerm,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="lg:w-[490px] lg:px-5 lg:border border-white rounded-full flex items-center relative search-container">
      <CiSearch className="hidden lg:flex text-xl text-white" />
      <form onSubmit={handleSearch} className="w-full">
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
          disabled
        />
      </form>
      {showSuggestions && searchTerm && !isLoading && searchResults && (
        <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-md shadow-lg z-10">
          {searchResults.data.slice(0, 5).map((product) => (
            <div 
              key={product._id} 
              className="p-2 hover:bg-gray-100 cursor-pointer" 
              onClick={() => {
                navigate(`/product/${product._id}`);
                setShowSuggestions(false);
              }}
            >
              {product.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
