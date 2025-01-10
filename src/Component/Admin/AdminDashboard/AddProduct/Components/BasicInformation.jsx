import PropTypes from 'prop-types';
import { useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash } from 'react-icons/fa';

const BasicInformation = ({ register, errors, control, isDarkMode }) => {
  const {
    fields: keyFeatureFields,
    append: appendKeyFeature,
    remove: removeKeyFeature,
  } = useFieldArray({
    control,
    name: "basicInfo.keyFeatures",
  });

  const fixedCategory = [
    "Home & Kitchen", 
    "Fashion", 
    "Beauty & Personal Care", 
    "Toys & Games", 
    "Sports & Outdoors", 
    "Health & Wellness", 
    "Books & Office Supplies", 
    "Pet Supplies"
  ];

  return (
    <div className={`mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
        Basic Information
      </h2>
      <div className="space-y-4">
        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Product Code</span>
          <input
            {...register("basicInfo.productCode")}
            placeholder="Enter product code"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Leave blank for auto-generated code</p>
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Title</span>
          <input
            {...register("basicInfo.title", { required: "Title is required" })}
            placeholder="Enter product title"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.basicInfo?.title && (
            <span className="text-red-500">{errors.basicInfo.title.message}</span>
          )}
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Brand</span>
          <input
            {...register("basicInfo.brand", { required: "Brand is required" })}
            placeholder="Enter brand name"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.basicInfo?.brand && (
            <span className="text-red-500">{errors.basicInfo.brand.message}</span>
          )}
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Category</span>
          <select
            {...register("basicInfo.category", { required: "Category is required" })}
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          >
            <option value="">Select category</option>
            {fixedCategory.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          {errors.basicInfo?.category && (
            <span className="text-red-500">{errors.basicInfo.category.message}</span>
          )}
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Subcategory</span>
          <input
            {...register("basicInfo.subcategory")}
            placeholder="Enter product subcategory"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
        </label>

        <label className="block">
          <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Description</span>
          <textarea
            {...register("basicInfo.description", { required: "Description is required" })}
            placeholder="Enter product description"
            rows="4"
            className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.basicInfo?.description && (
            <span className="text-red-500">{errors.basicInfo.description.message}</span>
          )}
        </label>

        <div className="mb-4">
          <label className="block mb-2">
            <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Key Features
              <span className="text-xs text-gray-400 ml-2">(optional)</span>
            </span>
            <div className="space-y-2">
              {keyFeatureFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`basicInfo.keyFeatures.${index}`)}
                    placeholder="Enter a key feature"
                    className={`flex-1 p-3 border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  <button
                    type="button"
                    onClick={() => removeKeyFeature(index)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </label>
          <button
            type="button"
            onClick={() => appendKeyFeature("")}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FaPlus className="w-4 h-4" />
            Add Feature
          </button>
        </div>
      </div>
    </div>
  );
};

BasicInformation.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  control: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

export default BasicInformation; 