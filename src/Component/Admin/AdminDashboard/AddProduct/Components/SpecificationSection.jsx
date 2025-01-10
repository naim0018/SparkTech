/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useFieldArray } from "react-hook-form";
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

const SpecificationSection = ({ control, register, errors, isDarkMode }) => {
  const {
    fields: specificationFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  return (
    <div className={`mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Specifications
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Optional: Add detailed specifications for your product
          </p>
        </div>
      </div>
      {specificationFields.map((field, index) => (
        <div
          key={field.id}
          className={`mb-4 p-4 border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg`}
        >
          <label className="block mb-2">
            <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Specification Group
            </span>
            <input
              {...register(`specifications.${index}.group`, {
                required: "Specification group is required",
              })}
              placeholder="Enter specification group"
              className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
            />
          </label>

          <SpecificationItems 
            field={field}
            index={index}
            register={register}
            errors={errors}
            isDarkMode={isDarkMode}
            control={control}
          />

          <button
            type="button"
            onClick={() => removeSpecification(index)}
            className="mt-4 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
          >
            Remove Specification Group
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendSpecification({ group: "", items: [{ name: "", value: "" }] })}
        className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
      >
        Add Specification Group
      </button>
    </div>
  );
};

const SpecificationItems = ({ field, index, register, errors, isDarkMode, control }) => {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `specifications.${index}.items`,
  });

  return (
    <div className="mt-4">
      <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
        Specification Items
        <span className="text-xs text-gray-400 ml-2">(optional)</span>
      </h4>
      {itemFields.map((itemField, itemIndex) => (
        <div key={itemField.id} className="flex gap-4 mb-2">
          <label className="flex-1">
            <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Name</span>
            <input
              {...register(`specifications.${index}.items.${itemIndex}.name`, {
                required: "Name is required",
              })}
              placeholder="Enter specification name"
              className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
            />
            {errors?.specifications?.[index]?.items?.[itemIndex]?.name && (
              <span className="text-red-500">{errors.specifications[index].items[itemIndex].name.message}</span>
            )}
          </label>
          <label className="flex-1">
            <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Value</span>
            <input
              {...register(`specifications.${index}.items.${itemIndex}.value`, {
                required: "Value is required",
              })}
              placeholder="Enter specification value"
              className={`w-full p-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
            />
            {errors?.specifications?.[index]?.items?.[itemIndex]?.value && (
              <span className="text-red-500">{errors.specifications[index].items[itemIndex].value.message}</span>
            )}
          </label>
          <button
            type="button"
            onClick={() => removeItem(itemIndex)}
            className="mt-8 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Remove Item
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendItem({ name: "", value: "" })}
        className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Item
      </button>
    </div>
  );
};

SpecificationSection.propTypes = {
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

SpecificationItems.propTypes = {
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  control: PropTypes.object.isRequired
};

export default SpecificationSection; 