import PropTypes from 'prop-types';

const ShippingDetails = ({ register, errors, isDarkMode }) => {
  return (
    <div className={`mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
        Shipping Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Length</span>
          <input
            {...register("shippingDetails.length", {
              required: "Length is required",
              min: 0,
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Enter length"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.shippingDetails?.length && (
            <span className="text-red-500">{errors.shippingDetails.length.message}</span>
          )}
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Width</span>
          <input
            {...register("shippingDetails.width", {
              required: "Width is required",
              min: 0,
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Enter width"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.shippingDetails?.width && (
            <span className="text-red-500">{errors.shippingDetails.width.message}</span>
          )}
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Height</span>
          <input
            {...register("shippingDetails.height", {
              required: "Height is required",
              min: 0,
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Enter height"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.shippingDetails?.height && (
            <span className="text-red-500">{errors.shippingDetails.height.message}</span>
          )}
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Weight</span>
          <input
            {...register("shippingDetails.weight", {
              required: "Weight is required",
              min: 0,
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Enter weight"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.shippingDetails?.weight && (
            <span className="text-red-500">{errors.shippingDetails.weight.message}</span>
          )}
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Dimension Unit</span>
          <select
            {...register("shippingDetails.dimensionUnit")}
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          >
            <option value="cm">Centimeters (cm)</option>
            <option value="in">Inches (in)</option>
          </select>
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Weight Unit</span>
          <select
            {...register("shippingDetails.weightUnit")}
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          >
            <option value="kg">Kilograms (kg)</option>
            <option value="lb">Pounds (lb)</option>
          </select>
        </label>
      </div>
    </div>
  );
};

ShippingDetails.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

export default ShippingDetails; 