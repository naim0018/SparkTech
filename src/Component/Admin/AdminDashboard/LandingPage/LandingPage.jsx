/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../../redux/api/ProductApi";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import CheckoutSection from "./CheckoutSection";
import { useDispatch } from "react-redux";
import { addToCart, clearCart } from "../../../../redux/features/CartSlice";
import { useCreateOrderMutation } from "../../../../redux/api/OrderApi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderSuccessModal from './OrderSuccessModal';

const LandingPage = () => {
  const { productId } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(productId);
  const product = data?.data;
  const dispatch = useDispatch();

  const [selectedVariants, setSelectedVariants] = useState(new Map());
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState(null);

  useEffect(() => {
    if (product) {
      const initialPrice = product.price.discounted || product.price.regular;
      setCurrentPrice(typeof initialPrice === 'number' && !isNaN(initialPrice) ? initialPrice : 0);
      setSelectedVariants(new Map());
      setCurrentImage(product.images[0]);
    }
    return () => {
      if (product) dispatch(clearCart());
    };
  }, [product, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-red-100 p-6 rounded-lg">
          <p className="text-red-600 text-lg">Error loading product: {error.message}</p>
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-yellow-100 p-6 rounded-lg">
          <p className="text-yellow-700 text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  // --- Variant Selection Logic ---
  const handleVariantSelect = (groupName, variant) => {
    const newSelectedVariants = new Map(selectedVariants);
    if (selectedVariants.get(groupName)?.value === variant.value) {
      newSelectedVariants.delete(groupName);
    } else {
      newSelectedVariants.set(groupName, {
        value: variant.value,
        price: variant.price,
        image: variant.image
      });
    }
    // Price calculation: base + sum of variant prices
    let price = product.price.discounted || product.price.regular;
    newSelectedVariants.forEach((v) => {
      if (typeof v.price === "number" && !isNaN(v.price)) price += v.price;
    });
    setCurrentPrice(price);
    // Image update: last selected variant with image, else main image
    const lastWithImage = Array.from(newSelectedVariants.values()).reverse().find(v => v.image?.url);
    setCurrentImage(lastWithImage?.image || product.images[0]);
    setSelectedVariants(newSelectedVariants);
  };

  // --- Quantity Logic ---
  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  // --- Order Logic ---
  const orderDetails = {
    title: product?.basicInfo?.title,
    price: currentPrice,
    variants: selectedVariants,
    quantity,
    image: currentImage,
    product
  };

  const handleSubmit = async (formData) => {
    try {
      const orderData = {
        body: {
          items: [{
            product: productId,
            image: currentImage?.url,
            quantity,
            itemKey: `${productId}-${Date.now()}`,
            price: currentPrice,
            selectedVariants: Object.fromEntries(
              Array.from(selectedVariants.entries()).map(([group, variant]) => [
                group,
                { value: variant.value, price: variant.price || 0 }
              ])
            )
          }],
          totalAmount: calculateTotalAmount(formData.courierCharge),
          status: "pending",
          billingInformation: {
            name: formData.name,
            email: formData.email || "no-email@example.com",
            phone: formData.phone,
            address: formData.address,
            country: "Bangladesh",
            paymentMethod: formData.paymentMethod,
            notes: formData.notes || ""
          },
          courierCharge: formData.courierCharge,
          cuponCode: formData.cuponCode || ""
        }
      };
      function calculateTotalAmount(courierChargeType) {
        const productTotal = currentPrice * quantity;
        const deliveryCharge = courierChargeType === 'insideDhaka' ? 80 : 150;
        return productTotal + deliveryCharge;
      }
      const response = await createOrder(orderData).unwrap();
      setSuccessOrderDetails({
        orderId: response.data._id,
        productPrice: currentPrice * quantity,
        deliveryCharge: formData.courierCharge === 'insideDhaka' ? 80 : 150,
        totalAmount: orderData.body.totalAmount
      });
      setShowSuccessModal(true);
      setQuantity(1);
      setSelectedVariants(new Map());
      setCurrentPrice(product.price.discounted || product.price.regular);
      setCurrentImage(product.images[0]);
    } catch (error) {
      toast.error(
        <div>
          <h3 className="font-bold text-red-800">দুঃখিত! অর্ডার সম্পন্ন করা যায়নি।</h3>
          {error.data?.message && (
            <p className="text-sm text-red-600 mt-1">কারণ: {error.data.message}</p>
          )}
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
        }
      );
    }
  };

  // --- Scroll to Checkout ---
  const scrollToCheckout = () => {
    const checkoutSection = document.getElementById('checkout');
    if (checkoutSection) checkoutSection.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Helper: Stock Status ---
  const stockStatusColor = {
    "In Stock": "text-green-600",
    "Out of Stock": "text-red-500",
    "Pre-order": "text-yellow-500"
  }[product.stockStatus] || "text-gray-500";

  // --- Helper: Savings ---
  const hasDiscount = product.price.discounted && product.price.discounted < product.price.regular;
  const savings = hasDiscount ? product.price.regular - product.price.discounted : 0;
  const savingsPercent = hasDiscount ? Math.round((savings / product.price.regular) * 100) : 0;

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} theme="light" />
      <Helmet>
        <title>{product?.seo?.metaTitle || product?.basicInfo?.title}</title>
        <meta name="description" content={product?.seo?.metaDescription}/>
        <meta name="slug" content={product?.seo?.slug} />
      </Helmet>
      {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderDetails={successOrderDetails}
        />
      )}

      <div className="container mx-auto px-2 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Sticky Sidebar: Images & Quick Info --- */}
          <aside className="lg:w-1/3 w-full sticky top-8 self-start bg-white rounded-3xl shadow-xl border border-green-100 p-6">
            {/* Enhanced Product Image Gallery */}
            <div className="mb-4">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={currentImage?.url}
                  alt={currentImage?.alt || product?.basicInfo.title}
                  className="object-cover aspect-square w-full transition-transform duration-500 group-hover:scale-110"
                  style={{ maxHeight: 400, minHeight: 300, background: "#f3f4f6" }}
                />
                {/* Zoom icon overlay */}
                <span className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 shadow group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" fill="none" stroke="currentColor" className="text-green-600">
                    <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/>
                  </svg>
                </span>
              </div>
              {/* Thumbnails with highlight and scroll */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {product?.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(img)}
                    className={`rounded-xl overflow-hidden border-2 transition-all duration-200 w-20 h-20 flex-shrink-0
                      ${currentImage?.url === img.url ? 'border-green-500 ring-2 ring-green-300 scale-105' : 'border-gray-200 hover:border-green-300 hover:scale-105'}`}
                    style={{ background: "#f3f4f6" }}
                  >
                    <img src={img.url} alt={img.alt} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
              {/* Image count indicator */}
              <div className="text-xs text-gray-500 mt-2 text-center">
                {product.images.length > 1 && (
                  <>Showing {product.images.findIndex(img => img.url === currentImage?.url) + 1} of {product.images.length} images</>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className={`font-semibold ${stockStatusColor}`}>
                {product.stockStatus}
                {product.stockQuantity && product.stockStatus === "In Stock" && (
                  <span className="ml-2 text-xs text-gray-400">({product.stockQuantity} available)</span>
                )}
              </span>
              <span className="text-sm text-gray-500">Product Code: {product.basicInfo.productCode}</span>
              <span className="text-sm text-gray-500">Brand: {product.basicInfo.brand}</span>
              <span className="text-sm text-gray-500">Category: {product.basicInfo.category}</span>
              {product.basicInfo.subcategory && (
                <span className="text-sm text-gray-500">Subcategory: {product.basicInfo.subcategory}</span>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags?.map(tag => (
                  <span key={tag} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </aside>

          {/* --- Main Content --- */}
          <main className="flex-1 bg-white rounded-3xl shadow-xl border border-green-100 p-8">
            {/* Title & Brand */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{product.basicInfo.title}</h1>
              <span className="text-green-700 font-semibold text-lg">{product.basicInfo.brand}</span>
            </div>
            {/* Price Block */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-6">
              <div>
                <span className="text-xl text-gray-700">Price:</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-green-600">
                    ৳{(currentPrice * quantity).toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="ml-2 text-xl line-through text-red-400">
                        ৳{(product.price.regular * quantity).toLocaleString()}
                      </span>
                      <span className="ml-2 text-green-700 font-semibold text-lg">
                        Save ৳{savings * quantity} ({savingsPercent}%)
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2 md:mt-0">
                {product.additionalInfo?.freeShipping && (
                  <span className="text-green-600 font-medium">🚚 Free Shipping</span>
                )}
                {product.additionalInfo?.isFeatured && (
                  <span className="text-yellow-600 font-medium">⭐ Featured</span>
                )}
                {product.additionalInfo?.isOnSale && (
                  <span className="text-red-500 font-medium">🔥 On Sale</span>
                )}
              </div>
            </div>
            {/* Variants */}
            {product?.variants && product.variants.length > 0 && (
              <div className="space-y-6 mb-8">
                {product.variants.map((variantGroup) => (
                  <div key={variantGroup.group}>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{variantGroup.group}</h3>
                    <div className="flex flex-wrap gap-3">
                      {variantGroup.items.map((variant) => (
                        <button
                          key={variant.value}
                          onClick={() => handleVariantSelect(variantGroup.group, variant)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200
                            ${selectedVariants.get(variantGroup.group)?.value === variant.value
                              ? 'border-green-500 bg-green-50 text-green-700 shadow-md scale-105'
                              : 'border-gray-200 hover:border-green-300 hover:shadow-lg'}`}
                        >
                          <span>{variant.value}</span>
                          {variant.price > 0 && (
                            <span className="text-xs font-medium text-green-700">
                              +৳{variant.price.toLocaleString()}
                            </span>
                          )}
                          {variant.image?.url && (
                            <img src={variant.image.url} alt={variant.image.alt} className="w-6 h-6 rounded" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="inline-flex items-center border-2 border-gray-200 rounded-xl shadow-sm">
                <button 
                  onClick={handleDecrement}
                  className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-50 rounded-l-xl transition-colors"
                  disabled={quantity <= 1}
                >−</button>
                <span className="px-6 py-2 text-xl font-medium border-x-2 border-gray-200">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-50 rounded-r-xl transition-colors"
                >+</button>
              </div>
            </div>
            {/* CTA */}
            <button
              onClick={scrollToCheckout}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-8 rounded-xl text-lg font-bold hover:from-green-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg mb-8"
            >
              অর্ডার করুন (Order Now)
            </button>
            {/* Key Features */}
            {product.basicInfo.keyFeatures?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Features</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  {product.basicInfo.keyFeatures.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Specifications */}
            {product.specifications?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-1">{spec.group}</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        {spec.items.map((item, i) => (
                          <li key={i}><span className="font-semibold">{item.name}:</span> {item.value}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {product.basicInfo.description}
              </div>
            </div>
            {/* Shipping & Additional Info */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Shipping Details</h4>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>
                    <span className="font-semibold">Dimensions:</span>
                    <span className="ml-1">
                      {product.shippingDetails.length} x {product.shippingDetails.width} x {product.shippingDetails.height} {product.shippingDetails.dimensionUnit}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">Weight:</span>
                    <span className="ml-1">
                      {product.shippingDetails.weight} {product.shippingDetails.weightUnit}
                    </span>
                  </li>
                  {product.additionalInfo?.estimatedDelivery && (
                    <li>
                      <span className="font-semibold">Estimated Delivery:</span>
                      <span className="ml-1 whitespace-pre-line">{product.additionalInfo.estimatedDelivery}</span>
                    </li>
                  )}
                  {product.additionalInfo?.returnPolicy && (
                    <li>
                      <span className="font-semibold">Return Policy:</span>
                      <span className="ml-1 whitespace-pre-line">{product.additionalInfo.returnPolicy}</span>
                    </li>
                  )}
                  {product.additionalInfo?.warranty && (
                    <li>
                      <span className="font-semibold">Warranty:</span>
                      <span className="ml-1 whitespace-pre-line">{product.additionalInfo.warranty}</span>
                    </li>
                  )}
                </ul>
              </div>
            
            </div>
            {/* Reviews */}
            {product.reviews?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Reviews</h3>
                <div className="space-y-4">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-green-700">{review.user}</span>
                        <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                        <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
        {/* Checkout Section */}
        <div className="mt-8" id="checkout">
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
  );
};

export default LandingPage;
