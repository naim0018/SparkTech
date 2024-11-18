/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
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
  const [selectedVariant, setSelectedVariant] = useState(null);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const isInWishlist = wishlistItems.some(item => item._id === product?._id);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!product) return <NotFoundState />;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    const price = selectedVariant ? selectedVariant.price : (product.price.discounted || product.price.regular);
    dispatch(addToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: price,
      image: product.images[0].url,
      quantity: quantity,
      variant: selectedVariant ? selectedVariant.value : null
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
        price: product.price.discounted || product.price.regular,
        image: product.images[0].url
      }));
      toast.success('Added to wishlist!', {
        position: "bottom-right", 
        autoClose: 2000
      });
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} min-h-screen py-4 sm:py-8`}>
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4 md:p-8 mb-8`}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2 h-[250px] sm:h-[350px] md:h-[500px] lg:h-[622px]">
              <ProductImages images={product.images} />
            </div>
            <div className="w-full lg:w-1/2">
              <ProductInfo 
                product={product} 
                quantity={quantity}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
                handleAddToCart={handleAddToCart}
                handleWishlist={handleWishlist}
                isInWishlist={isInWishlist}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4 md:p-8 mb-8`}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-3/4">
              <Specifications product={product} />
              <AdditionalInfo product={product} />
            </div>
            <div className="w-full lg:w-1/4">
              <RelatedProducts relatedProducts={product.relatedProducts} currentProductId={product._id} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorState = () => (
  <div className="flex justify-center items-center h-screen text-red-600">
    <FaExclamationTriangle className="text-2xl sm:text-4xl mr-2" />
    <span className="text-sm sm:text-base">Error loading product details</span>
  </div>
);

const NotFoundState = () => (
  <div className="flex justify-center items-center h-screen text-gray-800">
    <FaSearch className="text-2xl sm:text-4xl mr-2" />
    <span className="text-sm sm:text-base">Product not found</span>
  </div>
);

const ProductInfo = ({ product, quantity, incrementQuantity, decrementQuantity, handleAddToCart, handleWishlist, isInWishlist, selectedVariant, setSelectedVariant }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{product.basicInfo.title}</h1>
    {product.rating && product.rating.count > 0 && <Rating rating={product.rating} />}
    <ProductDetails product={product} />
    <PriceInfo product={product} selectedVariant={selectedVariant} />
    <KeyFeatures product={product} />
    <ProductVariants product={product} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} />
    <QuantitySelector 
      quantity={quantity}
      incrementQuantity={incrementQuantity}
      decrementQuantity={decrementQuantity}
    />
    <ActionButtons handleAddToCart={handleAddToCart} handleWishlist={handleWishlist} isInWishlist={isInWishlist} />
    <AdditionalNotes product={product} />
  </motion.div>
);

const Rating = ({ rating }) => (
  <div className="flex items-center mb-4">
    <div className="flex text-yellow-400 mr-2">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className={`text-lg sm:text-xl ${i < Math.round(rating.average) ? 'text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
    <span className="text-gray-600 text-xs sm:text-sm">({rating.count} reviews)</span>
  </div>
);

const ProductDetails = ({ product }) => (
  <div className="mb-4 text-xs sm:text-sm">
    <p className="mb-1"><span className="font-semibold">Brand:</span> {product.basicInfo.brand}</p>
    <p className="mb-1"><span className="font-semibold">Product Code:</span> {product.basicInfo.productCode}</p>
    <p className="mb-1"><span className="font-semibold">Availability:</span> {product.stockStatus}</p>
    <p className="mb-1 uppercase"><span className="font-semibold capitalize">Category:</span> {product.basicInfo.category}</p>
    <p className="mb-1"><span className="font-semibold">Subcategory:</span> {product.basicInfo.subcategory}</p>
    {product.basicInfo.model && (
      <p className="mb-1"><span className="font-semibold">Model:</span> {product.basicInfo.model}</p>
    )}
    {product.basicInfo.warranty && (
      <p className="mb-1"><span className="font-semibold">Warranty:</span> {product.basicInfo.warranty}</p>
    )}
    {product.stockQuantity && (
      <p className="mb-1"><span className="font-semibold">In Stock:</span> {product.stockQuantity} units</p>
    )}
    {product.additionalInfo && product.additionalInfo.isOnSale && (
      <p className="mb-1 text-green-600 font-semibold">On Sale</p>
    )}
  </div>
);

const PriceInfo = ({ product, selectedVariant }) => {
  const price = selectedVariant ? selectedVariant.price : product.price;
  return (
    <div className="mb-4">
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-2">
        Tk {price.discounted || price.regular}
      </p>
      {price.discounted && (
        <p className="text-xs sm:text-sm text-gray-500">
          Regular Price: <span className="line-through">Tk {price.regular}</span>
          {' '}(Save: Tk {price.savings} - {price.savingsPercentage.toFixed(2)}%)
        </p>
      )}
    </div>
  );
};

