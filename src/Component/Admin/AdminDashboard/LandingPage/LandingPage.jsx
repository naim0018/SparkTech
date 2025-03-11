/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../../redux/api/ProductApi";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import CheckoutSection from "./CheckoutSection";
import { useDispatch } from "react-redux";
import { addToCart, clearCart } from "../../../../redux/features/CartSlice";
import { useCreateOrderMutation } from "../../../../redux/api/OrderApi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import OrderSuccessModal from './OrderSuccessModal';

const LandingPage = () => {
  const { productId } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(productId);
  const product = data?.data;
  const dispatch = useDispatch();

  const [currentSlider, setCurrentSlider] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState(new Map());
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentImage, setCurrentImage] = useState(product?.images[0]?.url);
  const [quantity, setQuantity] = useState(1);

  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState(null);

  useEffect(() => {
    if (product) {
      const initialPrice = product.price.discounted || product.price.regular;
      if (typeof initialPrice === 'number' && !isNaN(initialPrice)) {
        setCurrentPrice(initialPrice);
      } else {
        setCurrentPrice(0);
      }
      setSelectedVariants(new Map());
      setCurrentImage(product.images[0]);
    }
    return () => {
      if (product) {
        dispatch(clearCart());
      }
    };
  }, [product, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 p-6 rounded-lg">
          <p className="text-red-600 text-lg">Error loading product: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-yellow-100 p-6 rounded-lg">
          <p className="text-yellow-700 text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleVariantSelect = (groupName, variant) => {
    const newSelectedVariants = new Map(selectedVariants);
    
    if (selectedVariants.get(groupName)?.value === variant.value) {
      newSelectedVariants.delete(groupName);
      let newPrice = product.price.discounted || product.price.regular;
      newSelectedVariants.forEach((selectedVariant) => {
        if (selectedVariant.price && selectedVariant.price > 0) {
          newPrice = selectedVariant.price;
        }
      });
      setCurrentPrice(newPrice);
      const remainingVariants = Array.from(newSelectedVariants.values());
      const lastVariantWithImage = remainingVariants.reverse().find(v => v.image?.url);
      setCurrentImage(lastVariantWithImage?.image || product.images[0]);
    } else {
      newSelectedVariants.set(groupName, {
        value: variant.value,
        price: variant.price,
        image: variant.image
      });
      const variantPrices = Array.from(newSelectedVariants.values())
        .map(v => v.price)
        .filter(price => typeof price === 'number' && !isNaN(price) && price > 0);
      if (variantPrices.length > 0) {
        setCurrentPrice(Math.max(...variantPrices));
      } else {
        setCurrentPrice(product.price.discounted || product.price.regular);
      }
      if (variant.image?.url) {
        setCurrentImage(variant.image);
      }
    }
    setSelectedVariants(newSelectedVariants);
  };

  const orderDetails = {
    title: product?.basicInfo?.title,
    price: currentPrice,
    variants: selectedVariants,
    quantity: quantity,
    image: currentImage,
    product: product
  };

  const handleSubmit = async (formData) => {
    try {
      const orderData = {
        body: {
          items: [{
            product: productId,
            image: currentImage?.url,
            quantity: quantity,
            itemKey: `${productId}-${Date.now()}`,
            price: currentPrice,
            selectedVariants: Object.fromEntries(
              Array.from(selectedVariants.entries()).map(([group, variant]) => [
                group,
                {
                  value: variant.value,
                  price: variant.price || 0
                }
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
          paymentInfo: {
            paymentMethod: "cash on delivery",
            status: "pending",
            amount: calculateTotalAmount(formData.courierCharge),
            transactionId: "",
            paymentDate: new Date().toISOString(),
            bkashNumber: ""
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
      
      // Set success order details and show modal
      setSuccessOrderDetails({
        orderId: response.data._id,
        productPrice: currentPrice * quantity,
        deliveryCharge: formData.courierCharge === 'insideDhaka' ? 80 : 150,
        totalAmount: orderData.body.totalAmount
      });
      setShowSuccessModal(true);
      
      // Reset form and state
      setQuantity(1);
      setSelectedVariants(new Map());
      setCurrentPrice(product.price.discounted || product.price.regular);
      setCurrentImage(product.images[0]);

    } catch (error) {
      // Error Toast
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
      console.error("Order creation failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Helmet>
        <title>{product?.seo.metaTitle}</title>
        <meta name="description" content={product?.seo.metaDescription}/>
        <meta name="slug" content={product?.seo.metaSlug} />
      </Helmet>

      {/* Success Modal */}
      {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderDetails={successOrderDetails}
        />
      )}

      <div className="container   mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* ছবি গ্যালারি */}
            <div className="relative p-8 bg-gradient-to-br from-green-50 to-white border">
              <div className=" rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={currentImage?.url}
                  alt={currentImage?.alt || product?.basicInfo.title}
                  className="object-cover aspect-square mx-auto transform transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              <div className="mt-6 grid grid-cols-4 gap-4">
                {product?.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(img)}
                    className={`relative rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
                      currentImage?.url === img.url 
                        ? 'ring-2 ring-green-500 transform scale-105' 
                        : 'hover:opacity-75 hover:scale-95'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* পণ্যের তথ্য */}
            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  {product?.basicInfo.title}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {product?.basicInfo.description}
                </p>
              </div>

              {/* মূল্য */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 mb-8 shadow-inner">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl text-gray-700">মূল্য:</span>
                  <div className="text-right">
                    <span className="text-4xl font-bold text-green-600">
                      ৳{(currentPrice * quantity).toLocaleString()}
                    </span>
                    {product?.price.regular > currentPrice && (
                      <span className="ml-2 text-xl line-through text-red-400">
                        ৳{(product?.price.regular * quantity).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ভেরিয়েন্ট */}
              {product?.variants && product.variants.length > 0 && (
                <div className="space-y-6 mb-8">
                  {product.variants.map((variantGroup) => (
                    <div key={variantGroup.group}>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {variantGroup.group}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {variantGroup.items.map((variant) => (
                          <button
                            key={variant.value}
                            onClick={() => handleVariantSelect(variantGroup.group, variant)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                              selectedVariants.get(variantGroup.group)?.value === variant.value
                                ? 'border-green-500 bg-green-50 text-green-700 shadow-md transform scale-105'
                                : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
                            }`}
                          >
                            <span>{variant.value}</span>
                            {variant.price > 0 && (
                              <span className="text-sm font-medium">
                                +৳{variant.price.toLocaleString()}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* পরিমাণ */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">পরিমাণ</h3>
                <div className="inline-flex items-center border-2 border-gray-200 rounded-xl shadow-sm">
                  <button 
                    onClick={handleDecrement}
                    className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-50 rounded-l-xl transition-colors"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-6 py-2 text-xl font-medium border-x-2 border-gray-200">
                    {quantity}
                  </span>
                  <button 
                    onClick={handleIncrement}
                    className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-50 rounded-r-xl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* অর্ডার বাটন */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-8 rounded-xl text-lg font-medium hover:from-green-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                অর্ডার করুন
              </button>
            </div>
          </div>
        </div>

        {/* চেকআউট সেকশন */}
        <div className="mt-8">
          <CheckoutSection
            orderDetails={orderDetails}
            handleSubmit={handleSubmit}
            onQuantityChange={handleQuantityChange}
            onVariantChange={handleVariantSelect}
            isLoading={isOrderLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
