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
  const [step, setStep] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)
  const resetCheckout = () => {
    setStep(1)
    setSelectedPayment(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full px-10">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-light mb-6 text-gray-800">Checkout</h1>
            <div className="mb-8 flex justify-between">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`flex items-center ${i < step ? 'text-teal-600' : i === step ? 'text-teal-500' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${i < step ? 'border-teal-600 bg-teal-600 text-white' : i === step ? 'border-teal-500 text-teal-500' : 'border-gray-400'}`}>
                    {i < step ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> : i}
                  </div>
                  <span className="text-sm">{i === 1 ? 'Details' : i === 2 ? 'Shipping' : i === 3 ? 'Order Notes' : 'Review'}</span>
                </div>
              ))}
            </div>
            <CheckoutForm 
              step={step} 
              nextStep={nextStep} 
              prevStep={prevStep} 
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
