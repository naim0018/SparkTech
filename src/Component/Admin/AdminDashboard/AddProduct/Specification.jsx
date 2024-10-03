/* eslint-disable react/prop-types */
import { FaMinusCircle } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";

// This component handles the specification section of the product form
// It allows users to add, remove, and edit product specifications
const Specification = ({ register, specificationFields, removeSpecification, appendSpecification }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Specifications
      </h2>
      <div className="space-y-4">
        {/* Map through each specification field */}
        {specificationFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <div className="flex-grow space-y-2">
              {/* Input for specification group */}
              <input
                {...register(`specifications.${index}.group`, {
                  required: "Specification group is required",
                })}
                placeholder="Specification Group"
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
              />
              <div className="flex space-x-2">
                {/* Input for specification name */}
                <input
                  {...register(
                    `specifications.${index}.items.0.name`,
                    { required: "Specification name is required" }
                  )}
                  placeholder="Name"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                />
                {/* Input for specification value */}
                <input
                  {...register(
                    `specifications.${index}.items.0.value`,
                    { required: "Specification value is required" }
                  )}
                  placeholder="Value"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
            {/* Button to remove specification */}
            <button
              type="button"
              onClick={() => removeSpecification(index)}
              className="self-center text-red-500 hover:text-red-700 transition duration-200"
            >
              <FaMinusCircle className="h-5 w-5" />
            </button>
          </div>
        ))}
        {/* Button to add new specification */}
        <button
          type="button"
          onClick={() =>
            appendSpecification({
              group: "",
              items: [{ name: "", value: "" }],
            })
          }
          className="w-full flex items-center justify-center bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition duration-200"
        >
          <BsPlusCircle className="h-5 w-5 mr-2" /> Add Specification
        </button>
      </div>
    </div>
  )
}

export default Specification
