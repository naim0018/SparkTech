"use client"

/* eslint-disable no-unused-vars */

import { useParams } from "react-router-dom"
import { useGetProductByIdQuery } from "../../../../redux/api/ProductApi"
import { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import CheckoutSection from "./CheckoutSection"
import { useDispatch } from "react-redux"
import { clearCart } from "../../../../redux/features/CartSlice"
import { useCreateOrderMutation } from "../../../../redux/api/OrderApi"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import OrderSuccessModal from "./OrderSuccessModal"
import LandingPageHeroSection from "./DecomposedLandingPage Component/LandingPageHeroSection"
import LandingPageProductDetails from "./DecomposedLandingPage Component/LandingPageProductDetails"

const LandingPage = () => {
  const { productId } = useParams()
  const { data, isLoading, error } = useGetProductByIdQuery(productId)
  const product = data?.data
  const dispatch = useDispatch()
  const [selectedVariants, setSelectedVariants] = useState(new Map())
  const [currentPrice, setCurrentPrice] = useState(0)
  const [currentImage, setCurrentImage] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successOrderDetails, setSuccessOrderDetails] = useState(null)

  useEffect(() => {
    if (product) {
      const initialPrice = product.price.discounted || product.price.regular
      setCurrentPrice(typeof initialPrice === "number" && !isNaN(initialPrice) ? initialPrice : 0)
      setSelectedVariants(new Map())
      setCurrentImage(product.images[0])
    }
    return () => {
      if (product) dispatch(clearCart())
    }
  }, [product, dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-red-100 p-6 rounded-lg">
          <p className="text-red-600 text-lg">Error loading product: {error.message}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-yellow-100 p-6 rounded-lg">
          <p className="text-yellow-700 text-lg">Product not found</p>
        </div>
      </div>
    )
  }

  // --- Variant Selection Logic ---
  const handleVariantSelect = (groupName, variant) => {
    const newSelectedVariants = new Map(selectedVariants)
    if (selectedVariants.get(groupName)?.value === variant.value) {
      newSelectedVariants.delete(groupName)
    } else {
      newSelectedVariants.set(groupName, {
        value: variant.value,
        price: variant.price,
        image: variant.image,
      })
    }

    // Price calculation: base + sum of variant prices
    let price = product.price.discounted || product.price.regular
    newSelectedVariants.forEach((v) => {
      if (typeof v.price === "number" && !isNaN(v.price)) price = v.price
    })
    setCurrentPrice(price)

    // Image update: last selected variant with image, else main image
    const lastWithImage = Array.from(newSelectedVariants.values())
      .reverse()
      .find((v) => v.image?.url)
    setCurrentImage(lastWithImage?.image || product.images[0])
    setSelectedVariants(newSelectedVariants)
  }

  // --- Quantity Logic ---
  const handleIncrement = () => setQuantity((q) => q + 1)
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1))

  // --- Order Logic ---
  const orderDetails = {
    title: product?.basicInfo?.title,
    price: currentPrice,
    variants: selectedVariants,
    quantity,
    image: currentImage,
    product,
  }

  const handleSubmit = async (formData) => {
    try {
      const orderData = {
        body: {
          items: [
            {
              product: productId,
              image: currentImage?.url,
              quantity,
              itemKey: `${productId}-${Date.now()}`,
              price: currentPrice,
              selectedVariants: Object.fromEntries(
                Array.from(selectedVariants.entries()).map(([group, variant]) => [
                  group,
                  { value: variant.value, price: variant.price || 0 },
                ]),
              ),
            },
          ],
          totalAmount: calculateTotalAmount(formData.courierCharge),
          status: "pending",
          billingInformation: {
            name: formData.name,
            email: formData.email || "no-email@example.com",
            phone: formData.phone,
            address: formData.address,
            country: "Bangladesh",
            paymentMethod: formData.paymentMethod,
            notes: formData.notes || "",
          },
          courierCharge: formData.courierCharge,
          cuponCode: formData.cuponCode || "",
        },
      }

      function calculateTotalAmount(courierChargeType) {
        const productTotal = currentPrice * quantity
        const deliveryCharge = courierChargeType === "insideDhaka" ? 80 : 150
        return productTotal + deliveryCharge
      }

      const response = await createOrder(orderData).unwrap()
      setSuccessOrderDetails({
        orderId: response.data._id,
        productPrice: currentPrice * quantity,
        deliveryCharge: formData.courierCharge === "insideDhaka" ? 80 : 150,
        totalAmount: orderData.body.totalAmount,
      })
      setShowSuccessModal(true)
      setQuantity(1)
      setSelectedVariants(new Map())
      setCurrentPrice(product.price.discounted || product.price.regular)
      setCurrentImage(product.images[0])
    } catch (error) {
      toast.error(
        <div>
          <h3 className="font-bold text-red-800">দুঃখিত! অর্ডার সম্পন্ন করা যায়নি।</h3>
          {error.data?.message && <p className="text-sm text-red-600 mt-1">কারণ: {error.data.message}</p>}
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "bg-red-50 border border-red-200",
        },
      )
    }
  }

  // --- Scroll to Checkout ---
  const scrollToCheckout = () => {
    const checkoutSection = document.getElementById("checkout")
    if (checkoutSection) checkoutSection.scrollIntoView({ behavior: "smooth" })
  }

  // --- Helper: Stock Status ---
  const stockStatusColor =
    {
      "In Stock": "text-green-600",
      "Out of Stock": "text-red-500",
      "Pre-order": "text-yellow-500",
    }[product.stockStatus] || "text-gray-500"

  // --- Helper: Savings ---
  const hasDiscount = product.price.discounted && product.price.discounted < product.price.regular
  const savings = hasDiscount ? product.price.regular - product.price.discounted : 0
  const savingsPercent = hasDiscount ? Math.round((savings / product.price.regular) * 100) : 0

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} theme="light" />

      <Helmet>
        <title>{product?.seo?.metaTitle || product?.basicInfo?.title}</title>
        <meta name="description" content={product?.seo?.metaDescription} />
        <meta name="slug" content={product?.seo?.slug} />
      </Helmet>

      {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderDetails={successOrderDetails}
        />
      )}

      {/* Hero Section with Product */}
      <LandingPageHeroSection
        product={product}
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
        quantity={quantity}
        handleVariantSelect={handleVariantSelect}
        selectedVariants={selectedVariants}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        scrollToCheckout={scrollToCheckout}
      />

      {/* Product Details Sections */}
      <LandingPageProductDetails
        product={product}
        currentPrice={currentPrice}
        currentImage={currentImage}
        selectedVariants={selectedVariants}
        quantity={quantity}
        hasDiscount={hasDiscount}
        savings={savings}
        savingsPercent={savingsPercent}
        scrollToCheckout={scrollToCheckout}
      />

      {/* Checkout Section */}
      <div className="bg-gray-50 py-16" id="checkout">
        <div className="container mx-auto px-4">
          <CheckoutSection
            orderDetails={orderDetails}
            handleSubmit={handleSubmit}
            onQuantityChange={setQuantity}
            onVariantChange={handleVariantSelect}
            isLoading={isOrderLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default LandingPage