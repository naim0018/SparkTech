/* eslint-disable react/prop-types */
import { useEffect } from 'react';

const BasicInformation = ({ register, errors, defaultValues = {}, watch, savingsPercentage }) => {
  const regularPrice = watch("price.regular");
  const discountedPrice = watch("price.discounted");

  useEffect(() => {
    if (regularPrice && discountedPrice) {
      const regular = parseFloat(regularPrice);
      const discounted = parseFloat(discountedPrice);
      if (regular > 0 && discounted < regular) {
        const savings = ((regular - discounted) / regular) * 100;
        register("price.savingsPercentage", { value: savings.toFixed(2) });
      } else {
        register("price.savingsPercentage", { value: 0 });
      }
    }
  }, [regularPrice, discountedPrice, register]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Basic Information
      </h2>
      {/* Product Title */}
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
        >
          Product Title
        </label>
        <input
          id="title"
          {...register("title", { required: "Title is required" })}
          // defaultValue={defaultValues.title}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200"
          placeholder="Enter product title"
        />
        {errors.title && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description", {
            required: "Description is required",
          })}
          defaultValue={defaultValues.description}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200 h-32"
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="regularPrice"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
          >
            Regular Price
          </label>
          <input
            id="regularPrice"
            type="number"
            step="0.01"
            {...register("price.regular", {
              required: "Regular price is required",
              min: { value: 0, message: "Price must be positive" }
            })}
            defaultValue={defaultValues?.price?.regular}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200"
            placeholder="Enter regular price"
          />
          {errors.price?.regular && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.price.regular.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="discountedPrice"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
          >
            Discounted Price (optional)
          </label>
          <input
            id="discountedPrice"
            type="number"
            step="0.01"
            {...register("price.discounted", {
              min: { value: 0, message: "Price must be positive" },
              validate: (value) => 
                !value || parseFloat(value) <= parseFloat(watch("price.regular")) || 
                "Discounted price must be less than or equal to regular price"
            })}
            defaultValue={defaultValues.price?.discounted}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200"
            placeholder="Enter discounted price (if any)"
          />
          {errors.price?.discounted && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.price.discounted.message}
            </p>
          )}
        </div>
      </div>

      {/* Savings Percentage */}
      <div className="mt-2">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Discount Percentage: {savingsPercentage}%
        </p>
        <input
          type="hidden"
          {...register("price.savingsPercentage")}
          value={savingsPercentage}
        />
      </div>

      {/* Product Code */}
      <div className="mt-4">
        <label
          htmlFor="productCode"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
        >
          Product Code
        </label>
        <input
          id="productCode"
          {...register("productCode", {
            required: "Product Code is required",
          })}
          defaultValue={defaultValues.productCode}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200"
          placeholder="Enter product code"
        />
        {errors.productCode && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.productCode.message}
          </p>
        )}
      </div>

      {/* Category and Subcategory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            {...register("category", {
              required: "Category is required",
            })}
            defaultValue={defaultValues?.category}
  
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200"
          >
            <option value="" disabled >
              Select a category
            </option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Garden</option>
            <option value="toys">Toys & Games</option>
            <option value="kitchen">Kitchen</option>
          </select>
          {errors.category && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="subcategory"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
          >
            Subcategory
          </label>
          <input
            id="subcategory"
            {...register("subcategory")}
            value={watch("subcategory") || defaultValues?.subcategory || ""}
            
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200"
            placeholder="Enter subcategory"
          />
        </div>
      </div>

      {/* Stock Quantity */}
      <div className="mt-4">
        <label
          htmlFor="stockQuantity"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
        >
          Stock Quantity
        </label>
        <input
          id="stockQuantity"
          type="number"
          {...register("stockQuantity", {
            required: "Stock Quantity is required",
            min: { value: 0, message: "Stock quantity must be non-negative" }
          })}
          defaultValue={defaultValues.stockQuantity}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200"
          placeholder="Enter stock quantity"
        />
        {errors.stockQuantity && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.stockQuantity.message}
          </p>
        )}
      </div>

      {/* Brand */}
      <div className="mt-4">
        <label
          htmlFor="brand"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
        >
          Brand
        </label>
        <input
          id="brand"
          {...register("brand", { required: "Brand is required" })}
          defaultValue={defaultValues.brand}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200"
          placeholder="Enter brand name"
        />
        {errors.brand && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.brand.message}</p>
        )}
      </div>
    </div>
  );
};

