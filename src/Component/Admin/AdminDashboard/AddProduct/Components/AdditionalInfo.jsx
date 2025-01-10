import PropTypes from 'prop-types';

const AdditionalInfo = ({ register, isDarkMode }) => {
  return (
    <div className={`mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
        Additional Information
      </h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("additionalInfo.freeShipping")}
            className="w-4 h-4 text-blue-600"
          />
          <label className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Free Shipping
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("additionalInfo.isFeatured")}
            className="w-4 h-4 text-blue-600"
          />
          <label className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Featured Product
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("additionalInfo.isOnSale")}
            className="w-4 h-4 text-blue-600"
          />
          <label className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            On Sale
          </label>
        </div>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Estimated Delivery
          </span>
          <input
            {...register("additionalInfo.estimatedDelivery")}
            placeholder="e.g., 3-5 business days"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Return Policy
          </span>
          <textarea
            {...register("additionalInfo.returnPolicy")}
            placeholder="Enter return policy details"
            rows="3"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Warranty Information
          </span>
          <textarea
            {...register("additionalInfo.warranty")}
            placeholder="Enter warranty information"
            rows="3"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
        </label>
      </div>
    </div>
  );
};

AdditionalInfo.propTypes = {
  register: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

export default AdditionalInfo; 