/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaStar, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import { useGetProductByIdQuery } from '../../redux/api/ProductApi';
import RelatedProducts from './RelatedProducts';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/CartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/features/wishlistSlice';
import { toast } from 'react-toastify';
import { useTheme } from '../../ThemeContext';
import { motion } from 'framer-motion';
import ProductImages from './ProductImages';

const ProductView = () => {
  const { productId } = useParams();
  const { data: productResponse, isLoading, isError } = useGetProductByIdQuery(productId);
  const product = productResponse?.data;
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState(new Map());
  const [currentPrice, setCurrentPrice] = useState(
    product?.price?.discounted || product?.price?.regular
  );
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const isInWishlist = wishlistItems.some(item => item._id === product?._id);

  useEffect(() => {
    if (product) {
      setCurrentPrice(product.price.discounted || product.price.regular);
      setSelectedVariants(new Map());
    }
  }, [product]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!product) return <NotFoundState />;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    const variantSelections = {};
    selectedVariants.forEach((value, group) => {
      variantSelections[group] = value;
    });

    dispatch(addToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: currentPrice,
      image: product.images[0].url,
      quantity: quantity,
      variants: variantSelections
    }));

    toast.success('Product added to cart!', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.info('Removed from wishlist!', {
        position: "bottom-right",
        autoClose: 2000
      });
    } else {
      dispatch(addToWishlist({
        _id: product._id,
        title: product.basicInfo.title,
        price: currentPrice,
        image: product.images[0].url
      }));
      toast.success('Added to wishlist!', {
        position: "bottom-right",
        autoClose: 2000
      });
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            <div className="aspect-w-1 aspect-h-1">
              <ProductImages images={product.images} />
            </div>
            
            <div className="space-y-8">
              <ProductInfo 
                product={product} 
                quantity={quantity}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
                handleAddToCart={handleAddToCart}
                handleWishlist={handleWishlist}
                isInWishlist={isInWishlist}
                selectedVariants={selectedVariants}
                setSelectedVariants={setSelectedVariants}
                currentPrice={currentPrice}
                setCurrentPrice={setCurrentPrice}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl mt-8 p-6 md:p-8`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {product.specifications && product.specifications.length > 0 && <Specifications product={product} />}
              <AdditionalInfo product={product} />
            </div>
            <div>
              {product.relatedProducts && product.relatedProducts.length > 0 && (
                <RelatedProducts relatedProducts={product.relatedProducts} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

const ErrorState = () => (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <FaExclamationTriangle className="text-6xl text-red-500" />
    <p className="text-xl font-medium text-gray-700">Error loading product details</p>
  </div>
);

const NotFoundState = () => (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <FaSearch className="text-6xl text-gray-400" />
    <p className="text-xl font-medium text-gray-700">Product not found</p>
  </div>
);

const ProductInfo = ({ product, quantity, incrementQuantity, decrementQuantity, handleAddToCart, handleWishlist, isInWishlist, selectedVariants, setSelectedVariants, currentPrice, setCurrentPrice }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
    <div>
      <h1 className="text-4xl font-bold tracking-tight">{product.basicInfo.title}</h1>
      {product.rating && product.rating.count > 0 && <Rating rating={product.rating} />}
    </div>
    
    <ProductDetails product={product} />
    <PriceInfo product={product} currentPrice={currentPrice} />
    <KeyFeatures product={product} />
    
    <ProductVariants 
      product={product} 
      selectedVariants={selectedVariants}
      setSelectedVariants={setSelectedVariants}
      setCurrentPrice={setCurrentPrice}
    />
    
    <div className="space-y-4">
      <QuantitySelector 
        quantity={quantity}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />
      <ActionButtons handleAddToCart={handleAddToCart} handleWishlist={handleWishlist} isInWishlist={isInWishlist} />
    </div>
    
    <AdditionalNotes product={product} />
  </motion.div>
);

const Rating = ({ rating }) => (
  <div className="flex items-center mt-2 space-x-2">
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className={`w-5 h-5 ${i < Math.round(rating.average) ? 'text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
    <span className="text-sm text-gray-500">({rating.count} reviews)</span>
  </div>
);

const ProductDetails = ({ product }) => (
  <div className="grid grid-cols-2 gap-4 text-sm">
    <div className="space-y-2">
      <p><span className="font-medium">Brand:</span> {product.basicInfo.brand}</p>
      <p><span className="font-medium">Product Code:</span> {product.basicInfo.productCode}</p>
      <p><span className="font-medium">Category:</span> {product.basicInfo.category}</p>
    </div>
    <div className="space-y-2">
      <p><span className="font-medium">Availability:</span> {product.stockStatus}</p>
      <p><span className="font-medium">Subcategory:</span> {product.basicInfo.subcategory}</p>
      {product.stockQuantity && (
        <p><span className="font-medium">In Stock:</span> {product.stockQuantity} units</p>
      )}
    </div>
    {product.additionalInfo && product.additionalInfo.isOnSale && (
      <div className="col-span-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          On Sale
        </span>
      </div>
    )}
  </div>
);

const PriceInfo = ({ product, currentPrice }) => (
  <div>
    <p className="text-5xl font-bold text-blue-600">
      Tk {currentPrice.toLocaleString()}
    </p>
    {product.price.discounted && currentPrice === product.price.discounted && (
      <div className="mt-2 space-y-1">
        <p className="text-sm text-gray-500">
          Regular Price: <span className="line-through">Tk {product.price.regular.toLocaleString()}</span>
        </p>
        <p className="text-sm text-green-600">
          Save: Tk {product.price.savings.toLocaleString()} ({product.price.savingsPercentage?.toFixed(2)}%)
        </p>
      </div>
    )}
  </div>
);

const KeyFeatures = ({ product }) => (
  <div>
    <h2 className="text-xl font-semibold mb-3">Key Features</h2>
    <ul className="list-disc list-inside space-y-2 text-sm">
      {product.basicInfo.keyFeatures.map((feature, index) => (
        <li key={index} className="text-gray-700">{feature}</li>
      ))}
    </ul>
  </div>
);

const ProductVariants = ({ product, selectedVariants, setSelectedVariants, setCurrentPrice }) => (
  product.variants && product.variants.length > 0 && (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Available Options</h3>
      {product.variants.map((variantGroup, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{variantGroup.group}:</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {variantGroup.items.map((item, itemIndex) => {
              const isSelected = selectedVariants.get(variantGroup.group) === item.value;
              
              return (
                <motion.button
                  key={itemIndex}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const newVariants = new Map(selectedVariants);
                    if (isSelected) {
                      newVariants.delete(variantGroup.group);
                      setCurrentPrice(product.price.regular);
                    } else {
                      newVariants.set(variantGroup.group, item.value);
                      setCurrentPrice(item.price);
                    }
                    setSelectedVariants(newVariants);
                  }}
                  className={`
                    relative p-2 rounded-lg text-xs transition-all duration-200
                    ${isSelected 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md ring-2 ring-blue-500 ring-offset-1' 
                      : 'bg-white text-gray-800 border border-gray-200 hover:border-blue-400 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="font-medium">{item.value}</span>
                    {item.price !== product.price.regular && (
                      <span className={`
                        text-[10px] font-medium px-1.5 py-0.5 rounded-full
                        ${isSelected 
                          ? 'bg-blue-400 text-white' 
                          : 'bg-gray-100 text-gray-700'
                        }
                      `}>
                        {item.price > product.price.regular ? `+${item.price - product.price.regular}` : item.price - product.price.regular} Tk
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  )
);

const QuantitySelector = ({ quantity, incrementQuantity, decrementQuantity }) => (
  <div className="flex items-center space-x-3">
    <span className="text-sm font-medium">Quantity:</span>
    <div className="flex items-center">
      <motion.button 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }}
        onClick={decrementQuantity}
        className="w-10 h-10 rounded-l-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
      >
        -
      </motion.button>
      <input 
        type="text" 
        value={quantity} 
        readOnly
        className="w-16 h-10 text-center border-y border-gray-200 bg-white"
      />
      <motion.button 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }}
        onClick={incrementQuantity}
        className="w-10 h-10 rounded-r-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
      >
        +
      </motion.button>
    </div>
  </div>
);

const ActionButtons = ({ handleAddToCart, handleWishlist, isInWishlist }) => (
  <div className="flex gap-4">
    <motion.button 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
      onClick={handleAddToCart}
      className="flex-1 bg-blue-600 text-white h-12 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
    >
      <FaShoppingCart className="mr-2" />
      Add to Cart
    </motion.button>
    <motion.button 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
      onClick={handleWishlist}
      className={`flex-1 h-12 rounded-lg font-medium transition flex items-center justify-center
        ${isInWishlist 
          ? 'bg-red-50 text-red-600 border-2 border-red-600 hover:bg-red-100' 
          : 'bg-gray-50 text-blue-600 border-2 border-blue-600 hover:bg-gray-100'
        }`}
    >
      <FaHeart className="mr-2" />
      {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    </motion.button>
  </div>
);

const AdditionalNotes = ({ product }) => (
  <div className="space-y-2 text-sm">
    <p className="text-red-600">* PLEASE CHECK THE PRODUCT IN FRONT OF THE DELIVERY PERSON</p>
    {product.additionalInfo.freeShipping && (
      <p className="text-blue-600">* FREE SHIPPING</p>
    )}
    {product.additionalInfo.estimatedDelivery && (
      <p className="text-green-600">* Estimated Delivery: {product.additionalInfo.estimatedDelivery}</p>
    )}
  </div>
);

const Specifications = ({ product }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
    <h2 className="text-2xl font-bold mb-6">Specifications</h2>
    <div className="space-y-8">
      {product.specifications.map((specGroup, groupIndex) => (
        <div key={groupIndex}>
          <h3 className="text-xl font-semibold mb-4">{specGroup.group}</h3>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            {specGroup.items.map((item, itemIndex) => (
              <div key={itemIndex} className={`flex ${itemIndex % 2 === 0 ? 'bg-white' : ''}`}>
                <div className="w-1/3 p-4 font-medium text-gray-900 border-r border-gray-200">
                  {item.name}
                </div>
                <div className="w-2/3 p-4 text-gray-600">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const AdditionalInfo = ({ product }) => (
  product.additionalInfo && Object.keys(product.additionalInfo).length > 0 && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
      <h2 className="text-2xl font-bold mb-6 mt-12">Additional Information</h2>
      <div className="bg-gray-50 rounded-xl overflow-hidden">
        {Object.entries(product.additionalInfo)
          .filter(([key]) => !['isFeatured', 'isOnSale', 'freeShipping'].includes(key))
          .map(([key, value], index) => (
            <div key={index} className={`flex ${index % 2 === 0 ? 'bg-white' : ''}`}>
              <div className="w-1/3 p-4 font-medium text-gray-900 border-r border-gray-200">
                {key}
              </div>
              <div className="w-2/3 p-4 text-gray-600">
                {value.toString()}
              </div>
            </div>
          ))}
      </div>
    </motion.div>
  )
);

export default ProductView;
