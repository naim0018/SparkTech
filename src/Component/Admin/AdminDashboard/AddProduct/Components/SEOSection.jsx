import PropTypes from 'prop-types';

const SEOSection = ({ register, errors, isDarkMode }) => {
  return (
    <div className={`mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            SEO Information
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Optional: Fill these fields to improve your product&apos;s SEO
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className={`block mb-1 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Meta Title
            <span className="text-xs text-gray-400 ml-1">(optional)</span>
          </span>
          <input
            {...register("seo.metaTitle", {
              maxLength: {
                value: 60,
                message: "Meta title should be less than 60 characters"
              }
            })}
            placeholder="Enter meta title"
            className={`w-full p-3 border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
          />
          {errors.seo?.metaTitle && (
            <span className="text-red-500 text-sm mt-1">{errors.seo.metaTitle.message}</span>
          )}
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Recommended length: 50-60 characters
          </p>
        </label>

        <label className="block">
          <span className={`block mb-1 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Meta Description
            <span className="text-xs text-gray-400 ml-1">(optional)</span>
          </span>
          <textarea
            {...register("seo.metaDescription", {
              maxLength: {
                value: 160,
                message: "Meta description should be less than 160 characters"
              }
            })}
            placeholder="Enter meta description"
            rows="3"
            className={`w-full p-3 border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
          />
          {errors.seo?.metaDescription && (
            <span className="text-red-500 text-sm mt-1">{errors.seo.metaDescription.message}</span>
          )}
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Recommended length: 150-160 characters
          </p>
        </label>

        <label className="block">
          <span className={`block mb-1 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            URL Slug
            <span className="text-xs text-gray-400 ml-1">(optional)</span>
          </span>
          <input
            {...register("seo.slug")}
            placeholder="Enter URL slug (e.g., premium-leather-wallet-brown/)"
            className={`w-full p-3 border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Use lowercase letters, numbers and hyphens only. Add a trailing slash (e.g., product-name/)
          </p>
        </label>
      </div>
    </div>
  );
};

SEOSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

export default SEOSection; 