import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "../../../../redux/api/ProductApi";
import { toast } from "react-toastify";
import { useTheme } from "../../../../ThemeContext";
import { FaBox, FaTag, FaImage, FaCog, FaTruck, FaInfo, FaSearch, FaDollarSign, FaWarehouse, FaPlus } from 'react-icons/fa';

// Component imports
import BasicInformation from "./Components/BasicInformation";
import PriceInformation from "./Components/PriceInformation";
import StockInformation from "./Components/StockInformation";
import ImageSection from "./Components/ImageSection";
import VariantSection from "./Components/VariantSection";
import SpecificationSection from "./Components/SpecificationSection";
import ShippingDetails from "./Components/ShippingDetails";
import AdditionalInfo from "./Components/AdditionalInfo";
import SEOSection from "./Components/SEOSection";
import TagsSection from "./Components/TagsSection";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  { name: 'Basic Info', icon: FaBox, component: BasicInformation },
  { name: 'Price', icon: FaDollarSign, component: PriceInformation },
  { name: 'Stock', icon: FaWarehouse, component: StockInformation },
  { name: 'Images', icon: FaImage, component: ImageSection },
  { name: 'Tags', icon: FaTag, component: TagsSection },
  { name: 'Variants', icon: FaCog, component: VariantSection },
  { name: 'Specifications', icon: FaInfo, component: SpecificationSection },
  { name: 'Shipping', icon: FaTruck, component: ShippingDetails },
  { name: 'Additional Info', icon: FaPlus, component: AdditionalInfo },
  { name: 'SEO', icon: FaSearch, component: SEOSection },
];

export default function AddProduct01() {
  const [addProduct] = useAddProductMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDarkMode } = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);

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
        savings: 0,
        savingsPercentage: 0,
        selectedVariants: new Map()
      },
      stockStatus: "In Stock",
      stockQuantity: 0,
      sold: 0,
      images: [{ url: "", alt: "" }],
      variants: [{
        group: "",
        items: [{
          value: "",
          price: 0,
          stock: 0,
          image: {
            url: "",
            alt: ""
          }
        }]
      }],
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
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const productData = {
        basicInfo: {
          productCode: data.basicInfo.productCode,
          title: data.basicInfo.title,
          brand: data.basicInfo.brand,
          category: data.basicInfo.category,
          subcategory: data.basicInfo.subcategory,
          description: data.basicInfo.description,
          keyFeatures: data.basicInfo.keyFeatures.filter(feature => feature.trim() !== ""),
        },
        price: {
          regular: Number(data.price.regular),
          discounted: data.price.discounted ? Number(data.price.discounted) : undefined,
          savings: Number(data.price.savings),
          savingsPercentage: Number(data.price.savingsPercentage),
          selectedVariants: data.price.selectedVariants
        },
        stockStatus: data.stockStatus,
        stockQuantity: Number(data.stockQuantity),
        sold: Number(data.sold),
        images: data.images.filter(image => image.url.trim() !== ""),
        variants: data.variants
          .filter(variant => variant.group.trim() !== "")
          .map(variant => ({
            group: variant.group,
            items: variant.items
              .filter(item => item.value.trim() !== "")
              .map(item => ({
                value: item.value,
                price: Number(item.price),
                stock: Number(item.stock),
                image: {
                  url: item.image.url,
                  alt: item.image.alt
                }
              }))
          })),
        specifications: data.specifications
          .filter(spec => spec.group.trim() !== "")
          .map(spec => ({
            group: spec.group,
            items: spec.items
              .filter(item => item.name.trim() !== "" && item.value.trim() !== "")
              .map(item => ({
                name: item.name,
                value: item.value
              }))
          })),
        shippingDetails: {
          length: Number(data.shippingDetails.length),
          width: Number(data.shippingDetails.width),
          height: Number(data.shippingDetails.height),
          weight: Number(data.shippingDetails.weight),
          dimensionUnit: data.shippingDetails.dimensionUnit,
          weightUnit: data.shippingDetails.weightUnit,
        },
        additionalInfo: {
          freeShipping: Boolean(data.additionalInfo.freeShipping),
          isFeatured: Boolean(data.additionalInfo.isFeatured),
          isOnSale: Boolean(data.additionalInfo.isOnSale),
          estimatedDelivery: data.additionalInfo.estimatedDelivery,
          returnPolicy: data.additionalInfo.returnPolicy,
          warranty: data.additionalInfo.warranty,
        },
        seo: {
          metaTitle: data.seo.metaTitle || undefined,
          metaDescription: data.seo.metaDescription || undefined,
          slug: data.seo.slug || undefined,
        },
        tags: data.tags.filter(tag => tag.trim() !== ""),
      };

      const result = await addProduct(productData).unwrap();
      if (result.success) {
        toast.success("Product added successfully!");
        // Optionally reset form or redirect
      } else {
        toast.error(result.message || "Failed to add product");
      }
    } catch (error) {
      toast.error(error.message || "Failed to add product");
      console.error('Add product error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8">
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Add New Product
            </h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Fill in the information below to create a new product
            </p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <nav className={`space-y-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4`}>
                {tabs.map((tab, index) => (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => setSelectedTab(index)}
                    className={classNames(
                      selectedTab === index
                        ? `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-600'}`
                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`,
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full'
                    )}
                  >
                    <tab.icon 
                      className={classNames(
                        selectedTab === index
                          ? 'text-blue-500'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                      )}
                    />
                    <span className="truncate">{tab.name}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              {tabs.map((Tab, index) => (
                <div
                  key={Tab.name}
                  className={selectedTab === index ? 'block' : 'hidden'}
                >
                  <Tab.component
                    register={register}
                    control={control}
                    errors={errors}
                    isDarkMode={isDarkMode}
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
