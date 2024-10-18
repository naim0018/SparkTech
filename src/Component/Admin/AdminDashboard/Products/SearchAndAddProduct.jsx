/* eslint-disable react/prop-types */
import { FaSearch } from 'react-icons/fa';

const SearchAndAddProduct = ({ handleSearch, handleSearchBlur, searchTerm }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 dark:bg-gray-800 dark:text-gray-200">
      <div className="relative w-full md:w-64 mb-4 md:mb-0">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
          value={searchTerm}
          onChange={handleSearch}
          onBlur={handleSearchBlur}
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      </div>
     
    </div>
  );
};

export default SearchAndAddProduct;
