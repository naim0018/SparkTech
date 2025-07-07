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
      <div className="bg-gradient-to-br from-slate-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-100">
                  <img
                    src={currentImage?.url || "/placeholder.svg"}
                    alt={currentImage?.alt || product?.basicInfo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {hasDiscount && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        -{savingsPercent}% OFF
                      </span>
                    )}
                    {product.additionalInfo?.isFeatured && (
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        ⭐ FEATURED
                      </span>
                    )}
                    {product.additionalInfo?.freeShipping && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        🚚 FREE SHIPPING
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold bg-white shadow-lg ${stockStatusColor}`}
                    >
                      {product.stockStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product?.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      currentImage?.url === img.url
                        ? "border-green-500 ring-2 ring-green-200 scale-105"
                        : "border-gray-200 hover:border-green-300 hover:scale-105"
                    }`}
                  >
                    <img src={img.url || "/placeholder.svg"} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand & Category */}
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {product.basicInfo.brand}
                </span>
                <span className="text-gray-500">{product.basicInfo.category}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{product.basicInfo.title}</h1>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-4xl lg:text-5xl font-bold text-green-600">
                    ৳{(currentPrice * quantity).toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-gray-400 line-through">
                      ৳{(product.price.regular * quantity).toLocaleString()}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      You Save ৳{(savings * quantity).toLocaleString()} ({savingsPercent}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Key Features */}
              {product.basicInfo.keyFeatures?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">✨ Key Features</h3>
                  <ul className="space-y-2">
                    {product.basicInfo.keyFeatures.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Variants */}
              {product?.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  {product.variants.map((variantGroup) => (
                    <div key={variantGroup.group}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose {variantGroup.group}</h3>
                      <div className="flex flex-wrap gap-3">
                        {variantGroup.items.map((variant) => (
                          <button
                            key={variant.value}
                            onClick={() => handleVariantSelect(variantGroup.group, variant)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                              selectedVariants.get(variantGroup.group)?.value === variant.value
                                ? "border-green-500 bg-green-50 text-green-700 shadow-lg scale-105"
                                : "border-gray-200 hover:border-green-300 hover:shadow-md hover:scale-105"
                            }`}
                          >
                            <span>{variant.value}</span>
                            {variant.price > 0 && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                +৳{variant.price}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={handleDecrement}
                      className="px-4 py-3 text-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="px-6 py-3 text-xl font-bold border-x-2 border-gray-200 bg-gray-50">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="px-4 py-3 text-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {product.stockQuantity && (
                    <span className="text-sm text-gray-500">{product.stockQuantity} items available</span>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={scrollToCheckout}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-8 rounded-2xl text-xl font-bold hover:from-green-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                🛒 অর্ডার করুন এখনই (Order Now)
              </button>

              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl mb-1">🚚</div>
                  <div className="text-xs text-gray-600">Fast Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🔒</div>
                  <div className="text-xs text-gray-600">Secure Payment</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">↩️</div>
                  <div className="text-xs text-gray-600">Easy Returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Sections */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Description & Policies Side by Side */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Information</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Description */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                📋 Product Description
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {product.basicInfo.description.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Return Policy & Shipping */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                🛡️ Policies & Shipping
              </h3>

              {/* Shipping Details */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  📦 Shipping Details
                </h4>
                <div className="space-y-3 text-gray-700 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium">Dimensions:</span>
                    <span className="text-right">
                      {product.shippingDetails.length} x {product.shippingDetails.width} x{" "}
                      {product.shippingDetails.height} {product.shippingDetails.dimensionUnit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium">Weight:</span>
                    <span className="text-right">
                      {product.shippingDetails.weight} {product.shippingDetails.weightUnit}
                    </span>
                  </div>
                  {product.additionalInfo?.estimatedDelivery && (
                    <div className="pt-2">
                      <span className="font-medium">Estimated Delivery:</span>
                      <div className="mt-2 text-sm leading-relaxed">
                        {product.additionalInfo.estimatedDelivery.split("\n").map((line, idx) => (
                          <p key={idx} className="mb-1">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Return Policy */}
              {product.additionalInfo?.returnPolicy && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">↩️ Return Policy</h4>
                  <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                    {product.additionalInfo.returnPolicy.split("\n").map((line, idx) => (
                      <p key={idx} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty */}
              {product.additionalInfo?.warranty && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    🔧 Warranty Information
                  </h4>
                  <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                    {product.additionalInfo.warranty.split("\n").map((line, idx) => (
                      <p key={idx} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Complete Features Section */}
        {product.basicInfo.keyFeatures?.length > 0 && (
          <section className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Features</h2>
              <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {product.basicInfo.keyFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">{idx + 1}</span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium leading-relaxed">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Specifications */}
        {product.specifications?.length > 0 && (
          <section className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
              <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {product.specifications.map((spec, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{spec.group}</h3>
                  <div className="space-y-3">
                    {spec.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="text-gray-600 text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
              <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
            </div>
            <div className="space-y-6">
              {product.reviews.map((review, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-lg">{review.user.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{review.user}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Final CTA Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 opacity-90">
            Don&apos;t miss out on this amazing product. Order now and get it delivered to your doorstep!
          </p>
          <button
            onClick={scrollToCheckout}
            className="bg-white text-green-600 px-8 py-4 rounded-2xl text-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            🛒 Order Now - ৳{(currentPrice * quantity).toLocaleString()}
          </button>
        </section>
      </div>

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
