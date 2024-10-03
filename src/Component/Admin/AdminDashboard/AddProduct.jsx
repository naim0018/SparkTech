// Import necessary dependencies and icons
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { BsPlusCircle } from "react-icons/bs";
import { FaMinusCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useAddProductMutation } from "../../../redux/api/ProductApi";

export default function AddProductForm() {
  // State for form submission and input focus
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  // Initialize react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      images: [""],
      variants: [{ variantName: "", options: [""] }],
      shippingDetails: { dimensions: { length: 0, width: 0, height: 0 } },
      specifications: {},
      stockQuantity: 0,
      category: "",
    },
  });

  // State for managing tags
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");

  // Function to add a new tag
  const addTag = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      setTags([...tags, input.trim()]);
      setInput("");
    }
  };

  // Function to remove a tag
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Effect to focus on input after adding a tag
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tags]);

  // Setup field arrays for dynamic form fields
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const {
    fields: specificationFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  // Use the mutation hook
  const [addProduct, { isLoading }] = useAddProductMutation();

  // Function to handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Prepare the data
      const productData = {
        ...data,
        tags,
        specifications: Object.fromEntries(
          data.specifications.map(spec => [spec.key, spec.value])
        ),
        productCode: parseInt(data.productCode),
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stockQuantity),
        shippingDetails: {
          ...data.shippingDetails,
          weight: parseFloat(data.shippingDetails.weight),
          dimensions: {
            length: parseFloat(data.shippingDetails.dimensions.length),
            width: parseFloat(data.shippingDetails.dimensions.width),
            height: parseFloat(data.shippingDetails.dimensions.height),
          },
        },
      };

      // Send the data using productsapi
      const response = await addProduct(productData).unwrap();
      console.log(response);

      // Reset the form
      reset();
      setTags([]);

      // Show success message
      toast.success('Product added successfully!');

    } catch (error) {
      // Handle error
      toast.error('Failed to add product. Please try again.');
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Add New Product
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                  {/* Product Title */}
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                      Product Title
                    </label>
                    <input
                      id="title"
                      {...register("title", { required: "Title is required" })}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      {...register("description")}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200 h-32"
                    />
                  </div>

                  {/* Price and Product Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        id="price"
                        type="number"
                        step="0.01"
                        {...register("price", { required: "Price is required" })}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="productCode" className="block text-sm font-semibold text-gray-700 mb-1">
                        Product Code
                      </label>
                      <input
                        id="productCode"
                        type="number"
                        {...register("productCode", { required: "Product Code is required" })}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                      />
                      {errors.productCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.productCode.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Category and Subcategory */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        id="category"
                        {...register("category", { required: "Category is required" })}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                      >
                        <option value="">Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="books">Books</option>
                        <option value="home">Home & Garden</option>
                        <option value="toys">Toys & Games</option>
                      </select>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="subCategory" className="block text-sm font-semibold text-gray-700 mb-1">
                        Subcategory
                      </label>
                      <input
                        id="subCategory"
                        {...register("subCategory")}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div className="mt-4">
                    <label htmlFor="stockQuantity" className="block text-sm font-semibold text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      id="stockQuantity"
                      type="number"
                      {...register("stockQuantity", { required: "Stock Quantity is required" })}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                    />
                    {errors.stockQuantity && (
                      <p className="text-red-500 text-sm mt-1">{errors.stockQuantity.message}</p>
                    )}
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-1">
                        Weight (g)
                      </label>
                      <input
                        id="weight"
                        type="number"
                        step="0.01"
                        {...register("shippingDetails.weight", { required: "Weight is required" })}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="estimatedDelivery" className="block text-sm font-semibold text-gray-700 mb-1">
                        Estimated Delivery
                      </label>
                      <input
                        id="estimatedDelivery"
                        {...register("shippingDetails.estimatedDelivery")}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dimensions (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {["width", "length", "height"].map((dim) => (
                        <div key={dim}>
                          <label htmlFor={dim} className="block text-xs font-medium text-gray-600 mb-1">
                            {dim.charAt(0).toUpperCase() + dim.slice(1)}
                          </label>
                          <input
                            id={dim}
                            type="number"
                            step="0.01"
                            {...register(`shippingDetails.dimensions.${dim}`, { required: `${dim} is required` })}
                            placeholder={`Enter ${dim}`}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Options</h2>
                  <div className="flex flex-wrap items-center gap-6">
                    {["freeShipping", "isFeatured", "isOnSale"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          id={option}
                          type="checkbox"
                          {...register(option === "freeShipping" ? "shippingDetails.freeShipping" : option)}
                          className="w-5 h-5 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                        />
                        <label htmlFor={option} className="text-sm font-medium text-gray-700">
                          {option.split(/(?=[A-Z])/).join(" ")}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Product Tags */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Tags</h2>
                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-2 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-gray-500 focus-within:border-gray-500 bg-white">
                      {tags.slice(0, 10).map((tag, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="focus:outline-none hover:text-red-500 transition-colors"
                            aria-label={`Remove tag ${tag}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {tags.length < 10 && (
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (tags.length < 10) {
                              addTag(e);
                            }
                          }}
                          placeholder={tags.length === 0 ? "Type a tag and press Enter" : ""}
                          className="flex-grow outline-none text-sm"
                        />
                      )}
                    </div>
                  </div>
                  {tags.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      {tags.length} tag{tags.length !== 1 ? "s" : ""} added
                      {tags.length === 10 && " (Maximum reached)"}
                    </p>
                  )}
                </div>

                {/* Product Images */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Images</h2>
                  <div className="space-y-4">
                    {imageFields.map((field, index) => (
                      <div key={field.id} className="flex items-center">
                        <input
                          {...register(`images.${index}`, { required: "Image URL is required" })}
                          className="flex-grow p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition duration-200"
                        >
                          <FaMinusCircle className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => appendImage("")}
                      className="w-full flex items-center justify-center bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition duration-200"
                    >
                      <BsPlusCircle className="h-5 w-5 mr-2" /> Add Image
                    </button>
                  </div>
                </div>

                {/* Specifications */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Specifications</h2>
                  <div className="space-y-4">
                    {specificationFields.map((field, index) => (
                      <div key={field.id} className="flex flex-col sm:flex-row items-center gap-4">
                        <input
                          {...register(`specifications.${index}.key`, { required: "Specification key is required" })}
                          placeholder="Key"
                          className="w-full sm:w-1/2 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                        />
                        <input
                          {...register(`specifications.${index}.value`, { required: "Specification value is required" })}
                          placeholder="Value"
                          className="w-full sm:w-1/2 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="text-red-500 hover:text-red-700 transition duration-200"
                        >
                          <FaMinusCircle className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => appendSpecification({ key: "", value: "" })}
                      className="w-full flex items-center justify-center bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition duration-200"
                    >
                      <BsPlusCircle className="h-5 w-5 mr-2" /> Add Specification
                    </button>
                  </div>
                </div>

                {/* Product Variants */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Variants</h2>
                  <div className="space-y-4">
                    {variantFields.map((field, index) => (
                      <div key={field.id} className=" rounded-lg">
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                          <input
                            {...register(`variants.${index}.variantName`, { required: "Variant name is required" })}
                            placeholder="Variant Name"
                            className="w-full sm:w-1/2 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                          />
                          <input
                            {...register(`variants.${index}.options.0`, { required: "At least one option is required" })}
                            placeholder="Option"
                            className="w-full sm:w-1/2 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="w-full sm:w-auto flex items-center justify-center bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-200"
                        >
                          <BiMinusCircle className="h-5 w-5 mr-2" /> Remove Variant
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => appendVariant({ variantName: "", options: [""] })}
                      className="w-full flex items-center justify-center bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition duration-200"
                    >
                      <BiPlusCircle className="h-5 w-5 mr-2" /> Add Variant
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-800 text-white p-4 rounded-lg font-semibold text-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Processing..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
