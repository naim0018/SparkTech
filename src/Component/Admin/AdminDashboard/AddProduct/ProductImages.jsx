/* eslint-disable react/prop-types */

import { FaMinusCircle } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";

const ProductImages = ({ register, imageFields, removeImage, appendImage, defaultValues }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Product Images
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Please ensure first product image have white background for better visibility.
      </p>
      <div className="space-y-4">
        {imageFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <div className="flex-grow space-y-2">
              <input
                {...register(`images.${index}.url`, {
                  required: "Image URL is required",
                })}
                defaultValue={defaultValues?.images?.[index]?.url}
                placeholder="Image URL"
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
              />
              <input
                {...register(`images.${index}.alt`, {
                  required: "Image alt text is required",
                })}
                defaultValue={defaultValues?.images?.[index]?.alt}
                placeholder="Image alt text"
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="self-center text-red-500 hover:text-red-700 transition duration-200"
            >
              <FaMinusCircle className="h-5 w-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendImage({ url: "", alt: "" })}
          className="w-full flex items-center justify-center bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition duration-200"
        >
          <BsPlusCircle className="h-5 w-5 mr-2" /> Add Image
        </button>
      </div>
    </div>
  )
}

export default ProductImages
