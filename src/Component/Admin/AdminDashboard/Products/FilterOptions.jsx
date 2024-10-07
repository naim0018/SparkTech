import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

const FilterOptions = ({ filterOptions, handleFilterChange, categories, brands }) => {
  const handleResetPrice = (field) => {
    handleFilterChange({ target: { name: field, value: '' } });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <select
        name="category"
        value={filterOptions.category}
        onChange={handleFilterChange}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <select
        name="brand"
        value={filterOptions.brand}
        onChange={handleFilterChange}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Brands</option>
        {brands.map(brand => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>
      <div className="relative">
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filterOptions.minPrice}
          onChange={handleFilterChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
        />
        {filterOptions.minPrice && (
          <button
            onClick={() => handleResetPrice('minPrice')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <div className="relative">
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filterOptions.maxPrice}
          onChange={handleFilterChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
        />
        {filterOptions.maxPrice && (
          <button
            onClick={() => handleResetPrice('maxPrice')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <select
        name="stockStatus"
        value={filterOptions.stockStatus}
        onChange={handleFilterChange}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Stock Status</option>
        <option value="In Stock">In Stock</option>
        <option value="Out of Stock">Out of Stock</option>
        <option value="Pre-order">Pre-order</option>
      </select>
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
