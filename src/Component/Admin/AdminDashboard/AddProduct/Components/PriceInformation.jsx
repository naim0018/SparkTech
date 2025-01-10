import PropTypes from 'prop-types';

const PriceInformation = ({ register, errors, isDarkMode }) => {
  return (
    <div className={`mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
        Price Information
      </h2>
      <div className="space-y-4">
        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Regular Price</span>
          <input
            {...register("price.regular", {
              required: "Regular price is required",
              min: 0,
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Enter regular price"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.price?.regular && (
            <span className="text-red-500">{errors.price.regular.message}</span>
          )}
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Discounted Price (Optional)</span>
          <input
            {...register("price.discounted", {
              min: 0,
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Enter discounted price"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.price?.discounted && (
            <span className="text-red-500">{errors.price.discounted.message}</span>
          )}
        </label>
      </div>
    </div>
  );
};

PriceInformation.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

export default PriceInformation; 