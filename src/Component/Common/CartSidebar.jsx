import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, incrementQuantity, decrementQuantity } from '../../redux/features/CartSlice';
import { FaTimes, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { TbCurrencyTaka } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
const CartSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  
  const totalAmount = cartItems.reduce((total, item) => 
    total + (item.price * item.quantity), 0
  );

  const handleIncrement = (itemKey) => {
    dispatch(incrementQuantity({ itemKey }));
  };

  const handleDecrement = (itemKey) => {
    dispatch(decrementQuantity({ itemKey }));
  };
 
  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Shopping Cart</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <FaTimes className="w-5 h-5 dark:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.map((item,index) => (
            <div key={index} className="flex gap-4 p-2 border-b dark:border-gray-700">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium dark:text-white">{item.name}</h3>
                <div className="flex items-center justify-between mt-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Base Price:</span>
                    <div className="flex items-center text-orange-600 dark:text-orange-400 font-medium">
                      <TbCurrencyTaka className="w-4 h-4" />
                      <span>{item.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Total:</span>
                    <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                      <TbCurrencyTaka className="w-4 h-4" />
                      <span>{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleDecrement(item.itemKey)}
                    className="p-1 rounded bg-gray-100 dark:bg-gray-700"
                  >
                    <FaMinus className="w-3 h-3 dark:text-white" />
                  </button>
                  <span className="dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item.itemKey)}
                    className="p-1 rounded bg-gray-100 dark:bg-gray-700"
                  >
                    <FaPlus className="w-3 h-3 dark:text-white" />
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart({ itemKey: item.itemKey }))}
                    className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex justify-between mb-4">
            <span className="font-semibold dark:text-white">Total:</span>
            <div className="flex items-center">
              <TbCurrencyTaka className="w-5 h-5 dark:text-white" />
              <span className="font-semibold dark:text-white">{totalAmount}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center transition-colors"
            onClick={onClose}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

CartSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CartSidebar;