// Import necessary hooks and components
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '../redux/features/SearchSlice';
import { CiSearch } from 'react-icons/ci';
import { useGetAllProductsQuery } from '../redux/api/ProductApi';

const Search = () => {
  // State for search query and suggestions
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  // Hooks for navigation and dispatching actions
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch all products using RTK Query
  const { data: products } = useGetAllProductsQuery();

  // Effect to update suggestions based on query and products
  useEffect(() => {
    if (query.length > 0 && products?.data) {
      // Filter and map products to suggestions
      const filteredSuggestions = products.data
        .filter(product => 
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10) // Limit to 10 suggestions
        .map(product => ({
          id: product._id,
          title: product.title,
          brand: product.brand,
          category: product.category
        }));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, products]);

  // Handle form submission for search
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(query));
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  // Handle click on a suggestion
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    setSuggestions([]);
    dispatch(setSearchTerm(suggestion.title));

    // Navigate based on the type of suggestion
    if (suggestion.id) {
      // If it's a product (has an id), go to the product details page
      navigate(`/product/${suggestion.id}`);
    } else if (suggestion.brand) {
      // If it's a brand, go to the brand shop page
      navigate(`/brand/${encodeURIComponent(suggestion.brand)}`);
    } else if (suggestion.category) {
      // If it's a category, go to the category shop page
      navigate(`/category/${encodeURIComponent(suggestion.category)}`);
    } else {
      // Fallback to the search results page
      navigate(`/products?search=${encodeURIComponent(suggestion.title)}`);
    }
  };

  return (
    <div className="lg:w-[490px] lg:px-5 lg:border border-white rounded-full flex items-center relative">
      <CiSearch className="hidden lg:flex text-xl text-white" />
      <form onSubmit={handleSearch} className="w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the products"
          className="hidden lg:flex outline-none py-2 bg-transparent w-full text-white font-normal px-4 placeholder:text-[#6c727f]"
        />
      </form>
      {/* Display suggestions if available */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 shadow-lg top-full left-0">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id || suggestion.brand || suggestion.category}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium">{suggestion.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {suggestion.brand} - {suggestion.category}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
