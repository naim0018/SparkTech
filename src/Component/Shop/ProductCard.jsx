/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/CartSlice';
import { toast } from 'react-toastify';
import { useTheme } from '../../ThemeContext';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  console.log(product);
  const { isDarkMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border text-gray-800'} border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
        <div 
          className="relative overflow-hidden pt-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img 
            src={product.images[0].url} 
            alt={product.images[0].alt} 
            className={`w-full h-48 object-contain ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          {product.price.discounted && product.price.savingsPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Save {product.price.savingsPercentage.toFixed(2)}%
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="relative">
            <h2 
              className={`text-lg font-semibold mb-2 truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {product.basicInfo.title}
            </h2>
            {showTooltip && (
              <div className={`absolute z-10 p-2 rounded-md text-sm ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'} shadow-lg`}>
                {product.basicInfo.title}
              </div>
            )}
          </div>
          <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{product.basicInfo.brand}</p>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 mr-1">
              {[...Array(Math.floor(product.rating.average))].map((_, i) => (
                <FaStar key={i} className="w-4 h-4" />
              ))}
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>({product.rating.count})</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div>
              {product.price.discounted ? (
                <>
                  <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>${product.price.discounted.toFixed(2)}</span>
                  <span className={`text-sm line-through ml-2 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>${product.price.regular.toFixed(2)}</span>
                </>
              ) : (
                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>${product.price.regular.toFixed(2)}</span>
              )}
            </div>
            <span className={`text-sm font-semibold ${product.stockStatus === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>
              {product.stockStatus}
            </span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </button>
            <button 
              onClick={(e) => e.preventDefault()}
              className={`${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} px-3 py-2 rounded-md transition`}
            >
              <FaHeart />
            </button>
          </div>
        </div>
        <div className={`block text-center ${isDarkMode ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' : 'bg-gray-100 text-blue-600 hover:bg-gray-200'} py-2 font-semibold transition`}>
          View Details
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
