import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaExclamationTriangle, FaSearch, FaShippingFast, FaShieldAlt, FaUndo } from 'react-icons/fa';
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
import { use } from 'react';

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
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex justify-center items-start pt-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
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

      <div className={`min-h-screen  ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className=" container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-orange-600 dark:text-orange-400 hover:underline">Home</a>
              <span className="text-gray-400">/</span>
              <a href={`/shop?category=${encodeURIComponent(product.basicInfo.category)}`} className="text-orange-600 dark:text-orange-400 hover:underline">
                {product.basicInfo.category}
              </a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">{product.basicInfo.title}</span>
            </nav>
          </div>
        </div>

        <div className=" container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Product Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden min-h-[600px]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column - Product Images */}
              <div className="p-6 lg:border-r dark:border-gray-700">
                <ProductImages images={product.images} currentImage={currentImage} />
              </div>

              {/* Right Column - Product Info */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{product.basicInfo.title}</h1>
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      Brand: {product.basicInfo.brand}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      Category: {product.basicInfo.category}
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-3xl font-bold text-orange-600 dark:text-orange-400">
                      <TbCurrencyTaka className="text-3xl" />
                      <span>{currentPrice}</span>
                    </div>
                    {product.price.discounted < product.price.regular && (
                      <>
                        <div className="flex items-center text-xl text-gray-400 line-through">
                          <TbCurrencyTaka />
                          <span>{product.price.regular}</span>
                        </div>
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                          {Math.round(((product.price.regular - product.price.discounted) / product.price.regular) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Variants Section */}
                {product.variants?.map((variantGroup) => (
                  <div key={variantGroup.group} className="space-y-3">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">{variantGroup.group}</h3>
                    <div className="flex flex-wrap gap-2">
                      {variantGroup.items.map((variant) => (
                        <button
                          key={variant.value}
                          onClick={() => handleVariantSelect(variantGroup.group, variant)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            selectedVariants.get(variantGroup.group)?.value === variant.value
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {variant.value}
                          {variant.price > 0 && (
                            <span className={`ml-1 text-sm ${
                              selectedVariants.get(variantGroup.group)?.value === variant.value
                                ? 'text-orange-200'
                                : 'text-gray-500 dark:text-gray-400'
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
                  <span className="font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-4 py-2 text-orange-600 dark:text-orange-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-4 py-2 text-orange-600 dark:text-orange-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <FaShoppingCart />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleOrderNow}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Buy Now
                  </button>
                </div>

                <button
                  onClick={handleWishlist}
                  className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors ${
                    isInWishlist
                      ? 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FaHeart />
                  <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                </button>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t dark:border-gray-700">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <FaShippingFast className="text-2xl text-orange-500" />
                    <span className="text-sm">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <FaShieldAlt className="text-2xl text-orange-500" />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <FaUndo className="text-2xl text-orange-500" />
                    <span className="text-sm">Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Sections */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Description Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Product Description</h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {product.basicInfo.description}
              </p>
            </div>

            {/* Key Features Section */}
            
            {product.basicInfo.keyFeatures && product.basicInfo.keyFeatures.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Key Features</h2>
                <ul className="space-y-3">
                  {product.basicInfo.keyFeatures.map((feature, index) => (
                    <li 
                      key={index} 
                      className="flex items-start space-x-2 text-gray-600 dark:text-gray-300"
                    >
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Specifications Section */}
          {product.specifications?.length > 0 && (
            <div className="mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Specifications</h2>
                <div className="space-y-6">
                  {product.specifications.map((specGroup, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        {specGroup.group}
                      </h3>
                      <div className="space-y-2">
                        {specGroup.items.map((spec, sIndex) => (
                          <div 
                            key={sIndex} 
                            className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                          >
                            <span className="text-gray-600 dark:text-gray-400">
                              {spec.name}
                            </span>
                            <span className="font-medium">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Products */}
          {product && (
            <div className="mt-8">
              <RelatedProducts 
                relatedProducts={product?.relatedProducts} 
                currentProduct={product}
              />
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Complete Your Order</h3>
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
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium">{product.basicInfo.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {quantity}
                      </p>
                      <p className="text-sm font-medium">
                        Total: ৳{(currentPrice * quantity).toFixed(2)}
                      </p>
                      {selectedVariants.size > 0 && (
                        <div className="mt-2">
                          {Array.from(selectedVariants.entries()).map(([group, variant]) => (
                            <span 
                              key={group}
                              className="inline-block text-xs bg-gray-100 dark:bg-gray-600 rounded px-2 py-1 mr-2 mb-1"
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
  <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
    <FaExclamationTriangle className="text-4xl sm:text-5xl lg:text-6xl text-red-500" />
    <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-700 dark:text-gray-300 mt-4">
      Error loading product details
    </p>
  </div>
);

const NotFoundState = () => (
  <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
    <FaSearch className="text-4xl sm:text-5xl lg:text-6xl text-gray-400" />
    <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-700 dark:text-gray-300 mt-4">
      Product not found
    </p>
  </div>
);

export default ProductView;
