/* eslint-disable react/prop-types */
import { FaMinusCircle } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";

const ProductVariants = ({ register, variantFields, removeVariant, appendVariant, defaultValues }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Product Variants
      </h2>
      <div className="space-y-4">
        {variantFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <div className="flex-grow space-y-2">
              <input
                {...register(`variants.${index}.name`, {
                  required: "Variant name is required",
                })}
                defaultValue={defaultValues?.variants?.[index]?.name || ""}
                placeholder="Variant Name"
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
              />
              <input
                {...register(`variants.${index}.value`, {
                  required: "Variant value is required",
                })}
                defaultValue={defaultValues?.variants?.[index]?.value || ""}
                placeholder="Variant Value"
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
              />
            </div>
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="self-center text-red-500 hover:text-red-700 transition duration-200"
            >
              <FaMinusCircle className="h-5 w-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendVariant({ name: "", value: "" })}
          className="w-full flex items-center justify-center bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition duration-200"
        >
          <BsPlusCircle className="h-5 w-5 mr-2" /> Add Variant
        </button>
      </div>
    </div>
  );
};

export default ProductVariants;