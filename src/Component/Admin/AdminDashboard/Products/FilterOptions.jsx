/* eslint-disable react/prop-types */
import { FaTimes, FaFilter, FaUndo } from 'react-icons/fa';

const FilterOptions = ({ filterOptions, handleFilterChange, categories, brands }) => {
  const handleResetPrice = (field) => {
    handleFilterChange({ target: { name: field, value: '' } });
  };

  const handleResetAllFilters = () => {
    handleFilterChange({ target: { name: 'basicInfo.category', value: '' } });
    handleFilterChange({ target: { name: 'basicInfo.brand', value: '' } });
    handleFilterChange({ target: { name: 'stockStatus', value: '' } });
    handleFilterChange({ target: { name: 'price.regular.min', value: '' } });
    handleFilterChange({ target: { name: 'price.regular.max', value: '' } });
    handleFilterChange({ target: { name: 'sortBy', value: '' } });
    handleFilterChange({ target: { name: 'dateSort', value: '' } });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-200">
        <FaFilter className="mr-3" />
        Product Filters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
          <select
            key="category"
            name="basicInfo.category"
            value={filterOptions.basicInfo?.category || ''}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-150 ease-in-out appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
          >
            <option key="all-categories" value="">All Categories</option>
            {categories.map((category,index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Brand</label>
          <select
            name="basicInfo.brand"
            value={filterOptions.basicInfo?.brand || ''}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-150 ease-in-out appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
          >
            <option key="all-brands" value="">All Brands</option>
            {brands.map((brand,index) => (
              <option key={index} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Stock Status</label>
          <select
            name="stockStatus"
            value={filterOptions.stockStatus || ''}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-150 ease-in-out appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
          >
            <option key="all-stock" value="">All Stock Status</option>
            <option key="in-stock" value="In Stock">In Stock</option>
            <option key="out-of-stock" value="Out of Stock">Out of Stock</option>
            <option key="pre-order" value="Pre-order">Pre-order</option>
          </select>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Min Price</label>
          <div className="relative">
            <input
              type="number"
              name="price.regular.min"
              placeholder="Min Price"
              value={filterOptions.price?.regular?.min || ''}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-150 ease-in-out pr-10"
            />
            {filterOptions.price?.regular?.min && (
              <button 
                onClick={() => handleResetPrice('price.regular.min')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 rounded-full p-1 transition duration-150 ease-in-out"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Max Price</label>
          <div className="relative">
            <input
              type="number"
              name="price.regular.max"
              placeholder="Max Price"
              value={filterOptions.price?.regular?.max || ''}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-150 ease-in-out pr-10"
            />
            {filterOptions.price?.regular?.max && (
              <button
                onClick={() => handleResetPrice('price.regular.max')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 rounded-full p-1 transition duration-150 ease-in-out"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Sort By Price</label>
          <select
            name="sortBy"
            value={filterOptions.sortBy || ''}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-150 ease-in-out appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
          >
            <option key="default-sort" value="">Default</option>
            <option key="price-asc" value="price_asc">Price: Low to High</option>
            <option key="price-desc" value="price_desc">Price: High to Low</option>
          </select>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Sort By Date</label>
          <select
            name="dateSort"
            value={filterOptions.dateSort || ''}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-150 ease-in-out appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
          >
            <option key="default-date" value="">Default</option>
            <option key="newest" value="newest">Newest</option>
            <option key="oldest" value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleResetAllFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center"
        >
          <FaUndo className="mr-2" />
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterOptions;