export default BasicInformation;






// /* eslint-disable react/prop-types */
// import { useEffect, useRef, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { toast } from "react-toastify";
// import { useAddProductMutation } from "../../../../redux/api/ProductApi";
// import BasicInformation from "./BasicInformation";
// import ShippingDetails from "./ShippingDetails";
// import AdditionalOptions from "./AdditionalOptions";
// import ProductTags from "./ProductTags";
// import ProductVariants from "./ProductVariants";
// import Specification from "./Specification";
// import ProductImages from "./ProductImages";

// // Main component for adding a new product
// export default function AddProductForm() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const inputRef = useRef(null);

//   // Initialize form with react-hook-form
//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//   } = useForm({
//     defaultValues: {
//       basicInfo: {
//         productCode: "",
//         title: "",
//         brand: "",
//         category: "",
//         subcategory: "",
//         description: "",
//         keyFeatures: [],
//       },
//       price: {
//         regular: 0,
//         discounted: 0,
//       },
//       stockStatus: "In Stock",
//       stockQuantity: 0,
//       images: [],
//       variants: [],
//       specifications: [],
//       tags: [],
//       paymentOptions: [],
//       dimensions: {
//         length: 0,
//         width: 0,
//         height: 0,
//         unit: "cm",
//       },
//       shipping: {
//         shippingWeight: 0,
//         shippingWeightUnit: "kg",
//       },
//       additionalInfo: {
//         freeShipping: false,
//         isFeatured: false,
//         isOnSale: false,
//         estimatedDelivery: "",
//         returnPolicy: "",
//         warranty: "",
//       },
//       seo: {
//         metaTitle: "",
//         metaDescription: "",
//         slug: "",
//       },
//     },
//   });

//   // State for managing product tags
//   const [tags, setTags] = useState([]);
//   const [input, setInput] = useState("");

//   // Function to add a new tag
//   const addTag = (e) => {
//     if (e.key === "Enter" && input.trim() !== "") {
//       setTags([...tags, input.trim()]);
//       setInput("");
//     }
//   };

//   // Function to remove a tag
//   const removeTag = (index) => {
//     setTags(tags.filter((_, i) => i !== index));
//   };

//   // Focus on input field when tags change
//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [tags]);

//   // Setup field arrays for images, variants, and specifications
//   const {
//     fields: imageFields,
//     append: appendImage,
//     remove: removeImage,
//   } = useFieldArray({
//     control,
//     name: "images",
//   });

//   const {
//     fields: variantFields,
//     append: appendVariant,
//     remove: removeVariant,
//   } = useFieldArray({
//     control,
//     name: "variants",
//   });

//   const {
//     fields: specificationFields,
//     append: appendSpecification,
//     remove: removeSpecification,
//   } = useFieldArray({
//     control,
//     name: "specifications",
//   });

//   // Hook for adding a new product
//   const [addProduct, { isLoading }] = useAddProductMutation();

//   // Function to handle form submission
//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     try {
//       const productData = {
//         ...data,
//         tags,
//         rating: { average: 0, count: 0 },
//         reviews: [],
//         relatedProducts: [],
//         sold: 0,
//       };

//       // Validate image URL
//       if (productData.images[0]?.url && !isValidUrl(productData.images[0].url)) {
//         throw new Error("Invalid image URL");
//       }

//       // Send product data to API
//       const response = await addProduct(productData).unwrap();
//       console.log(response);

