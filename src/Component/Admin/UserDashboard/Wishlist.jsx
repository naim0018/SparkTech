import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { TbCurrencyTaka } from 'react-icons/tb';
import { addToCart } from '../../../redux/features/CartSlice';
import { toast } from 'react-toastify';
import { useTheme } from '../../../ThemeContext';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const [wishlistItems, setWishlistItems] = useState([
    // Sample data - replace with actual wishlist data
    {
      id: 1,
      name: "Sample Product 1",
      price: 999,
      image: "https://example.com/image1.jpg",
      inStock: true
    },
    {
      id: 2, 
      name: "Sample Product 2",
      price: 1499,
      image: "https://example.com/image2.jpg",
      inStock: false
    }
  ]);

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    }));
    toast.success('Added to cart!');
  };

  const handleRemoveFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Removed from wishlist!');
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
            <p className="text-xl">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item.id} 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 flex items-center justify-between`}
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <div className="flex items-center mt-2">
                      <TbCurrencyTaka className="text-xl" />
                      <span className="text-lg font-medium">{item.price}</span>
                    </div>
                    <span className={`text-sm ${item.inStock ? 'text-green-500' : 'text-red-500'}`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className={`p-2 rounded-full ${
                      item.inStock 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-gray-400 cursor-not-allowed text-gray-200'
                    }`}
                  >
                    <FaShoppingCart className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-100"
                  >
                    <FaTrash className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;