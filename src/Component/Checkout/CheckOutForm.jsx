/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useCreateOrderMutation } from '../../redux/api/OrderApi'
import { clearCart } from '../../redux/features/CartSlice'
import { useCreateBkashPaymentMutation } from '../../redux/api/bkashApi'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import PropTypes from 'prop-types'

function CheckoutForm({ resetCheckout, selectedPayment, setSelectedPayment, setPaymentStatus }) {
  // All state and hooks remain the same
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm()
  const dispatch = useDispatch()
  const [createOrder] = useCreateOrderMutation()
  const cartItems = useSelector((state) => state.cart?.cartItems)
  const cartTotal = useSelector((state) => state.cart?.cartItems?.reduce((total, item) => total + item.price * item.quantity, 0))
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const shippingCost = 0
  const taxRate = 0
  const location = useLocation()
  const [createBkashPayment] = useCreateBkashPaymentMutation()
  const user = useSelector((state) => state.auth?.user)
  const navigate = useNavigate()
  const [bkashPaymentSuccess, setBkashPaymentSuccess] = useState(false)

  // All useEffect hooks and handlers remain exactly the same as before
  useEffect(() => {
    setSelectedPayment('bkash')
  }, [setSelectedPayment])

  useEffect(() => {
    const savedFormData = localStorage.getItem('checkoutFormData')
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData)
      Object.keys(parsedData).forEach(key => {
        setValue(key, parsedData[key])
      })
    }
  }, [setValue])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const message = searchParams.get('message')
    const trxID = searchParams.get('trxID')
    const amount = searchParams.get('amount')

    if (message === 'Successful') {
      setBkashPaymentSuccess(true)
      setSelectedPayment('bkash')
      setPaymentStatus('bkash')
      Swal.fire({
        title: 'Payment Successful!',
        text: `Transaction ID: ${trxID}\nAmount Paid: ${amount} BDT`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
    }
  }, [location, setSelectedPayment])

  const handleBkashPayment = async () => {
    if (bkashPaymentSuccess) return
    
    setSelectedPayment('bkash')
    try {
      const response = await createBkashPayment({
        amount: cartTotal,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "Inv" + Math.random().toString(36).substring(2, 7),
        userEmail: user?.email
      }).unwrap()

      if (response?.bkashURL) {
        window.location.href = response.bkashURL
      }
    } catch (error) {
      console.error('Bkash payment error:', error)
      Swal.fire({
        title: 'Error',
        text: 'Failed to initiate bKash payment',
        icon: 'error'
      })
    }
  }

  const handleCodPayment = () => {
    if (bkashPaymentSuccess) return
    setSelectedPayment('cod')
    setPaymentStatus('cod')
  }

  const onSubmit = async (data) => {
    // All submission logic remains the same
    localStorage.setItem('checkoutFormData', JSON.stringify(data))

    if (!selectedPayment) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a payment method',
        icon: 'error'
      })
      return
    }

    if (selectedPayment === 'bkash' && !bkashPaymentSuccess) {
      Swal.fire({
        title: 'Error',
        text: 'Please complete bKash payment first',
        icon: 'error'
      })
      return
    }

    try {
      Swal.fire({
        title: 'Processing Order',
        text: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      const orderData = {
        items: cartItems?.map((item) => ({
          product: item?.id,
          quantity: item?.quantity,
          price: item?.price
        })),
        totalAmount: cartTotal + shippingCost + (cartTotal * taxRate),
        status: selectedPayment === 'bkash' ? 'Processing' : 'Pending',
        billingInformation: {
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
          phone: data?.phone,
          streetAddress: data?.streetAddress,
          city: data?.city,
          zipCode: data?.zipCode,
          country: data?.country,
          paymentMethod: selectedPayment,
          notes: data?.notes
        },
        paymentInfo: {
          paymentMethod: selectedPayment === 'cod' ? 'cash on delivery' : 'bkash',
          status: selectedPayment === 'bkash' ? 'completed' : 'pending',
          amount: cartTotal + shippingCost + (cartTotal * taxRate)
        }
      }

      const response = await createOrder(orderData).unwrap()

      if (response?.success) {
        dispatch(clearCart())
        localStorage.removeItem('checkoutFormData')
        Swal.close()
        setShowSuccessModal(true)
      }

    } catch (error) {
      console.error('Order creation failed:', error)
      
      Swal.fire({
        title: 'Error',
        text: error?.data?.message || 'Failed to place order. Please try again.',
        icon: 'error'
      })
    }
  }

  const handleGoHome = () => {
    setShowSuccessModal(false)
    resetCheckout()
    navigate('/')
  }

  const handleCancel = () => {
    setShowSuccessModal(false)
    resetCheckout()
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white shadow-lg rounded-lg p-4">
        {/* Personal Information */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input 
                placeholder="First Name *"
                className="w-full px-3 py-2 text-sm border rounded"
                {...register('firstName', { required: true })}
              />
              {errors?.firstName && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div>
              <input 
                placeholder="Last Name *"
                className="w-full px-3 py-2 text-sm border rounded"
                {...register('lastName', { required: true })}
              />
              {errors?.lastName && <span className="text-red-500 text-xs">Required</span>}
            </div>
          </div>
          <div className="mt-3 space-y-3">
            <input 
              type="email"
              placeholder="Email Address *"
              className="w-full px-3 py-2 text-sm border rounded"
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors?.email && <span className="text-red-500 text-xs">Valid email required</span>}
            
            <input 
              type="tel"
              placeholder="Phone Number *"
              className="w-full px-3 py-2 text-sm border rounded"
              {...register('phone', { required: true })}
            />
            {errors?.phone && <span className="text-red-500 text-xs">Required</span>}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Shipping Information</h3>
          <div className="space-y-3">
            <input 
              placeholder="Street Address *"
              className="w-full px-3 py-2 text-sm border rounded"
              {...register('streetAddress', { required: true })}
            />
            {errors?.streetAddress && <span className="text-red-500 text-xs">Required</span>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input 
                  placeholder="City *"
                  className="w-full px-3 py-2 text-sm border rounded"
                  {...register('city', { required: true })}
                />
                {errors?.city && <span className="text-red-500 text-xs">Required</span>}
              </div>
              <div>
                <input 
                  placeholder="ZIP Code *"
                  className="w-full px-3 py-2 text-sm border rounded"
                  {...register('zipCode', { required: true })}
                />
                {errors?.zipCode && <span className="text-red-500 text-xs">Required</span>}
              </div>
            </div>
            
            <input 
              value="Bangladesh"
              readOnly
              className="w-full px-3 py-2 text-sm border rounded bg-gray-50"
              {...register('country')}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
          <textarea 
            placeholder="Order Notes (Optional)"
            rows="2"
            className="w-full px-3 py-2 text-sm border rounded"
            {...register('notes')}
          ></textarea>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleBkashPayment}
              className={`p-3 rounded border text-sm ${
                selectedPayment === 'bkash' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
              }`}
            >
              <img src="https://i.imgur.com/ASu87Xi.png" alt="bKash" className="h-6 mx-auto mb-1" />
              <span className="text-xs">Pay with bKash</span>
              {bkashPaymentSuccess && selectedPayment === 'bkash' && (
                <div className="text-green-500 text-xs mt-1">Payment Completed</div>
              )}
            </button>

            <button
              type="button"
              onClick={handleCodPayment}
              className={`p-3 rounded border text-sm ${
                selectedPayment === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs">Cash on Delivery</span>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              className="mr-2"
              {...register('terms', { required: true })}
            />
            I agree to the terms and conditions
          </label>
          {errors?.terms && <span className="text-red-500 text-xs">You must agree to the terms</span>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700"
        >
          Place Order
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600 text-sm mb-4">
                Thank you for your purchase. Your order has been received and will be processed shortly.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleGoHome}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded"
                >
                  Return Home
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

CheckoutForm.propTypes = {
  resetCheckout: PropTypes.func.isRequired,
  selectedPayment: PropTypes.string,
  setSelectedPayment: PropTypes.func.isRequired,
  setPaymentStatus: PropTypes.func.isRequired
}

export default CheckoutForm
