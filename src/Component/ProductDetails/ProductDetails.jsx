import { useState, useEffect } from 'react';
import {  useParams } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaExclamationTriangle, FaSearch, FaShippingFast, FaShieldAlt, FaUndo, FaStar, FaCheck } from 'react-icons/fa';
import { TbCurrencyTaka } from 'react-icons/tb';
import { useGetProductByIdQuery } from '../../redux/api/ProductApi';
import RelatedProducts from './RelatedProducts';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/CartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/features/wishlistSlice';
import { toast } from 'react-toastify';
import { useTheme } from '../../ThemeContext';
import ProductImages from './ProductImages';
import { Helmet } from 'react-helmet';
import CheckoutForm from '../Checkout/CheckOutForm';
import { motion } from 'framer-motion';

// import { use } from 'react';

const ProductView = () => {
  const { productId } = useParams();
  const { data: productResponse, isLoading, isError } = useGetProductByIdQuery(productId);
  const product = productResponse?.data;
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState(new Map());
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('bkash');
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const isInWishlist = wishlistItems?.some(item => item._id === product?._id);

  // Move the scroll effect after all declarations
  useEffect(() => {
    // Scroll to top immediately when component mounts
    window.scrollTo(0, 0);
    
    // Prevent scroll during loading
    document.body.style.overflow = isLoading ? 'hidden' : 'unset';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoading,productId]);

  // Initialize price and reset variants when product changes
  useEffect(() => {
    if (product) {
      const initialPrice = product.price.discounted || product.price.regular;
      if (typeof initialPrice === 'number' && !isNaN(initialPrice)) {
        setCurrentPrice(initialPrice);
      } else {
        console.error('Invalid initial price:', initialPrice);
        setCurrentPrice(0);
      }
      setSelectedVariants(new Map());
      setCurrentImage(product.images[0]);
    }
  }, [product]);
  
  // Loading state
  if (isLoading) return (
    <div className="z-50 fixed inset-0 flex justify-center items-start bg-white dark:bg-gray-900 pt-20">
      <div className="border-orange-500 border-t-4 border-b-4 rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );

  if (isError) return <ErrorState />;
  if (!product) return <NotFoundState />;

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
     
      const lastSelectedVariant = Array.from(newSelectedVariants.values()).pop();
      if (lastSelectedVariant?.image?.url) {
        setCurrentImage({
          url: lastSelectedVariant.image.url,
          alt: lastSelectedVariant.image.alt || product.images[0].alt
        });
      } else {
        setCurrentImage(product.images[0]);
      }
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
        const highestPrice = Math.max(...variantPrices);
        setCurrentPrice(highestPrice);
      } else {
        setCurrentPrice(product.price.discounted || product.price.regular);
      }
      if (variant.image?.url) {
        setCurrentImage({
          url: variant.image.url,
          alt: variant.image.alt || product.images[0].alt
        });
      }
    }
    setSelectedVariants(newSelectedVariants);
  };

  const handleAddToCart = () => {
    if (typeof currentPrice !== 'number' || isNaN(currentPrice)) {
      toast.error('Invalid price. Please try again.');
      return;
    }
    const selectedVariantsArray = Array.from(selectedVariants, ([group, variant]) => ({
      group,
      value: variant.value,
      price: variant.price,
      image: variant.image
    }));
    
    dispatch(addToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: currentPrice,
      image: currentImage.url,
      quantity,
      selectedVariants: selectedVariantsArray
    }));
    toast.success('Product added to cart!');
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.info('Removed from wishlist!');
    } else {
      dispatch(addToWishlist({
        _id: product._id,
        title: product.basicInfo.title,
        price: currentPrice,
        image: currentImage.url
      }));
      toast.success('Added to wishlist!');
    }
  };

  const handleOrderNow = () => {
    if (typeof currentPrice !== 'number' || isNaN(currentPrice)) {
      toast.error('Invalid price. Please try again.');
      return;
    }

    // Create a single cart item for direct checkout
    const selectedVariantsArray = Array.from(selectedVariants, ([group, variant]) => ({
      group,
      value: variant.value,
      price: variant.price,
      image: variant.image
    }));

    const orderItem = {
      id: product._id,
      name: product.basicInfo.title,
      price: currentPrice,
      image: currentImage.url,
      quantity,
      selectedVariants: selectedVariantsArray,
      itemKey: `${product._id}-${Date.now()}`
    };

    // Dispatch to cart
    dispatch(addToCart(orderItem));
    
    // Show order modal
    setShowOrderModal(true);
  };
  return (
    <>
      <Helmet>
        <title>{product.basicInfo.title} | BestBuy4uBD</title>
        <meta name="description" content={product.basicInfo.description.substring(0, 160)} />
        <meta name="keywords" content={`${product.basicInfo.category}, ${product.basicInfo.brand}, ${product?.tag}`} />
      </Helmet>

      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
        {/* Breadcrumb with gradient */}
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} shadow-sm border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 container">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-orange-500 hover:text-orange-600 transition-colors font-medium">Home</a>
              <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>/</span>
              <a href={`/shop?category=${encodeURIComponent(product.basicInfo.category)}`} className="text-orange-500 hover:text-orange-600 transition-colors font-medium">
                {product.basicInfo.category}
              </a>
              <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>/</span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{product.basicInfo.title}</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 container">
          {/* Main Product Section with glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50' : 'bg-white/70 backdrop-blur-xl border border-white/50'} shadow-2xl rounded-2xl overflow-hidden`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left Column - Product Images */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <ProductImages images={product.images} currentImage={currentImage} />
              </motion.div>

              {/* Right Column - Product Info */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                {/* Basic Info */}
                <div>
                  <h1 className={`font-bold text-3xl sm:text-4xl mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
                    {product.basicInfo.title}
                  </h1>
                  <div className="flex items-center flex-wrap gap-3 mt-4">
                    <span className={`${isDarkMode ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 text-orange-400' : 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-orange-700'} px-4 py-2 rounded-full text-sm font-semibold`}>
                      {product.basicInfo.brand}
                    </span>
                    <span className={`${isDarkMode ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 text-blue-400' : 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700'} px-4 py-2 rounded-full text-sm font-semibold`}>
                      {product.basicInfo.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>(4.8)</span>
                    </div>
                  </div>
                </div>

                {/* Price Section with gradient */}
                <div className={`${isDarkMode ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20' : 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200'} p-6 rounded-2xl`}>
                  <div className="flex items-center flex-wrap gap-4">
                    <div className="flex items-center font-bold text-orange-500 dark:text-orange-400 text-4xl">
                      <TbCurrencyTaka className="text-4xl" />
                      <span>{currentPrice}</span>
                    </div>
                    {product.price.discounted < product.price.regular && (
                      <>
                        <div className={`flex items-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-xl line-through`}>
                          <TbCurrencyTaka />
                          <span>{product.price.regular}</span>
                        </div>
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-full font-bold text-white text-sm shadow-lg">
                          {Math.round(((product.price.regular - product.price.discounted) / product.price.regular) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Variants Section */}
                {product.variants?.map((variantGroup) => (
                  <div key={variantGroup.group} className="space-y-3">
                    <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {variantGroup.group}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {variantGroup.items.map((variant) => (
                        <button
                          key={variant.value}
                          onClick={() => handleVariantSelect(variantGroup.group, variant)}
                          className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                            selectedVariants.get(variantGroup.group)?.value === variant.value
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50'
                              : isDarkMode 
                                ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                          }`}
                        >
                          {variant.value}
                          {variant.price > 0 && (
                            <span className={`ml-2 text-xs ${
                              selectedVariants.get(variantGroup.group)?.value === variant.value
                                ? 'text-orange-100'
                                : isDarkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              +৳{variant.price}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Quantity Section */}
                <div className="flex items-center space-x-4">
                  <span className={`font-semibold text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Quantity:</span>
                  <div className={`flex items-center ${isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-100 border border-gray-300'} rounded-xl overflow-hidden`}>
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className={`${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} px-5 py-3 text-orange-500 font-bold text-xl transition-colors`}
                    >
                      -
                    </button>
                    <span className={`px-8 py-3 font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className={`${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} px-5 py-3 text-orange-500 font-bold text-xl transition-colors`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons with gradients */}
                <div className="gap-4 grid grid-cols-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex justify-center items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-4 rounded-xl text-white font-semibold shadow-lg shadow-orange-500/30 transition-all duration-300"
                  >
                    <FaShoppingCart className="text-lg" />
                    <span>Add to Cart</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOrderNow}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-4 rounded-xl text-white font-semibold shadow-lg shadow-green-500/30 transition-all duration-300"
                  >
                    Buy Now
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleWishlist}
                  className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    isInWishlist
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
                      : isDarkMode
                        ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <FaHeart className="text-lg" />
                  <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                </motion.button>

                {/* Features with icons */}
                <div className={`gap-4 grid grid-cols-3 pt-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                  <div className="flex flex-col items-center space-y-2 text-center group">
                    <div className={`${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <FaShippingFast className="text-orange-500 text-2xl" />
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 text-center group">
                    <div className={`${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <FaShieldAlt className="text-orange-500 text-2xl" />
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 text-center group">
                    <div className={`${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <FaUndo className="text-orange-500 text-2xl" />
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Easy Returns</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Product Details Sections */}
          <div className="gap-8 grid grid-cols-1 lg:grid-cols-2 mt-8">
            {/* Description Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50' : 'bg-white/70 backdrop-blur-xl border border-white/50'} shadow-xl p-8 rounded-2xl`}
            >
              <h2 className={`mb-6 font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <span className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></span>
                Product Description
              </h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-wrap leading-relaxed`}>
                {product.basicInfo.description}
              </p>
            </motion.div>

            {/* Key Features Section */}
            {product.basicInfo.keyFeatures && product.basicInfo.keyFeatures.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50' : 'bg-white/70 backdrop-blur-xl border border-white/50'} shadow-xl p-8 rounded-2xl`}
              >
                <h2 className={`mb-6 font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <span className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></span>
                  Key Features
                </h2>
                <ul className="space-y-4">
                  {product.basicInfo.keyFeatures.map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      className={`flex items-start space-x-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      <FaCheck className="mt-1 text-orange-500 flex-shrink-0"
                      />
                      <span className="leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Specifications Section */}
          {product.specifications?.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8"
            >
              <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50' : 'bg-white/70 backdrop-blur-xl border border-white/50'} shadow-xl p-8 rounded-2xl`}>
                <h2 className={`mb-6 font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <span className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></span>
                  Specifications
                </h2>
                <div className="space-y-8">
                  {product.specifications.map((specGroup, index) => (
                    <div key={index}>
                      <h3 className="mb-4 font-semibold text-orange-500 dark:text-orange-400 text-xl">
                        {specGroup.group}
                      </h3>
                      <div className="space-y-3">
                        {specGroup.items.map((spec, sIndex) => (
                          <div 
                            key={sIndex} 
                            className={`flex justify-between py-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b last:border-0 hover:bg-orange-500/5 px-4 rounded-lg transition-colors duration-200`}
                          >
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                              {spec.name}
                            </span>
                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Related Products */}
          {product && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8"
            >
              <RelatedProducts 
                relatedProducts={product?.relatedProducts} 
                currentProduct={product}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="z-50 fixed inset-0 overflow-y-auto">
          <div className="sm:block flex justify-center items-center sm:p-0 px-4 pt-4 pb-20 min-h-screen text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>  
            </div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block bg-white dark:bg-gray-800 shadow-xl sm:my-8 rounded-lg sm:w-full sm:max-w-lg overflow-hidden text-left sm:align-middle align-bottom transition-all transform">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Complete Your Order</h3>
                  <button 
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    ×
                  </button>
                </div>
                
                <div className="mb-6 p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={currentImage?.url} 
                      alt={product.basicInfo.title} 
                      className="rounded w-20 h-20 object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{product.basicInfo.title}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Quantity: {quantity}
                      </p>
                      <p className="font-medium text-sm">
                        Total: ৳{(currentPrice * quantity).toFixed(2)}
                      </p>
                      {selectedVariants.size > 0 && (
                        <div className="mt-2">
                          {Array.from(selectedVariants.entries()).map(([group, variant]) => (
                            <span 
                              key={group}
                              className="inline-block bg-gray-100 dark:bg-gray-600 mr-2 mb-1 px-2 py-1 rounded text-xs"
                            >
                              {group}: {variant.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <CheckoutForm 
                  resetCheckout={() => {
                    setShowOrderModal(false);
                  }}
                  selectedPayment={selectedPayment}
                  setSelectedPayment={setSelectedPayment}
                  totalPrice={currentPrice * quantity}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ErrorState = () => (
  <div className="z-50 fixed inset-0 flex flex-col justify-center items-center bg-white dark:bg-gray-900">
    <FaExclamationTriangle className="text-red-500 text-4xl sm:text-5xl lg:text-6xl" />
    <p className="mt-4 font-medium text-gray-700 dark:text-gray-300 text-base sm:text-lg lg:text-xl">
      Error loading product details
    </p>
  </div>
);

const NotFoundState = () => (
  <div className="z-50 fixed inset-0 flex flex-col justify-center items-center bg-white dark:bg-gray-900">
    <FaSearch className="text-gray-400 text-4xl sm:text-5xl lg:text-6xl" />
    <p className="mt-4 font-medium text-gray-700 dark:text-gray-300 text-base sm:text-lg lg:text-xl">
      Product not found
    </p>
  </div>
);

export default ProductView;
