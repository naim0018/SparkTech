/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { useAddProductMutation, useUpdateProductMutation } from '../../../redux/api/ProductApi';
import { toast } from 'react-toastify';

const ProductInput = ({ product, closeModal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      basicInfo: {
        productCode: "",
        title: "",
        brand: "",
        category: "",
        subcategory: "",
        description: "",
        keyFeatures: [""],
      },
      price: {
        regular: 0,
        discounted: "",
        selectedVariant: "",
      },
      stockStatus: "In Stock",
      stockQuantity: 0,
      images: [{ url: "", alt: "" }],
      variants: [{ name: "", value: "", price: 0 }],
      specifications: [{ group: "", items: [{ name: "", value: "" }] }],
      tags: [""],
      shippingDetails: {
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        dimensionUnit: "cm",
        weightUnit: "kg",
      },
      additionalInfo: {
        freeShipping: false,
        isFeatured: false,
        isOnSale: false,
        estimatedDelivery: "",
        returnPolicy: "",
        warranty: "",
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
        slug: "",
      },
    },
  });

  const { fields: keyFeatureFields, append: appendKeyFeature, remove: removeKeyFeature } = useFieldArray({ control, name: "basicInfo.keyFeatures" });
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: "images" });
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({ control, name: "variants" });
  const { fields: specificationFields, append: appendSpecification, remove: removeSpecification } = useFieldArray({ control, name: "specifications" });
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tags" });

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (product) {
      Object.keys(product).forEach(key => {
        setValue(key, product[key]);
      });
    }
  }, [product, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (product) {
        await updateProduct({ id: product._id, ...data }).unwrap();
        toast.success('Product updated successfully');
        closeModal(); // Close the modal after successful update
      } else {
        await addProduct(data).unwrap();
        toast.success('Product added successfully');
      }
    } catch (error) {
      toast.error('Error processing product: ' + (error.data?.message || error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto p-8 bg-white shadow-2xl rounded-2xl relative">
      <button
        type="button"
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">
        {product ? 'Edit Product' : 'Add New Product'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {/* Basic Information Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Basic Information</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Product Code</span>
                <input
                  {...register("basicInfo.productCode")}
                  placeholder="Enter product code"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Title</span>
                <input
                  {...register("basicInfo.title", { required: "Title is required" })}
                  placeholder="Enter product title"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.basicInfo?.title && <span className="text-red-500">{errors.basicInfo.title.message}</span>}
              </label>
              <label className="block">
                <span className="text-gray-700">Brand</span>
                <input
                  {...register("basicInfo.brand", { required: "Brand is required" })}
                  placeholder="Enter brand"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.basicInfo?.brand && <span className="text-red-500">{errors.basicInfo.brand.message}</span>}
              </label>
              <label className="block">
                <span className="text-gray-700">Category</span>
                <input
                  {...register("basicInfo.category", { required: "Category is required" })}
                  placeholder="Enter category"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.basicInfo?.category && <span className="text-red-500">{errors.basicInfo.category.message}</span>}
              </label>
              <label className="block">
                <span className="text-gray-700">Subcategory</span>
                <input
                  {...register("basicInfo.subcategory")}
                  placeholder="Enter subcategory"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Description</span>
                <textarea
                  {...register("basicInfo.description", { required: "Description is required" })}
                  placeholder="Enter product description"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  rows="4"
                ></textarea>
                {errors.basicInfo?.description && <span className="text-red-500">{errors.basicInfo.description.message}</span>}
              </label>
            </div>
            {/* Key Features Section */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-700">Key Features</h3>
              {keyFeatureFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2 mb-2">
                  <input
                    {...register(`basicInfo.keyFeatures.${index}`, { required: "Key Feature is required" })}
                    placeholder="Enter key feature"
                    className="flex-grow p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeKeyFeature(index)}
                    className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendKeyFeature("")}
                className="mt-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
              >
                Add Key Feature
              </button>
            </div>
          </div>

          {/* Price Information Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Price Information</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Regular Price</span>
                <input
                  {...register("price.regular", { required: "Regular price is required", min: 0, valueAsNumber: true })}
                  type="number"
                  placeholder="Enter regular price"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.price?.regular && <span className="text-red-500">{errors.price.regular.message}</span>}
              </label>
              <label className="block">
                <span className="text-gray-700">Discounted Price</span>
                <input
                  {...register("price.discounted", { min: 0, valueAsNumber: true })}
                  type="number"
                  placeholder="Enter discounted price"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Selected Variant</span>
                <input
                  {...register("price.selectedVariant")}
                  placeholder="Enter selected variant"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
              </label>
            </div>
          </div>

          {/* Stock Information Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Stock Information</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Stock Status</span>
                <select
                  {...register("stockStatus")}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Pre-order">Pre-order</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Stock Quantity</span>
                <input
                  {...register("stockQuantity", { min: 0, valueAsNumber: true })}
                  type="number"
                  placeholder="Enter stock quantity"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.stockQuantity && <span className="text-red-500">{errors.stockQuantity.message}</span>}
              </label>
            </div>
          </div>

          {/* Shipping Details Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Shipping Details</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Length</span>
                <input
                  {...register("shippingDetails.length", { min: 0, valueAsNumber: true })}
                  type="number"
                  placeholder="Enter length"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Width</span>
                <input
                  {...register("shippingDetails.width", { min: 0, valueAsNumber: true })}
                  type="number"
                  placeholder="Enter width"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Height</span>
                <input
                  {...register("shippingDetails.height", { min: 0, valueAsNumber: true })}
                  type="number"
                  placeholder="Enter height"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Weight</span>
                <input
                  {...register("shippingDetails.weight", { 
                    min: 0, 
                    valueAsNumber: true,
                    validate: value => value >= 0 || "Weight must be a positive number"
                  })}
                  type="number"
                  step="0.01"
                  placeholder="Enter weight"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.shippingDetails?.weight && <span className="text-red-500">{errors.shippingDetails.weight.message}</span>}
              </label>
              <label className="block">
                <span className="text-gray-700">Dimension Unit</span>
                <select
                  {...register("shippingDetails.dimensionUnit")}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                >
                  <option value="cm">cm</option>
                  <option value="inch">inch</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Weight Unit</span>
                <select
                  {...register("shippingDetails.weightUnit")}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </label>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Additional Information</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Free Shipping</span>
                <input
                  {...register("additionalInfo.freeShipping")}
                  type="checkbox"
                  className="ml-2"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Is Featured</span>
                <input
                  {...register("additionalInfo.isFeatured")}
                  type="checkbox"
                  className="ml-2"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Is On Sale</span>
                <input
                  {...register("additionalInfo.isOnSale")}
                  type="checkbox"
                  className="ml-2"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Estimated Delivery</span>
                <input
                  {...register("additionalInfo.estimatedDelivery")}
                  placeholder="Enter estimated delivery"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Return Policy</span>
                <textarea
                  {...register("additionalInfo.returnPolicy")}
                  placeholder="Enter return policy"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  rows="3"
                ></textarea>
              </label>
              <label className="block">
                <span className="text-gray-700">Warranty</span>
                <textarea
                  {...register("additionalInfo.warranty")}
                  placeholder="Enter warranty information"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  rows="3"
                ></textarea>
              </label>
            </div>
          </div>

          {/* SEO Information Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">SEO Information</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Meta Title</span>
                <input
                  {...register("seo.metaTitle")}
                  placeholder="Enter meta title"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Meta Description</span>
                <textarea
                  {...register("seo.metaDescription")}
                  placeholder="Enter meta description"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  rows="3"
                ></textarea>
              </label>
              <label className="block">
                <span className="text-gray-700">Slug</span>
                <input
                  {...register("seo.slug")}
                  placeholder="Enter slug"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
              </label>
            </div>
          </div>
        </div>

        <div>
          {/* Tags Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Tags</h2>
            {tagFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <input
                  {...register(`tags.${index}`, { required: "Tag is required" })}
                  placeholder="Enter tag"
                  className="flex-grow p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendTag("")}
              className="mt-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
            >
              Add Tag
            </button>
          </div>

          {/* Images Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Images</h2>
            {imageFields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border-2 border-gray-300 rounded-lg">
                <label className="block mb-2">
                  <span className="text-gray-700">Image URL</span>
                  <input
                    {...register(`images.${index}.url`, { required: "Image URL is required" })}
                    placeholder="Enter image URL"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Image Alt Text</span>
                  <input
                    {...register(`images.${index}.alt`, { required: "Image Alt Text is required" })}
                    placeholder="Enter image alt text"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                >
                  Remove Image
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendImage({ url: "", alt: "" })}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
            >
              Add Image
            </button>
          </div>

          {/* Variants Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Variants</h2>
            {variantFields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border-2 border-gray-300 rounded-lg">
                <label className="block mb-2">
                  <span className="text-gray-700">Variant Name</span>
                  <input
                    {...register(`variants.${index}.name`, { required: "Variant name is required" })}
                    placeholder="Enter variant name"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Variant Value</span>
                  <input
                    {...register(`variants.${index}.value`, { required: "Variant value is required" })}
                    placeholder="Enter variant value"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Variant Price</span>
                  <input
                    {...register(`variants.${index}.price`, { required: "Variant price is required", min: 0, valueAsNumber: true })}
                    type="number"
                    placeholder="Enter variant price"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                >
                  Remove Variant
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendVariant({ name: "", value: "", price: 0 })}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
            >
              Add Variant
            </button>
          </div>

          {/* Specifications Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Specifications</h2>
            {specificationFields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border-2 border-gray-300 rounded-lg">
                <label className="block mb-2">
                  <span className="text-gray-700">Specification Group</span>
                  <input
                    {...register(`specifications.${index}.group`, { required: "Specification group is required" })}
                    placeholder="Enter specification group"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                </label>
                {field.items.map((item, itemIndex) => (
                  <div key={item.id} className="flex items-center space-x-2 mb-2">
                    <input
                      {...register(`specifications.${index}.items.${itemIndex}.name`, { required: "Specification name is required" })}
                      placeholder="Enter specification name"
                      className="flex-grow p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <input
                      {...register(`specifications.${index}.items.${itemIndex}.value`, { required: "Specification value is required" })}
                      placeholder="Enter specification value"
                      className="flex-grow p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendSpecification({ name: "", value: "" })}
                  className="mt-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
                >
                  Add Specification Item
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
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-4 bg-blue-500 text-white rounded-xl text-xl font-bold hover:bg-blue-600 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (product ? "Updating Product..." : "Adding Product...") : (product ? "Update Product" : "Add Product")}
      </button>
    </form>
  );
};

export default ProductInput;
