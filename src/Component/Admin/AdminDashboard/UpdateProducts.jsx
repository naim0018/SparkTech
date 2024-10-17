/* eslint-disable react/prop-types */

import { useForm } from "react-hook-form"
import AdditionalOptions from "./AddProduct/AdditionalOptions"
import { useUpdateProductMutation } from "../../../redux/api/ProductApi"
import { toast } from "react-toastify"
import { FaTimes } from "react-icons/fa"
import BasicInformation from "./AddProduct/BasicInformation"
import { useEffect, useRef, useState } from "react"
import ProductTags from "./AddProduct/ProductTags"
import ProductImages from "./AddProduct/ProductImages"
import Specification from "./AddProduct/Specification"
import ProductVariants from "./AddProduct/ProductVariants"
import ShippingDetails from "./AddProduct/ShippingDetails"

// Component for updating product information
const UpdateProducts = ({ products, closeModal }) => {
    const [updateProduct] = useUpdateProductMutation();
    const [productsData, setProductsData] = useState(null)
    const [updateError, setUpdateError] = useState(null);
    const [tags, setTags] = useState([]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
    // Function to add a new tag
    const addTag = (e) => {
        if (e.key === "Enter" && input.trim() !== "") {
            e.preventDefault(); // Prevent form submission
            setTags([...tags, input.trim()]);
            setInput("");
        }
    };

    // Function to remove a tag
    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    // Effect to focus on the input field after adding a tag
    useEffect(() => {
        if (inputRef.current) { 
            inputRef.current.focus();
        }
    }, [tags]);

    // Effect to initialize form with existing product data
    useEffect(() => {
        if (products) {
            setProductsData(products);
            setTags(products.tags || []);
            Object.entries(products).forEach(([key, value]) => {
                setValue(key, value);
            });
        }
    }, [products, setValue]);

    // Function to handle form submission
    const onSubmit = async (data) => {
        try {
            const updatedData = { ...data, tags };
            // Remove the _id field from updatedData
            const { ...productToUpdate } = updatedData;
            const result = await updateProduct({ id: products._id, ...productToUpdate }).unwrap();
            console.log({result})
            if (result.success) {
                toast.success("Product updated successfully");
                closeModal();
            }else{
                toast.error(result.message);
            }
        } catch (error) {
            const errorMessage = error.data?.message || error.message || "Failed to update product";
            toast.error(errorMessage);
            setUpdateError(errorMessage);
            console.error("Update failed:", error);
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full dark:bg-gray-800 dark:bg-opacity-75">
            <div className="relative top-20 mx-auto p-5 border border-red-300 w-11/12 shadow-lg rounded-md bg-white dark:bg-gray-900">
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500"
                >
                    <FaTimes size={20} />
                </button>
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Update Product</h1>
                {updateError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 dark:bg-red-200 dark:border-red-500 dark:text-red-800" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{updateError}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" onKeyPress={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
                    {productsData ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-8">
                                <BasicInformation register={register} errors={errors} defaultValues={productsData} watch={watch} />
                                <ShippingDetails register={register} errors={errors} defaultValues={productsData} />
                                <AdditionalOptions register={register} errors={errors} defaultValues={productsData} />
                            </div>
                            <div className="space-y-8">
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
                                    imageFields={productsData.images || []}
                                    removeImage={(index) => {
                                        const newImages = [...productsData.images];
                                        newImages.splice(index, 1);
                                        setProductsData({...productsData, images: newImages});
                                    }}
                                    appendImage={(image) => {
                                        setProductsData({...productsData, images: [...productsData.images, image]});
                                    }}
                                    defaultValues={productsData}
                                />
                                <Specification
                                    register={register}
                                    specificationFields={productsData.specifications || []}
                                    removeSpecification={(index) => {
                                        const newSpecs = [...productsData.specifications];
                                        newSpecs.splice(index, 1);
                                        setProductsData({...productsData, specifications: newSpecs});
                                    }}
                                    appendSpecification={(spec) => {
                                        setProductsData({...productsData, specifications: [...productsData.specifications, spec]});
                                    }}
                                    errors={errors}
                                    defaultValues={productsData}
                                />
                                <ProductVariants
                                    register={register}
                                    variantFields={productsData.variants || []}
                                    defaultValues={productsData}
                                    removeVariant={(index) => {
                                        const newVariants = [...productsData.variants];
                                        newVariants.splice(index, 1);
                                        setProductsData({...productsData, variants: newVariants});
                                    }}
                                    appendVariant={(variant) => {
                                        setProductsData({...productsData, variants: [...productsData.variants, variant]});
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-xl text-gray-500 font-semibold dark:text-gray-300">Loading product data...</p>
                        </div>
                    )}
                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                            Update Product
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-200 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateProducts
