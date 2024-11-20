/* eslint-disable react/prop-types */
import { FaStar, FaShoppingCart, FaHeart, FaCheck } from 'react-icons/fa';
import { TbCurrencyTaka } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/CartSlice';
import { addToWishlist } from '../../redux/features/wishlistSlice';
import { toast } from 'react-toastify';
import { useTheme } from '../../ThemeContext';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const isInWishlist = wishlistItems.some(item => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: product.price.discounted || product.price.regular,
      image: product.images[0].url,
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

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    dispatch(addToWishlist({
      _id: product._id,
      title: product.basicInfo.title,
      price: product.price.discounted || product.price.regular,
      image: product.images[0].url
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
  };

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className={`group ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-[480px]`}>
        {/* Image Section with Overlay */}
        <div className="relative h-64">
          <img 
            src={product.images[0].url} 
            alt={product.basicInfo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white/90 hover:bg-white text-gray-900 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className={`${isInWishlist ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white text-gray-900'} p-2 rounded-lg transition-colors`}
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.price.discounted && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                -{product.price.savingsPercentage.toFixed(0)}%
              </span>
            )}
            {product.additionalInfo?.isOnSale && (
              <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Sale
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Brand */}
          <div className="mb-3">
            <h3 className={`font-medium text-lg leading-tight mb-1 h-[50px] overflow-hidden ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {product.basicInfo.title}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              by <span className="font-medium">{product.basicInfo.brand}</span>
            </p>
          </div>

          {/* Rating and Category */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating.average) ? 'opacity-100' : 'opacity-30'}`} />
                ))}
              </div>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ({product.rating.count})
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              {product.basicInfo.category}
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`text-xl font-bold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <TbCurrencyTaka className="text-xl" />
              {(product.price.discounted || product.price.regular).toFixed(2)}
            </span>
            {product.price.discounted && (
              <span className={`text-sm line-through flex items-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <TbCurrencyTaka />
                {product.price.regular.toFixed(2)}
              </span>
            )}
          </div>

          {/* Status and Sales */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <FaCheck className={product.stockStatus === 'In Stock' ? 'text-emerald-500' : 'text-red-500'} />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {product.stockStatus}
              </span>
            </div>
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {product.sold} sold
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
