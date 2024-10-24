// Import necessary dependencies
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddProductMutation } from "../../../../redux/api/ProductApi";

// Define the AddProduct component
export default function AddProduct() {
  // State to manage form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
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
      reviews: [],
      rating: {
        average: 0,
        count: 0,
      },
      relatedProducts: [],
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

  // Initialize useFieldArray for dynamic form fields
  const {
    fields: keyFeatureFields,
    append: appendKeyFeature,
    remove: removeKeyFeature,
  } = useFieldArray({
    control,
    name: "basicInfo.keyFeatures",
  });

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

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
  });

  // Initialize the addProduct mutation
  const [addProduct] = useAddProductMutation();

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data);
    try {
      // Prepare product data
      const productData = {
        basicInfo: {
          productCode: data.basicInfo.productCode,
          title: data.basicInfo.title,
          brand: data.basicInfo.brand,
          category: data.basicInfo.category,
          subcategory: data.basicInfo.subcategory,
          description: data.basicInfo.description,
          keyFeatures: data.basicInfo.keyFeatures,
        },
        price: {
          regular: Number(data.price.regular),
          discounted: data.price.discounted ? Number(data.price.discounted) : undefined,
          selectedVariant: data.price.selectedVariant,
        },
        stockStatus: data.stockStatus,
        stockQuantity: Number(data.stockQuantity),
        sold: 0,
        images: data.images.map(image => ({
          url: image.url,
          alt: image.alt,
        })),
        variants: data.variants.map(variant => ({
          name: variant.name,
          value: variant.value,
          price: Number(variant.price),
        })),
        specifications: data.specifications.map(spec => ({
          group: spec.group,
          items: spec.items.map(item => ({
            name: item.name,
            value: item.value,
          })),
        })),
        reviews: [],
        rating: {
          average: 0,
          count: 0,
        },
        relatedProducts: [],
        tags: data.tags,
        shippingDetails: {
          length: Number(data.shippingDetails.length),
          width: Number(data.shippingDetails.width),
          height: Number(data.shippingDetails.height),
          weight: Number(data.shippingDetails.weight),
          dimensionUnit: data.shippingDetails.dimensionUnit,
          weightUnit: data.shippingDetails.weightUnit,
        },
        additionalInfo: {
          freeShipping: data.additionalInfo.freeShipping,
          isFeatured: data.additionalInfo.isFeatured,
          isOnSale: data.additionalInfo.isOnSale,
          estimatedDelivery: data.additionalInfo.estimatedDelivery,
          returnPolicy: data.additionalInfo.returnPolicy,
          warranty: data.additionalInfo.warranty,
        },
        seo: {
          metaTitle: data.seo.metaTitle,
          metaDescription: data.seo.metaDescription,
          slug: data.seo.slug,
        },
      };
      console.log("productData:", productData);
      // Call the addProduct mutation
      const result = await addProduct(productData).unwrap();
      console.log("result:", result);
      if (result.success) {
        toast.success("Product added successfully!");
      } else {
        if (result.message === "Invalid ID") {
          toast.error("Failed to add product: Product Code is required and must be unique.");
        } else {
          toast.error("Failed to add product: " + result.message);
        }
      }
    } catch (error) {
      if (error.status === 400 && error.data && error.data.code === 11000) {
        toast.error("Failed to add product: Product Code must be unique.");
      } else {
        toast.error("Failed to add product: " + (error.data?.message || error.message || "Unknown error"));
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the form
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-7xl mx-auto p-8 bg-white shadow-2xl rounded-2xl"
    >
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">
        Add New Product
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {/* Basic Information Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">
              Basic Information
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Product Code</span>
                <input
                  {...register("basicInfo.productCode")}
                  placeholder="Enter product code"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">Leave blank for auto-generated code</p>
                {errors.basicInfo?.productCode && (
                  <span className="text-red-500">
                    {errors.basicInfo.productCode.message}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="text-gray-700">Title</span>
                <input
                  {...register("basicInfo.title", {
                    required: "Title is required",
                  })}
                  placeholder="Enter product title"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.basicInfo?.title && (
                  <span className="text-red-500">
                    {errors.basicInfo.title.message}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="text-gray-700">Brand</span>
                <input
                  {...register("basicInfo.brand", {
                    required: "Brand is required",
                  })}
                  placeholder="Enter brand name"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.basicInfo?.brand && (
                  <span className="text-red-500">
                    {errors.basicInfo.brand.message}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="text-gray-700">Category</span>
                <select
                  {...register("basicInfo.category", {
                    required: "Category is required",
                  })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                >
                  <option value="">Select category</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="gadgets">Gadgets</option>
                  <option value="furniture">Furniture</option>
                  <option value="homeDecorations">Home Decorations</option>
                  <option value="beauty">Beauty</option>
                  <option value="sports">Sports</option>
                </select>
                {errors.basicInfo?.category && (
                  <span className="text-red-500">
                    {errors.basicInfo.category.message}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="text-gray-700">Subcategory</span>
                <input
                  {...register("basicInfo.subcategory")}
                  placeholder="Enter product subcategory"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
              </label>
            </div>
            <label className="block mt-4">
              <span className="text-gray-700">Description</span>
              <textarea
                {...register("basicInfo.description", {
                  required: "Description is required",
                })}
                placeholder="Enter product description"
                className="w-full p-3 border-2 border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                rows="4"
              />
              {errors.basicInfo?.description && (
                <span className="text-red-500">
                  {errors.basicInfo.description.message}
                </span>
              )}
            </label>

            {/* Key Features Section */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                Key Features
              </h3>
              {keyFeatureFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <input
                    {...register(`basicInfo.keyFeatures.${index}`, {
                      required: "Key Feature is required",
                    })}
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
              {errors.basicInfo?.keyFeatures && (
                <span className="text-red-500">
                  {errors.basicInfo.keyFeatures.message}
                </span>
              )}
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
            <h2 className="text-3xl font-bold mb-6 text-gray-700">
              Price Information
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Regular Price</span>
                <input
                  {...register("price.regular", {
                    required: "Regular price is required",
                    min: 0,
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Enter regular price"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.price?.regular && (
                  <span className="text-red-500">
                    {errors.price.regular.message}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="text-gray-700">Discounted Price (Optional)</span>
                <input
                  {...register("price.discounted", {
                    min: 0,
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Enter discounted price"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.price?.discounted && (
                  <span className="text-red-500">
                    {errors.price.discounted.message}
                  </span>
                )}
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
            <h2 className="text-3xl font-bold mb-6 text-gray-700">
              Stock Information
            </h2>
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
                  {...register("stockQuantity", {
                    min: 0,
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Enter stock quantity"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.stockQuantity && (
                  <span className="text-red-500">
                    {errors.stockQuantity.message}
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Shipping Details Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">
              Shipping Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">Length</span>
                <input
                  {...register("shippingDetails.length", {
                    min: 0,
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Enter length"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.shippingDetails?.length && (
                  <span className="text-red-500">
                    {errors.shippingDetails.length.message}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="text-gray-700">Width</span>
                <input
                  {...register("shippingDetails.width", {
                    min: 0,
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Enter width"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.shippingDetails?.width && (
                  <span className="text-red-500">
                    {errors.shippingDetails.width.message}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="text-gray-700">Height</span>
                <input
                  {...register("shippingDetails.height", {
                    min: 0,
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Enter height"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.shippingDetails?.height && (
                  <span className="text-red-500">
                    {errors.shippingDetails.height.message}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="text-gray-700">Weight</span>
                <input
                  {...register("shippingDetails.weight", {
                    min: 0,
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Enter weight"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                />
                {errors.shippingDetails?.weight && (
                  <span className="text-red-500">
                    {errors.shippingDetails.weight.message}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="text-gray-700">Dimension Unit</span>
                <select
                  {...register("shippingDetails.dimensionUnit")}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
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
            <h2 className="text-3xl font-bold mb-6 text-gray-700">
              Additional Information
            </h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("additionalInfo.freeShipping")}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-lg font-medium text-gray-700">
                  Free Shipping
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("additionalInfo.isFeatured")}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-lg font-medium text-gray-700">
                  Featured Product
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("additionalInfo.isOnSale")}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-lg font-medium text-gray-700">
                  On Sale
                </span>
              </label>
            </div>
            <label className="block mt-4">
              <span className="text-gray-700">Estimated Delivery</span>
              <input
                {...register("additionalInfo.estimatedDelivery")}
                placeholder="Enter estimated delivery"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
              />
            </label>
            <label className="block mt-2">
              <span className="text-gray-700">Return Policy</span>
              <input
                {...register("additionalInfo.returnPolicy")}
                placeholder="Enter return policy"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
              />
            </label>
            <label className="block mt-2">
              <span className="text-gray-700">Warranty</span>
              <input
                {...register("additionalInfo.warranty")}
                placeholder="Enter warranty information"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
              />
            </label>
          </div>

          {/* SEO Information Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">
              SEO Information
            </h2>
            <label className="block mb-2">
              <span className="text-gray-700">Meta Title</span>
              <input
                {...register("seo.metaTitle", {
                  required: "Meta Title is required",
                })}
                placeholder="Enter meta title"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
              />
              {errors.seo?.metaTitle && (
                <span className="text-red-500">
                  {errors.seo.metaTitle.message}
                </span>
              )}
            </label>
            <label className="block mb-2">
              <span className="text-gray-700">Meta Description</span>
              <textarea
                {...register("seo.metaDescription", {
                  required: "Meta Description is required",
                })}
                placeholder="Enter meta description"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                rows="3"
              />
              {errors.seo?.metaDescription && (
                <span className="text-red-500">
                  {errors.seo.metaDescription.message}
                </span>
              )}
            </label>
            <label className="block">
              <span className="text-gray-700">Slug</span>
              <input
                {...register("seo.slug", { required: "Slug is required" })}
                placeholder="Enter slug"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
              />
              {errors.seo?.slug && (
                <span className="text-red-500">{errors.seo.slug.message}</span>
              )}
            </label>
          </div>
        </div>

        <div>
          {/* Tags Section */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Tags</h2>
            {tagFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <label className="flex-grow">
                  <span className="text-gray-700">Tag</span>
                  <input
                    {...register(`tags.${index}`, {
                      required: "Tag is required",
                    })}
                    placeholder="Enter tag"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                  {errors.tags?.[index] && (
                    <span className="text-red-500">
                      {errors.tags[index].message}
                    </span>
                  )}
                </label>
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
              <div
                key={field.id}
                className="mb-4 p-4 border-2 border-gray-300 rounded-lg"
              >
                <label className="block mb-2">
                  <span className="text-gray-700">Image URL</span>
                  <input
                    {...register(`images.${index}.url`, {
                      required: "Image URL is required",
                    })}
                    placeholder="Enter image URL"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                  {errors.images?.[index]?.url && (
                    <span className="text-red-500">
                      {errors.images[index].url.message}
                    </span>
                  )}
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Image Alt Text</span>
                  <input
                    {...register(`images.${index}.alt`, {
                      required: "Image Alt Text is required",
                    })}
                    placeholder="Enter image alt text"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                  {errors.images?.[index]?.alt && (
                    <span className="text-red-500">
                      {errors.images[index].alt.message}
                    </span>
                  )}
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
              <div
                key={field.id}
                className="mb-4 p-4 border-2 border-gray-300 rounded-lg"
              >
                <label className="block mb-2">
                  <span className="text-gray-700">Variant Name</span>
                  <input
                    {...register(`variants.${index}.name`, {
                      required: "Variant name is required",
                    })}
                    placeholder="Enter variant name"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                  {errors.variants?.[index]?.name && (
                    <span className="text-red-500">
                      {errors.variants[index].name.message}
                    </span>
                  )}
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Variant Value</span>
                  <input
                    {...register(`variants.${index}.value`, {
                      required: "Variant value is required",
                    })}
                    placeholder="Enter variant value"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                  {errors.variants?.[index]?.value && (
                    <span className="text-red-500">
                      {errors.variants[index].value.message}
                    </span>
                  )}
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Variant Price</span>
                  <input
                    {...register(`variants.${index}.price`, {
                      required: "Variant price is required",
                      min: 0,
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="Enter variant price"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                  {errors.variants?.[index]?.price && (
                    <span className="text-red-500">
                      {errors.variants[index].price.message}
                    </span>
                  )}
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
            <h2 className="text-3xl font-bold mb-6 text-gray-700">
              Specifications
            </h2>
            {specificationFields.map((field, index) => (
              <div
                key={index}
                className="mb-4 p-4 border-2 border-gray-300 rounded-lg"
              >
                <label className="block mb-2">
                  <span className="text-gray-700">Specification Group</span>
                  <input
                    {...register(`specifications.${index}.group`, {
                      required: "Specification group is required",
                    })}
                    placeholder="Enter specification group"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                  />
                  {errors.specifications?.[index]?.group && (
                    <span className="text-red-500">
                      {errors.specifications[index].group.message}
                    </span>
                  )}
                </label>
                {field.items.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <label className="flex-grow">
                      <span className="text-gray-700">Specification Name</span>
                      <input
                        {...register(
                          `specifications.${index}.items.${itemIndex}.name`,
                          { required: "Specification name is required" }
                        )}
                        placeholder="Enter specification name"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                      />
                      {errors.specifications?.[index]?.items?.[itemIndex]
                        ?.name && (
                        <span className="text-red-500">
                          {
                            errors.specifications[index].items[itemIndex].name
                              .message
                          }
                        </span>
                      )}
                    </label>
                    <label className="flex-grow">
                      <span className="text-gray-700">Specification Value</span>
                      <input
                        {...register(
                          `specifications.${index}.items.${itemIndex}.value`,
                          { required: "Specification value is required" }
                        )}
                        placeholder="Enter specification value"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1"
                      />
                      {errors.specifications?.[index]?.items?.[itemIndex]
                        ?.value && (
                        <span className="text-red-500">
                          {
                            errors.specifications[index].items[itemIndex].value
                              .message
                          }
                        </span>
                      )}
                    </label>
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
                  onClick={() =>
                    appendSpecification({
                      group: "",
                      items: [{ name: "", value: "" }],
                    })
                  }
                  className="mt-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
                >
                  Add Specification Item
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendSpecification({
                  group: "",
                  items: [{ name: "", value: "" }],
                })
              }
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
        {isSubmitting ? "Adding Product..." : "Add Product"}
      </button>
    </form>
  );
}
