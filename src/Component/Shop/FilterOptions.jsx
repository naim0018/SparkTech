/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useGetAllBrandsAndCategoriesQuery } from '../../redux/api/ProductApi';
import { useTheme } from '../../ThemeContext';
import { FaFilter, FaTags, FaIndustry, FaCheckCircle, FaSortAmountDown } from 'react-icons/fa';

const FilterOptions = ({ filterOptions, handleFilterChange }) => {
  const { isDarkMode } = useTheme();
  const { data: brandsAndCategories } = useGetAllBrandsAndCategoriesQuery();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState();

  useEffect(() => {
    if (brandsAndCategories) {
      setBrands(brandsAndCategories.brands);
      setCategories(brandsAndCategories.categories);
    }
  }, [brandsAndCategories]);

  const resetFilters = () => {
    handleFilterChange({
      target: {
        name: 'reset',
        value: ''
      }
    });
  };

  const handleCheckboxChange = (name, value) => {
    handleFilterChange({
      target: {
        name,
        value: filterOptions[name].includes(value)
          ? filterOptions[name].filter(item => item !== value)
          : [...filterOptions[name], value]
      }
    });
  };

  return (
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
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filterOptions.inStock}
              onChange={() => handleFilterChange({
                target: {
                  name: 'inStock',
                  value: !filterOptions.inStock
                }
              })}
              className="mr-3 w-5 h-5"
            />
            <span className="text-lg">InStock</span>
          </label>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="font-semibold mb-3 flex items-center">
            <FaSortAmountDown className="text-yellow-500 mr-2" />
            PriceRange
          </h3>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="priceSort"
                value="default"
                checked={filterOptions.priceSort === 'default'}
                onChange={(e) => handleFilterChange({
                  target: { name: 'priceSort', value: e.target.value }
                })}
                className="mr-3 w-4 h-4"
              />
              <span className="text-sm">Default</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="priceSort"
                value="lowToHigh"
                checked={filterOptions.priceSort === 'lowToHigh'}
                onChange={(e) => handleFilterChange({
                  target: { name: 'priceSort', value: e.target.value }
                })}
                className="mr-3 w-4 h-4"
              />
              <span className="text-sm">PriceLowToHigh</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="priceSort"
                value="highToLow"
                checked={filterOptions.priceSort === 'highToLow'}
                onChange={(e) => handleFilterChange({
                  target: { name: 'priceSort', value: e.target.value }
                })}
                className="mr-3 w-4 h-4"
              />
              <span className="text-sm">PriceHighToLow</span>
            </label>
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
};

export default FilterOptions;
