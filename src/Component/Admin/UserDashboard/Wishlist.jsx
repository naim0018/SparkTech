import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { TbCurrencyTaka } from 'react-icons/tb';
import { addToCart } from '../../../redux/features/CartSlice';
import { removeFromWishlist } from '../../../redux/features/wishlistSlice';
import { toast } from 'react-toastify';
import { useTheme } from '../../../ThemeContext';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const wishlistItems = useSelector((state) => state?.wishlist?.wishlistItems) || [];
  
  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item?._id,
      title: item?.title,
      price: item?.price,
      image: item?.image,
      quantity: 1
    }));
    toast.success('Added to cart!');
  };

  const handleRemoveFromWishlist = (itemId) => {
    dispatch(removeFromWishlist(itemId));
    toast.success('Removed from wishlist!');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <FaHeart className="text-3xl text-red-500" />
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              My Wishlist ({wishlistItems.length})
            </h1>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center p-12 ${
              isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
            } rounded-lg shadow-lg`}
          >
            <FaRegHeart className="text-6xl text-red-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your Wishlist is Empty</h2>
            <p className="text-center max-w-md">
              Add items to your wishlist to keep track of products you&apos;re interested in.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item?._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                } rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="relative">
                  <img
                    src={item?.image}
                    alt={item?.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(item?._id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {item?.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <TbCurrencyTaka className="text-2xl" />
                      <span className="text-xl font-bold">{item?.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FaShoppingCart />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;