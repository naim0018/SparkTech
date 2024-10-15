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

const UpdateProducts = ({ products, closeModal }) => {
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
    const [updateProduct] = useUpdateProductMutation();
    const [productsData, setProductsData] = useState(null)
    const [updateError, setUpdateError] = useState(null);
    const [tags, setTags] = useState([]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

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

    useEffect(() => {
        if (products) {
            setProductsData(products);
            setTags(products.tags || []);
            // Pre-fill the form with existing product data
            Object.entries(products).forEach(([key, value]) => {
                setValue(key, value);
            });
        }
    }, [products, setValue]);

    const onSubmit = async (data) => {
        try {
            const updatedData = { ...data, tags };
            const result = await updateProduct({ id: products._id, ...updatedData }).unwrap();
            if (result.error) {
                throw new Error(result.error);
            }
            toast.success("Product updated successfully");
            closeModal();
        } catch (error) {
            const errorMessage = error.data?.message || error.message || "Failed to update product";
            toast.error(errorMessage);
            setUpdateError(errorMessage);
            console.error("Update failed:", error);
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={20} />
                </button>
                <h1 className="text-2xl font-bold mb-4">Update Product</h1>
                {updateError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{updateError}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                            <p className="text-xl text-gray-500 font-semibold">Loading product data...</p>
                        </div>
                    )}
                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                        >
                            Update Product
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-200"
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
