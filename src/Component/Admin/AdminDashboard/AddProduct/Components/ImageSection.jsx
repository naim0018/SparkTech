import PropTypes from 'prop-types';
import { useFieldArray } from "react-hook-form";

const ImageSection = ({ control, register, errors, isDarkMode }) => {
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });

  return (
    <div className={`mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
        Product Images
      </h2>
      <div className="space-y-4">
        {imageFields.map((field, index) => (
          <div key={field.id} className="flex flex-col space-y-4 p-4 border-2 border-gray-200 rounded-lg">
            <label className="block">
              <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Image URL</span>
              <input
                {...register(`images.${index}.url`, {
                  required: "Image URL is required",
                  pattern: {
                    value: /^(http|https):\/\/.+/,
                    message: "Please enter a valid URL"
                  }
                })}
                placeholder="Enter image URL"
                className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
              />
              {errors.images?.[index]?.url && (
                <span className="text-red-500">{errors.images[index].url.message}</span>
              )}
            </label>

            <label className="block">
              <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Image Alt Text</span>
              <input
                {...register(`images.${index}.alt`, {
                  required: "Alt text is required"
                })}
                placeholder="Enter image alt text"
                className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
              />
              {errors.images?.[index]?.alt && (
                <span className="text-red-500">{errors.images[index].alt.message}</span>
              )}
            </label>

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
            >
              Remove Image
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendImage({ url: "", alt: "" })}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
        >
          Add Image
        </button>
      </div>
    </div>
  );
};

ImageSection.propTypes = {
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

export default ImageSection; 