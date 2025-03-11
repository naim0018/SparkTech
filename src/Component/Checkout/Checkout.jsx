/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* This is a checkout component that handles the entire checkout flow including:
- Personal details collection
- Shipping information
- Order notes
- Payment method selection (bKash or Cash on Delivery)
- Order review and confirmation
*/
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import OrderSummary from './OrderSummary'
import CheckoutForm from './CheckOutForm'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/* Main checkout component that manages the checkout steps and payment selection */
export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState('cash on delivery')
  const cartItems = useSelector((state) => state.cart?.cartItems)

  // Redirect if cart is empty
  if (!cartItems?.length) {
    return <Navigate to="/cart" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <ToastContainer />
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Checkout Form */}
            <div className="p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                চেকআউট
              </h1>
              <CheckoutForm 
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
              />
            </div>

            {/* Order Summary */}
            <OrderSummary 
              selectedPayment={selectedPayment}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
