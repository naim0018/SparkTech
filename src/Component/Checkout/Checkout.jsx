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
import OrderSuccessModal from '../Admin/AdminDashboard/LandingPage/OrderSuccessModal'

/* Main checkout component that manages the checkout steps and payment selection */
export default function Checkout() {
  const cartItems = useSelector((state) => state.cart?.cartItems)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successOrderDetails, setSuccessOrderDetails] = useState(null)

  // Redirect if cart is empty
  if (!cartItems?.length) {
    return <Navigate to="/" replace />
  }

  const handleOrderSuccess = (orderDetails) => {
    setSuccessOrderDetails(orderDetails)
    setShowSuccessModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <ToastContainer />
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Checkout Form */}
            <div className="p-4 md:p-10 bg-white order-2 md:order-none">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 flex items-center">
                <span className="bg-green-100 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                চেকআউট
              </h1>
              <CheckoutForm onOrderSuccess={handleOrderSuccess} />
            </div>

            {/* Order Summary */}
            <div className="p-4 md:p-10 bg-gradient-to-br from-green-50 via-white to-green-50">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderDetails={successOrderDetails}
        />
      )}
    </div>
  )
}