const KeyFeatures = ({ product }) => (
  <div className="mb-4">
    <h2 className="text-lg sm:text-xl font-bold mb-2">Key Features</h2>
    <ul className="list-disc list-inside text-xs sm:text-sm">
      {product.basicInfo.keyFeatures.map((feature, index) => (
        <li key={index} className="mb-1">{feature}</li>
      ))}
    </ul>
  </div>
);

const ProductVariants = ({ product, selectedVariant, setSelectedVariant }) => (
  product.variants && product.variants.length > 0 && (
    <div className="mb-4">
      {product.variants.map((variant, index) => (
        <div key={index} className="mb-2">
          <label className="block mb-1 font-semibold text-xs sm:text-sm">{variant.name}:</label>
          <select 
            className="w-full p-2 border border-gray-300 bg-white text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
            value={selectedVariant && selectedVariant.value === variant.value ? variant.value : ''}
            
            onChange={(e) => setSelectedVariant(variant)}
          >
            <option value="">Select {variant.name}</option>
            <option value={variant.value}>{variant.value}</option>
          </select>
        </div>
      ))}
    </div>
  )
);

const QuantitySelector = ({ quantity, incrementQuantity, decrementQuantity }) => (
  <div className="flex items-center mb-4">
    <motion.button 
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.9 }}
      onClick={decrementQuantity} 
      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-l-md transition text-lg sm:text-xl flex items-center justify-center"
    >
      -
    </motion.button>
    <input 
      type="text" 
      value={quantity} 
      readOnly
      className="w-12 sm:w-16 h-8 sm:h-10 text-center border-t border-b border-gray-300 bg-white text-gray-700 text-base sm:text-lg"
    />
    <motion.button 
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.9 }}
      onClick={incrementQuantity} 
      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-r-md transition text-lg sm:text-xl flex items-center justify-center"
    >
      +
    </motion.button>
  </div>
);

const ActionButtons = ({ handleAddToCart, handleWishlist, isInWishlist }) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-4">
    <motion.button 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      onClick={handleAddToCart}
      className="flex-1 bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md text-base sm:text-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
    >
      <FaShoppingCart className="mr-2" />
      Add to Cart
    </motion.button>
    <motion.button 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      onClick={handleWishlist}
      className={`flex-1 border-2 ${isInWishlist ? 'border-red-600 text-red-600 hover:bg-red-50' : 'border-blue-600 text-blue-600 hover:bg-blue-50'} py-2 sm:py-3 px-4 sm:px-6 rounded-md text-base sm:text-lg font-semibold transition flex items-center justify-center`}
    >
      <FaHeart className="mr-2" />
      {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    </motion.button>
  </div>
);

const AdditionalNotes = ({ product }) => (
  <div>
    <p className="text-red-600 text-xs sm:text-sm mb-1">* PLEASE CHECK THE PRODUCT IN FRONT OF THE DELIVERY PERSON</p>
    {product.additionalInfo.freeShipping && (
      <p className="text-blue-600 text-xs sm:text-sm">* FREE SHIPPING</p>
    )}
    {product.additionalInfo.estimatedDelivery && (
      <p className="text-green-600 text-xs sm:text-sm">* Estimated Delivery: {product.additionalInfo.estimatedDelivery}</p>
    )}
  </div>
);

const Specifications = ({ product }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
    <h2 className="text-xl sm:text-2xl font-bold mb-4">Specifications</h2>
    {product.specifications.map((specGroup, groupIndex) => (
      <div key={groupIndex} className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">{specGroup.group}</h3>
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          {specGroup.items.map((item, itemIndex) => (
            <div key={itemIndex} className={`flex ${itemIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
              <div className="w-1/3 p-2 sm:p-3 font-semibold text-gray-700 border-gray-200 border-r text-xs sm:text-sm">
                {item.name}
              </div>
              <div className="w-2/3 p-2 sm:p-3 text-gray-600 text-xs sm:text-sm">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </motion.div>
);

const AdditionalInfo = ({ product }) => (
  product.additionalInfo && Object.keys(product.additionalInfo).length > 0 && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-8">Additional Information</h2>
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        {Object.entries(product.additionalInfo).map(([key, value], index) => (
          <div key={index} className={`flex ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
            <div className="w-1/3 p-2 sm:p-3 font-semibold text-gray-700 border-gray-200 border-r text-xs sm:text-sm">
              {key}
            </div>
            <div className="w-2/3 p-2 sm:p-3 text-gray-600 text-xs sm:text-sm">
              {value.toString()}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
);

export default ProductView;
