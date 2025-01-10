import PropTypes from 'prop-types';

const StockInformation = ({ register, errors, isDarkMode }) => {
  return (
    <div className={`mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
        Stock Information
      </h2>
      <div className="space-y-4">
        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Stock Status</span>
          <select
            {...register("stockStatus", { required: "Stock status is required" })}
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Pre-order">Pre-order</option>
          </select>
          {errors.stockStatus && (
            <span className="text-red-500">{errors.stockStatus.message}</span>
          )}
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Stock Quantity</span>
          <input
            {...register("stockQuantity", {
              required: "Stock quantity is required",
              min: 0,
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Enter stock quantity"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.stockQuantity && (
            <span className="text-red-500">{errors.stockQuantity.message}</span>
          )}
        </label>
      </div>
    </div>
  );
};

StockInformation.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

export default StockInformation; 