import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaClock, FaCheck, FaTrash } from 'react-icons/fa';
import { TbCurrencyTaka } from 'react-icons/tb';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('cart');
  const { cartItems } = useSelector(state => state.cart);
  const [pendingOrders] = useState([
    {
      id: 1,
      date: '2024-02-15',
      items: [
        { name: 'Product 1', quantity: 2, price: 1200 },
        { name: 'Product 2', quantity: 1, price: 800 }
      ],
      status: 'Processing',
      total: 3200
    }
  ]);
  const [completedOrders] = useState([
    {
      id: 1, 
      date: '2024-02-10',
      items: [
        { name: 'Product 3', quantity: 1, price: 1500 }
      ],
      status: 'Delivered',
      total: 1500
    }
  ]);

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'cart' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FaShoppingCart /> Cart
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'pending'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FaClock /> Pending Orders
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'completed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FaCheck /> Completed Orders
        </button>
      </div>

      <AnimatePresence mode='wait'>
        {activeTab === 'cart' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium flex items-center">
                        <TbCurrencyTaka className="text-xl" />
                        {item.price * item.quantity}
                      </p>
                      <button className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-6 flex justify-between items-center">
                  <p className="text-xl font-bold flex items-center">
                    Total: <TbCurrencyTaka className="text-2xl" />{calculateCartTotal()}
                  </p>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                    Checkout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>
            {pendingOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-500">Order #{order.id}</p>
                  <p className="text-gray-500">{order.date}</p>
                </div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2">
                    <p>{item.name} x {item.quantity}</p>
                    <p className="flex items-center">
                      <TbCurrencyTaka />{item.price * item.quantity}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between mt-4 pt-4 border-t">
                  <p className="font-bold flex items-center">
                    Total: <TbCurrencyTaka />{order.total}
                  </p>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Completed Orders</h2>
            {completedOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-500">Order #{order.id}</p>
                  <p className="text-gray-500">{order.date}</p>
                </div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2">
                    <p>{item.name} x {item.quantity}</p>
                    <p className="flex items-center">
                      <TbCurrencyTaka />{item.price * item.quantity}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between mt-4 pt-4 border-t">
                  <p className="font-bold flex items-center">
                    Total: <TbCurrencyTaka />{order.total}
                  </p>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
