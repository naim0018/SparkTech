/* eslint-disable react/prop-types */
import { FaShoppingCart, FaHeart, FaCheck } from 'react-icons/fa';
import { TbCurrencyTaka } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/CartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/features/wishlistSlice';
import { toast } from 'react-toastify';
import { useTheme } from '../../ThemeContext';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const wishlistItems = useSelector(state => state?.wishlist?.wishlistItems);
  const isInWishlist = wishlistItems?.some(item => item?._id === product?._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      id: product?._id,
      name: product?.basicInfo?.title,
      price: Math.ceil(product?.price?.discounted || product?.price?.regular),
      image: product?.images?.[0]?.url,
      quantity: 1
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

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product?._id));
      toast.info('Product removed from wishlist!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      dispatch(addToWishlist({
        _id: product?._id,
        title: product?.basicInfo?.title,
        price: Math.ceil(product?.price?.discounted || product?.price?.regular),
        image: product?.images?.[0]?.url
      }));
      toast.success('Product added to wishlist!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Link to={`/product/${product?._id}`} className="block">
      <div className={`group relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1`}>
        {/* Image Section */}
        <div className="relative h-60 overflow-hidden">
          <img 
            src={product?.images?.[0]?.url} 
            alt={product?.basicInfo?.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product?.price?.discounted && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                -{product?.price?.savingsPercentage?.toFixed(0)}%
              </span>
            )}
            {product?.additionalInfo?.isOnSale && (
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                Sale
              </span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-3 group-hover:bottom-4 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="bg-white/90 hover:bg-orange-500 hover:text-white text-gray-900 p-3 rounded-full shadow-lg transition-colors"
            >
              <FaShoppingCart className="text-lg" />
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`${isInWishlist ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-red-500 hover:text-white text-gray-900'} p-3 rounded-full shadow-lg transition-colors`}
            >
              <FaHeart className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Category and Status Badge Row */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-orange-400' : 'bg-orange-100 text-orange-600'} font-medium`}>
              {product?.basicInfo?.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
              product?.stockStatus === 'In Stock' 
                ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600')
                : (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600')
            }`}>
              {product?.stockStatus === 'In Stock' ? (
                <>
                  <FaCheck className="w-3 h-3 mr-1" />
                  In Stock
                </>
              ) : 'Out of Stock'}
            </span>
          </div>

          {/* Title with Two Line Limit */}
          <h3 className={`font-medium text-sm leading-relaxed mb-2 h-20  ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} hover:text-orange-500 transition-colors`}>
            {product?.basicInfo?.title}
          </h3>

          {/* Price Section with Enhanced Background */}
          <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-4 rounded-xl shadow-sm`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold flex items-center text-orange-500">
                  <TbCurrencyTaka className="text-2xl" />
                  {Math.ceil(product?.price?.discounted || product?.price?.regular)}
                </span>
                {product?.price?.discounted && (
                  <span className={`text-base line-through flex items-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <TbCurrencyTaka />
                    {Math.ceil(product?.price?.regular)}
                  </span>
                )}
              </div>
              {product?.price?.discounted && (
                <div className="text-sm text-green-500 font-medium">
                  Save {Math.round(((product.price.regular - product.price.discounted) / product.price.regular) * 100)}%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
