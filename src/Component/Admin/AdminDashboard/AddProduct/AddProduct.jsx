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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const [discountedPercentage, setDiscountedPercentage] = useState(0);

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

  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");

  const addTag = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      setTags([...tags, input.trim()]);
      setInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tags]);

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

  const [addProduct, { isLoading }] = useAddProductMutation();

  const regularPrice = watch("price.regular");
  const discountedPrice = watch("price.discounted");

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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
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

      if (productData.images[0].url && !isValidUrl(productData.images[0].url)) {
        throw new Error("Invalid image URL");
      }

      const response = await addProduct(productData).unwrap();
      console.log(response);

      reset();
      setTags([]);

      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product. Please check all fields and try again.");
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (error) {
      console.error("URL validation error:", error);
      return false;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-9xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        <div className="px-6 py-8 sm:px-10 sm:py-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
            Create New Product
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-10">
                <BasicInformation 
                  register={register} 
                  errors={errors} 
                  watch={watch}
                  savingsPercentage={discountedPercentage}
                />
                <ShippingDetails register={register} errors={errors} />
                <AdditionalOptions register={register} errors={errors} />
              </div>
              <div className="space-y-10">
                <ProductTags
                  tags={tags}
                  removeTag={removeTag}
                  inputRef={inputRef}
                  input={input}
                  setInput={setInput}
                  addTag={addTag}
                />
                <ProductImages
                  register={register}
                  imageFields={imageFields}
                  removeImage={removeImage}
                  appendImage={appendImage}
                />
                <Specification
                  register={register}
                  specificationFields={specificationFields}
                  removeSpecification={removeSpecification}
                  appendSpecification={appendSpecification}
                  errors={errors}
                />
                <ProductVariants
                  register={register}
                  variantFields={variantFields}
                  removeVariant={removeVariant}
                  appendVariant={appendVariant}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Add Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