//       // Reset form and show success message
//       reset();
//       setTags([]);
//       toast.success("Product added successfully!");
//     } catch (error) {
//       toast.error("Failed to add product. Please check all fields and try again.");
//       console.error("Error adding product:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Function to validate URL
//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (error) {
//       console.error("URL validation error:", error);
//       return false;
//     }
//   };

//   // Render the form
//   return (
//     <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
//       <div className="max-w-9xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
//         <div className="px-6 py-8 sm:px-10 sm:py-12">
//           <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
//             Create New Product
//           </h1>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//               <div className="space-y-10">
//                 <BasicInformation 
//                   register={register} 
//                   errors={errors} 
//                   watch={watch}
//                 />
//                 <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-sm">
//                   <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
//                     Price Details
//                   </h2>
//                   <div className="space-y-4">
//                     <div>
//                       <label htmlFor="regularPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Regular Price
//                       </label>
//                       <input
//                         type="number"
//                         id="regularPrice"
//                         {...register("price.regular", { required: "Regular price is required", min: 0 })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                       />
//                       {errors.price?.regular && <p className="mt-1 text-sm text-red-600">{errors.price.regular.message}</p>}
//                     </div>
//                     <div>
//                       <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Discounted Price
//                       </label>
//                       <input
//                         type="number"
//                         id="discountedPrice"
//                         {...register("price.discounted", { min: 0 })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                       />
//                       {errors.price?.discounted && <p className="mt-1 text-sm text-red-600">{errors.price.discounted.message}</p>}
//                     </div>
//                   </div>
//                 </div>
//                 <ShippingDetails register={register} errors={errors} />
//                 <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-sm">
//                   <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
//                     Dimensions Details
//                   </h2>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="length" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Length
//                       </label>
//                       <input
//                         type="number"
//                         id="length"
//                         {...register("dimensions.length", { min: 0 })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="width" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Width
//                       </label>
//                       <input
//                         type="number"
//                         id="width"
//                         {...register("dimensions.width", { min: 0 })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Height
//                       </label>
//                       <input
//                         type="number"
//                         id="height"
//                         {...register("dimensions.height", { min: 0 })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Unit
//                       </label>
//                       <select
//                         id="unit"
//                         {...register("dimensions.unit")}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                       >
//                         <option value="cm">cm</option>
//                         <option value="in">in</option>
//                         <option value="mm">mm</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//                 <AdditionalOptions register={register} errors={errors} />
//                 <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-sm">
//                   <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
//                     SEO Details
//                   </h2>
//                   <div className="space-y-4">
//                     <div>
//                       <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Meta Title
//                       </label>
//                       <input
//                         type="text"
//                         id="metaTitle"
//                         {...register("seo.metaTitle")}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Meta Description
//                       </label>
//                       <textarea
//                         id="metaDescription"
//                         {...register("seo.metaDescription")}
//                         rows="3"
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                       ></textarea>
//                     </div>
//                     <div>
//                       <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Slug
//                       </label>
//                       <input
//                         type="text"
//                         id="slug"
//                         {...register("seo.slug")}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-10">
//                 <ProductTags
//                   tags={tags}
//                   removeTag={removeTag}
//                   inputRef={inputRef}
//                   input={input}
//                   setInput={setInput}
//                   addTag={addTag}
//                 />
//                 <ProductImages
//                   register={register}
//                   imageFields={imageFields}
//                   removeImage={removeImage}
//                   appendImage={appendImage}
//                 />
//                 <Specification
//                   register={register}
//                   specificationFields={specificationFields}
//                   removeSpecification={removeSpecification}
//                   appendSpecification={appendSpecification}
//                   errors={errors}
//                 />
//                 <ProductVariants
//                   register={register}
//                   variantFields={variantFields}
//                   removeVariant={removeVariant}
//                   appendVariant={appendVariant}
//                 />
//               </div>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800"
//               disabled={isSubmitting || isLoading}
//             >
//               {isSubmitting || isLoading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </span>
//               ) : (
//                 "Add Product"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
