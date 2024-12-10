/* eslint-disable react/prop-types */
import { useSelector, useDispatch } from 'react-redux'
import { incrementQuantity, decrementQuantity, removeFromCart } from '../../redux/features/CartSlice'

const OrderSummary = ({ paymentStatus }) => {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart?.cartItems)
  const cartTotal = useSelector((state) => state.cart?.cartItems?.reduce((total, item) => total + item?.price * item?.quantity, 0))
  const shippingCost = 0
  const taxRate = 0
  const totalAmount = cartTotal + shippingCost + (cartTotal * taxRate)

  const handleIncrement = (itemId) => {
    dispatch(incrementQuantity({ id: itemId }))
  }

  const handleDecrement = (itemId) => {
    dispatch(decrementQuantity({ id: itemId }))
  }

  const handleRemove = (itemId) => {
    dispatch(removeFromCart({ id: itemId }))
  }

  return (
    <div className="md:w-1/3 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">
        Order Summary
      </h2>

      <div className="space-y-6">
        <div className="max-h-[300px] overflow-y-auto pr-2">
          {cartItems?.map((item) => (
            <div key={item?.id} className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={item?.image} 
                    alt={item?.name} 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{item?.name}</h3>
                  <p className="text-sm text-gray-500">৳{item?.price?.toFixed(2)} x {item?.quantity}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <button 
                      onClick={() => handleDecrement(item?.id)}
                      className="bg-gray-200 text-gray-600 px-2 rounded hover:bg-gray-300"
                      disabled={item?.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-gray-700">{item?.quantity}</span>
                    <button 
                      onClick={() => handleIncrement(item?.id)}
                      className="bg-gray-200 text-gray-600 px-2 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => handleRemove(item?.id)}
                      className="ml-2 text-red-500 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <span className="font-semibold text-gray-800">৳{(item?.price * item?.quantity)?.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t pt-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>৳{cartTotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : `৳${shippingCost?.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>{(cartTotal * taxRate)?.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold text-gray-800">
            <span>Total</span>
            <span>৳{totalAmount?.toFixed(2)}</span>
          </div>

          {paymentStatus === 'bkash' && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between text-green-600 font-medium">
                <span>Paid via bKash</span>
                <span>৳{totalAmount?.toFixed(2)}</span>
              </div>
              <div className="text-green-500 text-sm mt-2 flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Payment completed successfully
              </div>
            </div>
          )}

          {(paymentStatus === 'cod' || paymentStatus === 'cash on delivery') && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between text-blue-600 font-medium">
                <span>Cash on Delivery</span>
                <span>৳{totalAmount?.toFixed(2)}</span>
              </div>
              <div className="text-blue-500 text-sm mt-2 flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Pay when you receive your order
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderSummary