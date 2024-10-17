import PropTypes from 'prop-types';
import { FaTimes, FaFilter } from 'react-icons/fa';

const FilterOptions = ({ filterOptions, handleFilterChange, categories, brands }) => {
  const handleResetPrice = (field) => {
    handleFilterChange({ target: { name: field, value: '' } });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
        <FaFilter className="mr-2" />
        Filter Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block  text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            name="category"
            value={filterOptions.category}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
          <select
            name="brand"
            value={filterOptions.brand}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Status</label>
          <select
            name="stockStatus"
            value={filterOptions.stockStatus}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="">All Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Pre-order">Pre-order</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Price</label>
          <div className="relative">
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filterOptions.minPrice}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {filterOptions.minPrice && (
              <button
                onClick={() => handleResetPrice('minPrice')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Price</label>
          <div className="relative">
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filterOptions.maxPrice}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {filterOptions.maxPrice && (
              <button
                onClick={() => handleResetPrice('maxPrice')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

FilterOptions.propTypes = {
  filterOptions: PropTypes.shape({
    category: PropTypes.string,
    brand: PropTypes.string,
    minPrice: PropTypes.string,
    maxPrice: PropTypes.string,
    stockStatus: PropTypes.string
  }).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  brands: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default FilterOptions;
