/* eslint-disable react/prop-types */
import { useSelector, useDispatch } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../../redux/features/CartSlice';
import { useTheme } from '../../ThemeContext'; // Import useTheme hook

const Cart = ({ toggleCart }) => {
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme(); // Use the useTheme hook
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={`fixed top-0 right-0 h-full w-full sm:w-96 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg z-50 flex flex-col`}>
      <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} flex justify-between items-center`}>
        <h2 className="text-2xl font-bold text-white">Your Cart</h2>
        <button onClick={toggleCart} className="text-white hover:text-gray-300 transition duration-300">
          <IoMdClose size={24} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {!cartItems || cartItems.length === 0 ? (
          <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-8`}>Your cart is empty</p>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className={`${isDarkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg shadow-md p-4 flex items-center`}>
                <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</h3>
                    <p className="text-lg font-medium text-blue-400">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>${item.price.toFixed(2)} each</p>
                  <div className="mt-2 flex items-center">
                    <button
                      onClick={() => dispatch(decrementQuantity({ id: item.id }))}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <FaMinus />
                    </button>
                    <span className={`mx-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>{item.quantity}</span>
                    <button
                      onClick={() => dispatch(incrementQuantity({ id: item.id }))}
                      className="text-green-500 hover:text-green-700 focus:outline-none"
                    >
                      <FaPlus />
                    </button>
                    <button
                      onClick={() => dispatch(removeFromCart({ id: item.id }))}
                      className="ml-auto text-red-500 hover:text-red-600 focus:outline-none"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <span className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Total:</span>
          <span className="text-xl font-bold text-blue-400">${total.toFixed(2)}</span>
        </div>
        <button className={`w-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'} text-white py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-lg font-semibold`}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
