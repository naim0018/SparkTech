/* eslint-disable react/prop-types */
import { FaMinusCircle } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";

const ProductVariants = ({ register, variantFields, removeVariant, appendVariant, defaultValues }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Product Variants
      </h2>
      <div className="space-y-4">
        {variantFields.map((field, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-grow space-y-2">
              <input
                {...register(`variants.${index}.name`, {
                  required: "Variant name is required",
                })}
                defaultValue={defaultValues?.variants?.[index]?.name || ""}
                placeholder="Variant Name"
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <input
                {...register(`variants.${index}.value`, {
                  required: "Variant value is required",
                })}
                defaultValue={defaultValues?.variants?.[index]?.value || ""}
                placeholder="Variant Value"
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="self-center text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition duration-200"
            >
              <FaMinusCircle className="h-5 w-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendVariant({ name: "", value: "" })}
          className="w-full flex items-center justify-center bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 p-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-200"
        >
          <BsPlusCircle className="h-5 w-5 mr-2" /> Add Variant
        </button>
      </div>
    </div>
  );
};

export default ProductVariants;