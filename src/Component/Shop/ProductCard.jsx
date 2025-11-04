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
    <Link to={`/product/${product?._id}`} className="block group">
      <div className={`relative rounded-3xl overflow-hidden shadow-lg border transition-all duration-400 hover:-translate-y-1
        ${isDarkMode
          ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#134e4a] border-[#1e293b] hover:shadow-emerald-900/40'
          : 'bg-white border-emerald-100 hover:shadow-emerald-300/40'
        }`
      }>
        {/* Image Section */}
        <div
  className={`relative flex items-center justify-center mb-4 overflow-hidden rounded-lg gap-4
    ${isDarkMode
      ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#134e4a]'
      : 'bg-gradient-to-br from-emerald-50 via-white to-green-50'
    }`}
>
  <img
    src={product?.images?.[0]?.url}
    alt={product?.basicInfo?.title}
    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
  />
  {/* Discount Badge */}
  {product?.price?.discounted && (
    <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
      -{product?.price?.savingsPercentage?.toFixed(0) || Math.round(100 - (product?.price?.discounted / product?.price?.regular) * 100)}%
    </span>
  )}
  {/* Sale Badge */}
  {product?.additionalInfo?.isOnSale && (
    <span className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
      Sale
    </span>
  )}
  {/* Quick Action Buttons (hover only) */}
  <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <button
      onClick={handleAddToCart}
      className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-colors"
      title="Add to Cart"
    >
      <FaShoppingCart className="text-lg" />
    </button>
    <button
      onClick={handleToggleWishlist}
      className={`p-3 rounded-full shadow-lg transition-colors ${
        isInWishlist
          ? 'bg-red-500 text-white'
          : isDarkMode
          ? 'bg-[#1e293b] hover:bg-red-500 hover:text-white text-emerald-100'
          : 'bg-white hover:bg-red-500 hover:text-white text-gray-900'
      }`}
      title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <FaHeart className="text-lg" />
    </button>
  </div>
</div>


        {/* Content Section */}
        <div className="p-5">
          {/* Category and Status Badge Row */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium
              ${isDarkMode ? 'bg-[#1e293b] text-emerald-100' : 'bg-emerald-100 text-emerald-700'}`}>
              {product?.basicInfo?.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
              product?.stockStatus === 'In Stock' 
                ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')
                : (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600')
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
          <h3 className={`font-semibold text-base leading-tight mb-2 h-12 group-hover:text-green-400 transition-colors line-clamp-2
            ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
            {product?.basicInfo?.title}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xl font-bold flex items-center ${isDarkMode ? 'text-emerald-200' : 'text-green-600'}`}>
              <TbCurrencyTaka className="text-xl" />
              {Math.ceil(product?.price?.discounted || product?.price?.regular)}
            </span>
            {product?.price?.discounted && (
              <span className={`text-base line-through flex items-center ${isDarkMode ? 'text-emerald-700' : 'text-gray-400'}`}>
                <TbCurrencyTaka />
                {Math.ceil(product?.price?.regular)}
              </span>
            )}
          </div>

          {/* Visible Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full mt-2 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200
              ${isDarkMode
                ? 'bg-[#1e293b] hover:bg-green-700 text-emerald-100'
                : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
          >
            <FaShoppingCart className="text-lg" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
