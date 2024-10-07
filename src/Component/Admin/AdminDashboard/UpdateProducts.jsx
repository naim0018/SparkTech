/* eslint-disable react/prop-types */

import { useForm } from "react-hook-form"
import AdditionalOptions from "./AddProduct/AdditionalOptions"
import { useUpdateProductMutation } from "../../../redux/api/ProductApi"
import { toast } from "react-toastify"
import { FaTimes } from "react-icons/fa"
import BasicInformation from "./AddProduct/BasicInformation"
import { useEffect, useState } from "react"
import ProductTags from "./AddProduct/ProductTags"
import ProductImages from "./AddProduct/ProductImages"
import Specification from "./AddProduct/Specification"
import ProductVariants from "./AddProduct/ProductVariants"
import ShippingDetails from "./AddProduct/ShippingDetails"

const UpdateProducts = ({ products, closeModal }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [updateProduct] = useUpdateProductMutation();
    const [productsData, setProductsData] = useState()
    const [updateError, setUpdateError] = useState(null);

    useEffect(() => {
        setProductsData(products)
    }, [products])

    const onSubmit = async (data) => {
        try {
            const result = await updateProduct({ id: products._id, ...data }).unwrap();
            if (result.error) {
                console.log(result.error)
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
        <div className="p-4 relative">
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
            <form onSubmit={handleSubmit(onSubmit)}>
            {
                productsData ? (<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                      {/* Basic Information */}
                      <BasicInformation register={register} errors={errors} defaultValues={productsData} />
      
                      {/* Shipping Details */}
                      <ShippingDetails 
                        register={register} 
                        errors={errors} 
                        defaultValues={productsData || {}}
                      />
      
                      {/* Additional Options */}
                      <AdditionalOptions 
                        register={register} 
                        errors={errors} 
                        defaultValues={productsData || {}}
                      />
                    </div>
      
                    <div className="space-y-8">
                      {/* Product Tags */}
                      <ProductTags
                        tags={productsData?.tags || []}
                        removeTag={(index) => {
                          const newTags = [...productsData.tags];
                          newTags.splice(index, 1);
                          setProductsData({...productsData, tags: newTags});
                        }}
                        addTag={(tag) => {
                          setProductsData({...productsData, tags: [...productsData.tags, tag]});
                        }}
                      />
      
                      {/* Product Images */}
                      <ProductImages
                        register={register}
                        imageFields={productsData?.images || []}
                        removeImage={(index) => {
                          const newImages = [...productsData.images];
                          newImages.splice(index, 1);
                          setProductsData({...productsData, images: newImages});
                        }}
                        appendImage={(image) => {
                          setProductsData({...productsData, images: [...productsData.images, image]});
                        }}
                        defaultValues={productsData || {}}
                      />
      
                      {/* Specifications */}
                      <Specification
                        register={register}
                        specificationFields={productsData?.specifications || []}
                        removeSpecification={(index) => {
                          const newSpecs = [...productsData.specifications];
                          newSpecs.splice(index, 1);
                          setProductsData({...productsData, specifications: newSpecs});
                        }}
                        appendSpecification={(spec) => {
                          setProductsData({...productsData, specifications: [...productsData.specifications, spec]});
                        }}
                        errors={errors}
                        defaultValues={productsData || {}}
                      />
      
                      {/* Product Variants */}
                      <ProductVariants
                        register={register}
                        variantFields={productsData?.variants || []}
                        defaultValues={productsData || {}}
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
                  </div>) : (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-xl text-gray-500 font-semibold">No product data available for update</p>
                    </div>
                  )
            }
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UpdateProducts
