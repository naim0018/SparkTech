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
        <div key={itemField.id} className="flex gap-4 mb-2">
          <label className="flex-1">
            <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Value</span>
            <input
              {...register(`variants.${variantIndex}.items.${itemIndex}.value`)}
              placeholder="Enter value (e.g., Large, Red)"
              className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
            />
          </label>
          <label className="flex-1">
            <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Price</span>
            <input
              type="number"
              {...register(`variants.${variantIndex}.items.${itemIndex}.price`, {
                min: { value: 0, message: "Price must be positive" }
              })}
              placeholder="Enter price"
              className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
            />
          </label>
          <button
            type="button"
            onClick={() => removeItem(itemIndex)}
            className="mt-8 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <FaTrash />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendItem({ value: "", price: 0 })}
        className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Item
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
    <div className={`mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Variants
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Optional: Add variants if your product has different options (e.g., sizes, colors)
          </p>
        </div>
      </div>

      {variantFields.map((field, variantIndex) => (
        <div
          key={field.id}
          className={`mb-4 p-4 border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg`}
        >
          <label className="block mb-2">
            <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Variant Group
            </span>
            <input
              {...register(`variants.${variantIndex}.group`, {
                required: "Variant group is required",
              })}
              placeholder="Enter variant group (e.g., Size, Color)"
              className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
            />
            {errors?.variants?.[variantIndex]?.group && (
              <span className="text-red-500">{errors.variants[variantIndex].group.message}</span>
            )}
          </label>

          <VariantItems 
            variantIndex={variantIndex}
            register={register}
            errors={errors}
            isDarkMode={isDarkMode}
            control={control}
          />

          <button
            type="button"
            onClick={() => removeVariant(variantIndex)}
            className="mt-4 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
          >
            Remove Variant Group
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendVariant({ group: "", items: [{ value: "", price: 0 }] })}
        className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
      >
        Add Variant Group
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