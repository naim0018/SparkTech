// Import required dependencies
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFieldArray, useWatch } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useGetAllCategoriesQuery } from "../../../../../redux/api/CategoriesApi";

// BasicInformation component for handling product's basic details
const BasicInformation = ({
  register,
  errors,
  control,
  isDarkMode,
  setValue,
}) => {
  // Fetch categories data
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategoriesQuery();
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);

  // Watch for category changes
  const selectedCategory = useWatch({
    control,
    name: "basicInfo.category",
    defaultValue: "",
  });

  // Update selectedCategoryData and reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory && categoriesData?.data) {
      const categoryData = categoriesData.data.find(
        (cat) => cat.name === selectedCategory
      );
      setSelectedCategoryData(categoryData);
      // Reset subcategory when category changes
      setValue("basicInfo.subcategory", "");
    } else {
      setSelectedCategoryData(null);
      setValue("basicInfo.subcategory", "");
    }
  }, [selectedCategory, categoriesData, setValue]);

  // Initialize field array for dynamic key features
  const {
    fields: keyFeatureFields,
    append: appendKeyFeature,
    remove: removeKeyFeature,
  } = useFieldArray({
    control,
    name: "basicInfo.keyFeatures",
  });

  return (
    // Main container with dark/light mode styling
    <div
      className={`mb-10 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-6 rounded-xl shadow-lg`}
    >
      <h2
        className={`text-3xl font-bold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-700"
        }`}
      >
        Basic Information
      </h2>
      {/* Form fields container */}
      <div className="space-y-4">
        {/* Product Code field */}
        <label className="block">
          <span className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            Product Code
          </span>
          <input
            {...register("basicInfo.productCode")}
            placeholder="Enter product code"
            className={`w-full p-3 border-2 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } mt-1`}
          >
            Leave blank for auto-generated code
          </p>
        </label>

        {/* Title field */}
        <label className="block">
          <span className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            Title
          </span>
          <input
            {...register("basicInfo.title", { required: "Title is required" })}
            placeholder="Enter product title"
            className={`w-full p-3 border-2 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.basicInfo?.title && (
            <span className="text-red-500">
              {errors.basicInfo.title.message}
            </span>
          )}
        </label>

        {/* Brand field */}
        <label className="block">
          <span className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            Brand
          </span>
          <input
            {...register("basicInfo.brand", { required: "Brand is required" })}
            placeholder="Enter brand name"
            className={`w-full p-3 border-2 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.basicInfo?.brand && (
            <span className="text-red-500">
              {errors.basicInfo.brand.message}
            </span>
          )}
        </label>

        {/* Category dropdown */}
        <label className="block">
          <span className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            Category
          </span>
          <select
            {...register("basicInfo.category", {
              required: "Category is required",
            })}
            className={`w-full p-3 border-2 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          >
            <option value="">Select category</option>
            {categoriesLoading ? (
              <option disabled>Loading categories...</option>
            ) : (
              categoriesData?.data?.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))
            )}
          </select>
          {errors.basicInfo?.category && (
            <span className="text-red-500">
              {errors.basicInfo.category.message}
            </span>
          )}
        </label>

        {/* Subcategory dropdown - only show if selected category has subcategories */}
        {selectedCategoryData?.subCategories?.length > 0 && (
          <label className="block">
            <span
              className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
            >
              Subcategory
            </span>
            <select
              {...register("basicInfo.subcategory")}
              className={`w-full p-3 border-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
            >
              <option value="">Select subcategory</option>
              {selectedCategoryData.subCategories.map((subCat) => (
                <option key={subCat.name} value={subCat.name}>
                  {subCat.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Description textarea */}
        <label className="block">
          <span className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            Description
          </span>
          <textarea
            {...register("basicInfo.description", {
              required: "Description is required",
            })}
            placeholder="Enter product description"
            rows="4"
            className={`w-full p-3 border-2 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1`}
          />
          {errors.basicInfo?.description && (
            <span className="text-red-500">
              {errors.basicInfo.description.message}
            </span>
          )}
        </label>

        {/* Dynamic Key Features section */}
        <div className="mb-4">
          <label className="block mb-2">
            <span
              className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
            >
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
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
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
          {/* Add feature button */}
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

// PropTypes validation
BasicInformation.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  control: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default BasicInformation;


// import PropTypes from "prop-types";
// import { useWatch } from "react-hook-form";

// const PriceInformation = ({ register, errors, isDarkMode, control }) => {
//   // Watch the toggle for delivery charge
//   const addDeliveryCharge = useWatch({
//     control,
//     name: "price.addDeliveryCharge",
//     defaultValue: false,
//   });

//   return (
//     <div
//       className={`mb-10 ${
//         isDarkMode ? "bg-gray-800" : "bg-white"
//       } p-6 rounded-xl shadow-lg`}
//     >
//       <h2
//         className={`text-3xl font-bold mb-6 ${
//           isDarkMode ? "text-white" : "text-gray-700"
//         }`}
//       >
//         Price Information
//       </h2>

//       <div className="space-y-4">
//         {/* Regular Price */}
//         <label className="block">
//           <span className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
//             Regular Price
//           </span>
//           <input
//             {...register("price.regular", {
//               required: "Regular price is required",
//               min: 0,
//               valueAsNumber: true,
//             })}
//             type="number"
//             placeholder="Enter regular price"
//             className={`w-full p-3 border-2 ${
//               isDarkMode
//                 ? "bg-gray-700 border-gray-600 text-white"
//                 : "border-gray-300"
//             } rounded-lg mt-1`}
//           />
//           {errors.price?.regular && (
//             <span className="text-red-500">{errors.price.regular.message}</span>
//           )}
//         </label>

//         {/* Discounted Price */}
//         <label className="block">
//           <span className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
//             Discounted Price (Optional)
//           </span>
//           <input
//             {...register("price.discounted", {
//               min: 0,
//               valueAsNumber: true,
//             })}
//             type="number"
//             placeholder="Enter discounted price"
//             className={`w-full p-3 border-2 ${
//               isDarkMode
//                 ? "bg-gray-700 border-gray-600 text-white"
//                 : "border-gray-300"
//             } rounded-lg mt-1`}
//           />
//           {errors.price?.discounted && (
//             <span className="text-red-500">
//               {errors.price.discounted.message}
//             </span>
//           )}
//         </label>

//         {/* Add Delivery Charge Toggle */}
//         <label className="flex items-center gap-3 mt-4">
//           <input
//             type="checkbox"
//             {...register("price.addDeliveryCharge")}
//             className="w-5 h-5"
//           />
//           <span className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
//             Add Delivery Charge
//           </span>
//         </label>

//         {/* Delivery Charge Fields */}
//         {addDeliveryCharge && (
//           <div className="space-y-4 mt-2">
//             {/* Inside Dhaka */}
//             <label className="block">
//               <span
//                 className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
//               >
//                 Delivery Charge (Inside Dhaka)
//               </span>
//               <input
//                 type="number"
//                 {...register("price.deliveryChargeInsideDhaka", {
//                   required: "Required",
//                   min: 0,
//                   valueAsNumber: true,
//                 })}
//                 placeholder="Enter charge inside Dhaka"
//                 className={`w-full p-3 border-2 ${
//                   isDarkMode
//                     ? "bg-gray-700 border-gray-600 text-white"
//                     : "border-gray-300"
//                 } rounded-lg mt-1`}
//               />
//               {errors.price?.deliveryChargeInsideDhaka && (
//                 <span className="text-red-500">
//                   {errors.price.deliveryChargeInsideDhaka.message}
//                 </span>
//               )}
//             </label>

//             {/* Outside Dhaka */}
//             <label className="block">
//               <span
//                 className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
//               >
//                 Delivery Charge (Outside Dhaka)
//               </span>
//               <input
//                 type="number"
//                 {...register("price.deliveryChargeOutsideDhaka", {
//                   required: "Required",
//                   min: 0,
//                   valueAsNumber: true,
//                 })}
//                 placeholder="Enter charge outside Dhaka"
//                 className={`w-full p-3 border-2 ${
//                   isDarkMode
//                     ? "bg-gray-700 border-gray-600 text-white"
//                     : "border-gray-300"
//                 } rounded-lg mt-1`}
//               />
//               {errors.price?.deliveryChargeOutsideDhaka && (
//                 <span className="text-red-500">
//                   {errors.price.deliveryChargeOutsideDhaka.message}
//                 </span>
//               )}
//             </label>

//             {/* Sub City (3rd Delivery Option) */}
//             <label className="block">
//               <span
//                 className={`${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
//               >
//                 Delivery Charge (Sub City)
//               </span>
//               <input
//                 type="number"
//                 {...register("price.deliveryChargeSubCity", {
//                   required: "Required",
//                   min: 0,
//                   valueAsNumber: true,
//                 })}
//                 placeholder="Enter sub-city charge"
//                 className={`w-full p-3 border-2 ${
//                   isDarkMode
//                     ? "bg-gray-700 border-gray-600 text-white"
//                     : "border-gray-300"
//                 } rounded-lg mt-1`}
//               />
//               {errors.price?.deliveryChargeSubCity && (
//                 <span className="text-red-500">
//                   {errors.price.deliveryChargeSubCity.message}
//                 </span>
//               )}
//             </label>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// PriceInformation.propTypes = {
//   register: PropTypes.func.isRequired,
//   errors: PropTypes.object.isRequired,
//   isDarkMode: PropTypes.bool.isRequired,
//   control: PropTypes.object.isRequired,
// };

// export default PriceInformation;
