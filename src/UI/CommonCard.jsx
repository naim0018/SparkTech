import PropTypes from 'prop-types';
import { TbCurrencyTaka } from "react-icons/tb";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { useTheme } from '../ThemeContext';

const CommonCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`relative group overflow-hidden border rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} hover:shadow-lg`}>
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={product.images[0]?.url} 
          alt={product.images[0]?.alt || product.basicInfo.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      {product.price.discounted && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
          {Math.round(((product.price.regular - product.price.discounted) / product.price.regular) * 100)}% OFF
        </div>
      )}

      <div className="p-3">
        <h3 className="text-sm font-medium mb-1 line-clamp-1">{product.basicInfo.title}</h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-base font-bold flex items-center">
              <TbCurrencyTaka className="inline" />
              {product.price.discounted || product.price.regular}
            </span>
            {product.price.discounted && (
              <span className="text-xs text-gray-500 line-through flex items-center">
                <TbCurrencyTaka className="inline" />
                {product.price.regular}
              </span>
            )}
          </div>
          <span className={`text-xs font-medium ${product.stockStatus === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>
            {product.stockStatus}
          </span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onAddToCart}
            disabled={product.stockStatus !== 'In Stock'}
            className={`flex-1 flex items-center justify-center py-1.5 px-2 rounded-lg text-xs font-medium
              ${isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700' 
                : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-200'
              } disabled:cursor-not-allowed`}
          >
            <MdOutlineShoppingCart className="mr-1" /> 
            Add to Cart
          </button>
          <button 
            onClick={onAddToWishlist}
            className={`p-1.5 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <FaHeart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

CommonCard.propTypes = {
  product: PropTypes.shape({
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        alt: PropTypes.string,
      })
    ).isRequired,
    basicInfo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      category: PropTypes.string,
      brand: PropTypes.string,
    }).isRequired,
    price: PropTypes.shape({
      discounted: PropTypes.number,
      regular: PropTypes.number.isRequired,
    }).isRequired,
    stockStatus: PropTypes.string.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onAddToWishlist: PropTypes.func.isRequired,
};

export default CommonCard;