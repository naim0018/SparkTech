/* eslint-disable no-unused-vars */
import { useFieldArray } from "react-hook-form";
import PropTypes from "prop-types";
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { toast } from "react-toastify";

const VariantItems = ({ variantIndex, register, errors, isDarkMode, control }) => {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `variants.${variantIndex}.items`,
  });

  return (
    <div className="mt-4">
      <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
        Variant Items
        <span className="text-xs text-gray-400 ml-2">(optional)</span>
      </h4>
      {itemFields.map((itemField, itemIndex) => (
        <div key={itemField.id} className="flex flex-col gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Value</span>
                <input
                  {...register(`variants.${variantIndex}.items.${itemIndex}.value`)}
                  placeholder="Enter value (e.g., Large, Red)"
                  className={`w-full p-2.5 mt-1 text-sm border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </label>
            </div>
            
            <div className="flex-1">
              <label className="block">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Price</span>
                <input
                  type="number"
                  {...register(`variants.${variantIndex}.items.${itemIndex}.price`, {
                    min: { value: 0, message: "Price must be positive" }
                  })}
                  placeholder="Enter price"
                  className={`w-full p-2.5 mt-1 text-sm border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </label>
            </div>

            <div className="flex-1">
              <label className="block">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Stock</span>
                <input
                  type="number"
                  {...register(`variants.${variantIndex}.items.${itemIndex}.stock`, {
                    min: { value: 0, message: "Stock must be positive" }
                  })}
                  placeholder="Enter stock quantity"
                  className={`w-full p-2.5 mt-1 text-sm border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => removeItem(itemIndex)}
              className="self-end p-2.5 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              <FaTrash />
            </button>
          </div>

          <div className="w-full">
            <span className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Image</span>
            <div className="flex gap-2 mt-1">
              <input
                {...register(`variants.${variantIndex}.items.${itemIndex}.image.url`)}
                placeholder="Image URL"
                className={`w-full p-2.5 text-sm border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              <input
                {...register(`variants.${variantIndex}.items.${itemIndex}.image.alt`)}
                placeholder="Alt text"
                className={`w-full p-2.5 text-sm border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => appendItem({ 
          value: "", 
          price: 0, 
          stock: 0,
          image: {
            url: "",
            alt: ""
          }
        })}
        className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        <FaPlus className="inline mr-2" /> Add Item
      </button>
    </div>
  );
};

const VariantSection = ({ control, register, errors, isDarkMode }) => {
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div className={`mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Product Variants
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Add different variations of your product (e.g., sizes, colors)
          </p>
        </div>
      </div>

      {variantFields.map((field, variantIndex) => (
        <div
          key={field.id}
          className={`mb-6 p-5 border ${isDarkMode ? 'border-gray-600 bg-gray-750' : 'border-gray-200 bg-gray-50'} rounded-lg`}
        >
          <div className="flex justify-between items-center mb-4">
            <label className="block flex-1 mr-4">
              <span className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Variant Group
              </span>
              <input
                {...register(`variants.${variantIndex}.group`, {
                  required: "Variant group is required",
                })}
                placeholder="Enter variant group (e.g., Size, Color)"
                className={`w-full p-2.5 text-sm border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors?.variants?.[variantIndex]?.group && (
                <span className="text-sm text-red-500 mt-1">{errors.variants[variantIndex].group.message}</span>
              )}
            </label>
            
            <button
              type="button"
              onClick={() => removeVariant(variantIndex)}
              className="self-start p-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              <FaTrash />
            </button>
          </div>

          <VariantItems 
            variantIndex={variantIndex}
            register={register}
            errors={errors}
            isDarkMode={isDarkMode}
            control={control}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => appendVariant({ 
          group: "", 
          items: [{
            value: "",
            price: 0,
            stock: 0,
            image: {
              url: "",
              alt: ""
            }
          }]
        })}
        className="w-full mt-4 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        <FaPlus className="inline mr-2" /> Add New Variant Group
      </button>
    </div>
  );
};

VariantItems.propTypes = {
  variantIndex: PropTypes.number.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  control: PropTypes.object.isRequired
};

VariantSection.propTypes = {
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

export default VariantSection;