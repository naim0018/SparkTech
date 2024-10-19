/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useGetAllBrandsAndCategoriesQuery } from '../../redux/api/ProductApi';
import { useTheme } from '../../ThemeContext';
import { FaFilter, FaTags, FaIndustry, FaCheckCircle } from 'react-icons/fa';

const FilterOptions = ({ filterOptions, handleFilterChange }) => {
  const { isDarkMode } = useTheme();
  const { data: brandsAndCategories } = useGetAllBrandsAndCategoriesQuery();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const renderSection = (title, content, icon) => (
    <div className={`mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4`}>
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="font-semibold ml-2">{title}</h3>
      </div>
      <div className="mt-2">
        {content}
      </div>
    </div>
  );

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
        <h2 className="text-2xl font-bold">Filters</h2>
        <FaFilter className="text-2xl text-blue-500" />
      </div>

      {renderSection("Category", (
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filterOptions.category.includes(category)}
                onChange={() => handleCheckboxChange('category', category)}
                className="mr-2"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      ), <FaTags className="text-blue-500" />)}

      {renderSection("Brand", (
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                checked={filterOptions.brand.includes(brand)}
                onChange={() => handleCheckboxChange('brand', brand)}
                className="mr-2"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      ), <FaIndustry className="text-blue-500" />)}

      {renderSection("Availability", (
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filterOptions.inStock}
              onChange={() => handleFilterChange({
                target: {
                  name: 'inStock',
                  value: !filterOptions.inStock
                }
              })}
              className="mr-2"
            />
            <span>In Stock</span>
          </label>
        </div>
      ), <FaCheckCircle className="text-blue-500" />)}

      <button
        onClick={resetFilters}
        className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition duration-300 mt-6 font-semibold`}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterOptions;
