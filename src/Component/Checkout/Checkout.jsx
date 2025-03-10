/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* This is a checkout component that handles the entire checkout flow including:
- Personal details collection
- Shipping information
- Order notes
- Payment method selection (bKash or Cash on Delivery)
- Order review and confirmation
*/
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useCreateOrderMutation } from '../../redux/api/OrderApi'
import { clearCart } from '../../redux/features/CartSlice'
import { useCreateBkashPaymentMutation } from '../../redux/api/bkashApi'
import { Navigate, useLocation, useNavigate } from 'react-router-dom' 
import Swal from 'sweetalert2'
import OrderSummary from './OrderSummary'
import CheckoutForm from './CheckOutForm'



/* Main checkout component that manages the checkout steps and payment selection */
export default function Component() {
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const resetCheckout = () => {
    setSelectedPayment(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full px-10">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-light mb-6 text-gray-800">Checkout</h1>
            <CheckoutForm 
              resetCheckout={resetCheckout} 
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              setPaymentStatus={setPaymentStatus}
            />
          </div>
          <OrderSummary paymentStatus={paymentStatus} />
        </div>
      </div>
    </div>
  )
}
