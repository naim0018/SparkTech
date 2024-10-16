// Import necessary dependencies and icons
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddProductMutation } from "../../../../redux/api/ProductApi";
import BasicInformation from "./BasicInformation";
import ShippingDetails from "./ShippingDetails";
import AdditionalOptions from "./AdditionalOptions";
import ProductTags from "./ProductTags";
import ProductVariants from "./ProductVariants";
import Specification from "./Specification";
import ProductImages from "./ProductImages";

export default function AddProductForm() {
  // State for form submission and input focus
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const [discountedPercentage, setDiscountedPercentage] = useState(0);


  // Initialize react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      isFeatured: false,
      isOnSale: false,
      price: {
        regular: 0,
        discounted: 0,
      },
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

  // Watch for changes in regular and discounted prices
  const regularPrice = watch("price.regular");
  const discountedPrice = watch("price.discounted");

  // Calculate savings percentage when prices change
  useEffect(() => {
    if (regularPrice && discountedPrice) {
      const regular = parseFloat(regularPrice);
      const discounted = parseFloat(discountedPrice);
      if (regular > 0 && discounted < regular) {
        const savings = ((regular - discounted) / regular) * 100;
        setDiscountedPercentage(savings.toFixed(2));
      } else {
        setDiscountedPercentage(0);
      }
    }
  }, [regularPrice, discountedPrice]);

  // Function to handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Prepare the data
      const productData = {
        ...data,
        tags,
        stockStatus: data.stockQuantity > 0 ? "In Stock" : "Out of Stock",
        rating: { average: 0, count: 0 },
        reviews: [],
        relatedProducts: [],
        paymentOptions: [],
        keyFeatures: [],
        price: {
          regular: Number(data.price.regular),
          discounted: Number(data.price.discounted),
          savings: Number(data.price.regular) - Number(data.price.discounted),
          savingsPercentage: Number(discountedPercentage),
        },
        stockQuantity: Number(data.stockQuantity),
        dimensions: {
          length: Number(data.dimensions.length),
          width: Number(data.dimensions.width),
          height: Number(data.dimensions.height),
          unit: data.dimensions.unit,
        },
      };

      // Validate image URL
      if (productData.images[0].url && !isValidUrl(productData.images[0].url)) {
        throw new Error("Invalid image URL");
      }

      // Send the data using productsapi
      const response = await addProduct(productData).unwrap();
      console.log(response);

      // Reset the form
      reset();
      setTags([]);

      // Show success message
      toast.success("Product added successfully!");
    } catch (error) {
      // Handle error
      toast.error("Failed to add product. Please check all fields and try again.");
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (error) {
      // Log the error for debugging purposes
      console.error("URL validation error:", error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-100 mb-8">
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
                <BasicInformation 
                  register={register} 
                  errors={errors} 
                  watch={watch}
                  savingsPercentage={discountedPercentage}
                />

                {/* Shipping Details */}
                <ShippingDetails register={register} errors={errors} />

                {/* Additional Options */}
                <AdditionalOptions register={register} errors={errors} />
              </div>

              <div className="space-y-8">
                {/* Product Tags */}
                <ProductTags
                  tags={tags}
                  removeTag={removeTag}
                  inputRef={inputRef}
                  input={input}
                  setInput={setInput}
                  addTag={addTag}
                />

                {/* Product Images */}
                <ProductImages
                  register={register}
                  imageFields={imageFields}
                  removeImage={removeImage}
                  appendImage={appendImage}
                />

                {/* Specifications */}
                <Specification
                  register={register}
                  specificationFields={specificationFields}
                  removeSpecification={removeSpecification}
                  appendSpecification={appendSpecification}
                  errors={errors}
                />

                {/* Product Variants */}
                <ProductVariants
                  register={register}
                  variantFields={variantFields}
                  removeVariant={removeVariant}
                  appendVariant={appendVariant}
                  
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-700 text-white p-4 rounded-lg font-semibold text-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
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
