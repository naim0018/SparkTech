import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../../redux/features/wishlistSlice';
import { addToCart } from '../../redux/features/CartSlice';
import { FaTimes, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { TbCurrencyTaka } from 'react-icons/tb';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTheme } from '../../ThemeContext';

const WishlistSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item._id,
      name: item.title,
      price: item.price,
      image: item.image,
      quantity: 1
    }));
    dispatch(removeFromWishlist(item._id));
    toast.success('Added to cart!');
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-96 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Wishlist ({wishlistItems.length})
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full`}
          >
            <FaTimes className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {wishlistItems.map(item => (
            <div key={item._id} className={`flex gap-4 p-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {item.title}
                </h3>
                <div className="flex items-center mt-2">
                  <TbCurrencyTaka className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                    {item.price}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`flex items-center gap-2 px-3 py-1 rounded ${
                      isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white transition-colors`}
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => dispatch(removeFromWishlist(item._id))}
                    className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {wishlistItems.length === 0 && (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Your wishlist is empty
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

WishlistSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default WishlistSidebar; 