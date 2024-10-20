import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddProductMutation } from "../../../../redux/api/ProductApi";

export default function AddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      basicInfo: {
        productCode: "",
        title: "",
        brand: "",
        category: "",
        subcategory: "",
        description: "",
        keyFeatures: [""]
      },
      price: {
        regular: 0,
        discounted: 0,
        selectedVariant: ""
      },
      stockStatus: "In Stock",
      stockQuantity: 0,
      images: [{ url: "", alt: "" }],
      variants: [{ name: "", value: "", price: 0 }],
      specifications: [{ group: "", items: [{ name: "", value: "" }] }],
      tags: [""],
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: "cm"
      },
      shipping: {
        shippingWeight: 0,
        shippingWeightUnit: "kg"
      },
      additionalInfo: {
        freeShipping: false,
        isFeatured: false,
        isOnSale: false,
        estimatedDelivery: "",
        returnPolicy: "",
        warranty: ""
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
        slug: ""
      }
    }
  });

  const { fields: keyFeatureFields, append: appendKeyFeature, remove: removeKeyFeature } = useFieldArray({
    control,
    name: "basicInfo.keyFeatures"
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images"
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants"
  });

  const { fields: specificationFields, append: appendSpecification, remove: removeSpecification } = useFieldArray({
    control,
    name: "specifications"
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: "tags"
  });

  const [addProduct] = useAddProductMutation();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const productData = {
        ...data,
        sold: 0,
        reviews: [],
        rating: { average: 0, count: 0 },
        relatedProducts: []
      };
      await addProduct(productData).unwrap();
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto p-8 bg-white shadow-2xl rounded-2xl">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">Add New Product</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Basic Information</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Product Code</span>
                <input {...register("basicInfo.productCode", { required: "Product Code is required" })} placeholder="Enter product code" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
              <label className="block">
                <span className="text-gray-700">Title</span>
                <input {...register("basicInfo.title", { required: "Title is required" })} placeholder="Enter product title" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
              <label className="block">
                <span className="text-gray-700">Brand</span>
                <input {...register("basicInfo.brand", { required: "Brand is required" })} placeholder="Enter brand name" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
              <label className="block">
                <span className="text-gray-700">Category</span>
                <input {...register("basicInfo.category", { required: "Category is required" })} placeholder="Enter product category" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
              <label className="block">
                <span className="text-gray-700">Subcategory</span>
                <input {...register("basicInfo.subcategory")} placeholder="Enter product subcategory" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
            </div>
            <label className="block mt-4">
              <span className="text-gray-700">Description</span>
              <textarea {...register("basicInfo.description", { required: "Description is required" })} placeholder="Enter product description" className="w-full p-3 border-2 border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent" rows="4" />
            </label>
            
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-700">Key Features</h3>
              {keyFeatureFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2 mb-2">
                  <input {...register(`basicInfo.keyFeatures.${index}`, { required: "Key Feature is required" })} placeholder="Enter key feature" className="flex-grow p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
                  <button type="button" onClick={() => removeKeyFeature(index)} className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => appendKeyFeature("")} className="mt-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">Add Key Feature</button>
            </div>
          </div>

          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Price Information</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Regular Price</span>
                <input {...register("price.regular", { required: "Regular price is required", min: 0 })} type="number" placeholder="Enter regular price" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
              <label className="block">
                <span className="text-gray-700">Discounted Price</span>
                <input {...register("price.discounted", { min: 0 })} type="number" placeholder="Enter discounted price" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
              <label className="block">
                <span className="text-gray-700">Selected Variant</span>
                <input {...register("price.selectedVariant")} placeholder="Enter selected variant" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
            </div>
          </div>

          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Stock Information</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Stock Status</span>
                <select {...register("stockStatus")} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1">
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Back Order">Back Order</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Stock Quantity</span>
                <input {...register("stockQuantity", { min: 0 })} type="number" placeholder="Enter stock quantity" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
            </div>
          </div>

          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Dimensions</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">Length</span>
                <input {...register("dimensions.length", { min: 0 })} type="number" placeholder="Enter length" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
              <label className="block">
                <span className="text-gray-700">Width</span>
                <input {...register("dimensions.width", { min: 0 })} type="number" placeholder="Enter width" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
              <label className="block">
                <span className="text-gray-700">Height</span>
                <input {...register("dimensions.height", { min: 0 })} type="number" placeholder="Enter height" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
              <label className="block">
                <span className="text-gray-700">Unit</span>
                <select {...register("dimensions.unit")} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1">
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                  <option value="mm">mm</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Shipping</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">Shipping Weight</span>
                <input {...register("shipping.shippingWeight", { min: 0 })} type="number" placeholder="Enter shipping weight" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
              </label>
              <label className="block">
                <span className="text-gray-700">Shipping Weight Unit</span>
                <select {...register("shipping.shippingWeightUnit")} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1">
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                  <option value="oz">oz</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Additional Information</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register("additionalInfo.freeShipping")} className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="text-lg font-medium text-gray-700">Free Shipping</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register("additionalInfo.isFeatured")} className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="text-lg font-medium text-gray-700">Featured Product</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register("additionalInfo.isOnSale")} className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="text-lg font-medium text-gray-700">On Sale</span>
              </label>
            </div>
            <label className="block mt-4">
              <span className="text-gray-700">Estimated Delivery</span>
              <input {...register("additionalInfo.estimatedDelivery")} placeholder="Enter estimated delivery" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
            </label>
            <label className="block mt-2">
              <span className="text-gray-700">Return Policy</span>
              <input {...register("additionalInfo.returnPolicy")} placeholder="Enter return policy" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
            </label>
            <label className="block mt-2">
              <span className="text-gray-700">Warranty</span>
              <input {...register("additionalInfo.warranty")} placeholder="Enter warranty information" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
            </label>
          </div>

          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">SEO Information</h2>
            <label className="block mb-2">
              <span className="text-gray-700">Meta Title</span>
              <input {...register("seo.metaTitle")} placeholder="Enter meta title" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
            </label>
            <label className="block mb-2">
              <span className="text-gray-700">Meta Description</span>
              <textarea {...register("seo.metaDescription")} placeholder="Enter meta description" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" rows="3" />
            </label>
            <label className="block">
              <span className="text-gray-700">Slug</span>
              <input {...register("seo.slug")} placeholder="Enter slug" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
            </label>
          </div>
        </div>

        <div>
          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Tags</h2>
            {tagFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <label className="flex-grow">
                  <span className="text-gray-700">Tag</span>
                  <input {...register(`tags.${index}`, { required: "Tag is required" })} placeholder="Enter tag" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
                </label>
                <button type="button" onClick={() => removeTag(index)} className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => appendTag("")} className="mt-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">Add Tag</button>
          </div>

          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Images</h2>
            {imageFields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border-2 border-gray-300 rounded-lg">
                <label className="block mb-2">
                  <span className="text-gray-700">Image URL</span>
                  <input {...register(`images.${index}.url`, { required: "Image URL is required" })} placeholder="Enter image URL" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Image Alt Text</span>
                  <input {...register(`images.${index}.alt`)} placeholder="Enter image alt text" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
                </label>
                <button type="button" onClick={() => removeImage(index)} className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md">Remove Image</button>
              </div>
            ))}
            <button type="button" onClick={() => appendImage({ url: "", alt: "" })} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">Add Image</button>
          </div>

          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Variants</h2>
            {variantFields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border-2 border-gray-300 rounded-lg">
                <label className="block mb-2">
                  <span className="text-gray-700">Variant Name</span>
                  <input {...register(`variants.${index}.name`, { required: "Variant name is required" })} placeholder="Enter variant name" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Variant Value</span>
                  <input {...register(`variants.${index}.value`, { required: "Variant value is required" })} placeholder="Enter variant value" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Variant Price</span>
                  <input {...register(`variants.${index}.price`, { required: "Variant price is required", min: 0 })} type="number" placeholder="Enter variant price" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
                </label>
                <button type="button" onClick={() => removeVariant(index)} className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md">Remove Variant</button>
              </div>
            ))}
            <button type="button" onClick={() => appendVariant({ name: "", value: "", price: 0 })} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">Add Variant</button>
          </div>

          <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Specifications</h2>
            {specificationFields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border-2 border-gray-300 rounded-lg">
                <label className="block mb-2">
                  <span className="text-gray-700">Specification Group</span>
                  <input {...register(`specifications.${index}.group`, { required: "Specification group is required" })} placeholder="Enter specification group" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
                </label>
                {field.items.map((item, itemIndex) => (
                  <div key={item.id} className="flex items-center space-x-2 mb-2">
                    <label className="flex-grow">
                      <span className="text-gray-700">Specification Name</span>
                      <input {...register(`specifications.${index}.items.${itemIndex}.name`, { required: "Specification name is required" })} placeholder="Enter specification name" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
                    </label>
                    <label className="flex-grow">
                      <span className="text-gray-700">Specification Value</span>
                      <input {...register(`specifications.${index}.items.${itemIndex}.value`, { required: "Specification value is required" })} placeholder="Enter specification value" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" />
                    </label>
                    <button type="button" onClick={() => removeSpecification(index)} className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => appendSpecification({ group: "", items: [{ name: "", value: "" }] })} className="mt-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">Add Specification Item</button>
              </div>
            ))}
            <button type="button" onClick={() => appendSpecification({ group: "", items: [{ name: "", value: "" }] })} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">Add Specification Group</button>
          </div>
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full p-4 bg-blue-500 text-white rounded-xl text-xl font-bold hover:bg-blue-600 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
        {isSubmitting ? "Adding Product..." : "Add Product"}
      </button>
    </form>
  );
}
