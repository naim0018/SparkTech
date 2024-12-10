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

function CheckoutForm({ step, nextStep, prevStep, resetCheckout, selectedPayment, setSelectedPayment , setPaymentStatus }) {
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

  // Set bKash as default payment method
  useEffect(() => {
    setSelectedPayment('bkash')
  }, [setSelectedPayment])

  // Load saved form data from localStorage on component mount
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
      // Move to step 4 if payment successful
      if (step < 4) {
        nextStep()
        nextStep()
        nextStep()
      }
      Swal.fire({
        title: 'Payment Successful!',
        text: `Transaction ID: ${trxID}\nAmount Paid: ${amount} BDT`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
    }
  }, [location, nextStep, setSelectedPayment, step])

  const handleBkashPayment = async () => {
    if (bkashPaymentSuccess) return // Prevent new payment if already successful
    
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
    if (bkashPaymentSuccess) return // Prevent changing payment if bKash successful
    setSelectedPayment('cod')
    setPaymentStatus('cod')
  }

  const onSubmit = async (data) => {
    // Save form data to localStorage
    localStorage.setItem('checkoutFormData', JSON.stringify(data))

    if (step < 4) {
      nextStep()
      return
    }

    // Validate payment method selection
    if (!selectedPayment) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a payment method',
        icon: 'error'
      })
      return
    }

    // Validate bKash payment completion
    if (selectedPayment === 'bkash' && !bkashPaymentSuccess) {
      Swal.fire({
        title: 'Error',
        text: 'Please complete bKash payment first',
        icon: 'error'
      })
      return
    }

    try {
      // Show loading state
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
        // Clear cart and form data
        dispatch(clearCart())
        localStorage.removeItem('checkoutFormData')

        // Close loading state
        Swal.close()

        // Show success modal
        setShowSuccessModal(true)
      }

    } catch (error) {
      console.error('Order creation failed:', error)
      
      Swal.fire({
        title: 'Error',
        text: error?.data?.message || 'Failed to place order. Please try again.',
        icon: 'error'
      })

      if (error?.status === 400) {
        console.error('Validation errors:', error?.data?.errorSources)
      }
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="text-gray-700">First Name</label>
                <input id="firstName" placeholder="John" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('firstName', { required: true })} />
                {errors?.firstName && <span className="text-red-500">This field is required</span>}
              </div>
              <div>
                <label htmlFor="lastName" className="text-gray-700">Last Name</label>
                <input id="lastName" placeholder="Doe" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('lastName', { required: true })} />
                {errors?.lastName && <span className="text-red-500">This field is required</span>}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="text-gray-700">Email</label>
              <input id="email" type="email" placeholder="john@example.com" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
              {errors?.email && <span className="text-red-500">Please enter a valid email</span>}
            </div>
            <div>
              <label htmlFor="phone" className="text-gray-700">Phone Number</label>
              <input id="phone" type="tel" placeholder="0171234XXXX" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('phone', { required: true })} />
              {errors?.phone && <span className="text-red-500">This field is required</span>}
            </div>
            <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white p-2 rounded transition-colors duration-300">
              Continue to Shipping
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="streetAddress" className="text-gray-700">Street Address</label>
              <input id="streetAddress" placeholder="House Number, Road Number, Block Number" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('streetAddress', { required: true })} />
              {errors?.streetAddress && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="text-gray-700">City</label>
                <input id="city" placeholder="Dhaka" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('city', { required: true })} />
                {errors?.city && <span className="text-red-500">This field is required</span>}
              </div>
              <div>
                <label htmlFor="zipCode" className="text-gray-700">ZIP Code</label>
                <input id="zipCode" placeholder="12345" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('zipCode', { required: true })} />
                {errors?.zipCode && <span className="text-red-500">This field is required</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="country" className="text-gray-700">Country</label>
                <input id="country" value="Bangladesh" readOnly className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-50" {...register('country', { required: true, value: 'Bangladesh' })} />
                {errors?.country && <span className="text-red-500">This field is required</span>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="sameAsBilling" className="h-4 w-4 text-teal-600 border-gray-300 rounded" {...register('sameAsBilling')} />
              <label htmlFor="sameAsBilling" className="text-sm text-gray-700">Billing address same as shipping</label>
            </div>
            <div className="flex space-x-4">
              <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition-colors duration-300">
                Back
              </button>
              <button type="submit" className="w-1/2 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded transition-colors duration-300">
                Continue to Payment
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="notes" className="text-gray-700">Order Notes (Optional)</label>
              <textarea id="notes" placeholder="Any special instructions for your order?" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('notes')}></textarea>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="h-4 w-4 text-teal-600 border-gray-300 rounded" {...register('terms', { required: true })} />
              <label htmlFor="terms" className="text-sm text-gray-700">I agree to the terms and conditions</label>
            </div>
            {errors?.terms && <span className="text-red-500">You must agree to the terms and conditions</span>}
            <div className="flex space-x-4">
              <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition-colors duration-300">
                Back
              </button>
              <button type="submit" className="w-1/2 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded transition-colors duration-300">
                Review Order
              </button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Order Review</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Personal Information</h4>
              <p>Name: {watch('firstName')} {watch('lastName')}</p>
              <p>Email: {watch('email')}</p>
              <p>Phone: {watch('phone')}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Shipping Address</h4>
              <p>{watch('streetAddress')}</p>
              <p>{watch('city')}, {watch('state')} {watch('zipCode')}</p>
              <p>{watch('country')}</p>
            </div>

            {watch('notes') && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Order Notes</h4>
                <p>{watch('notes')}</p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Payment Method</h4>
              <div className="mt-2">
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-700">
                      {bkashPaymentSuccess ? 'Selected Payment Method' : 'Choose Payment Method'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        onClick={handleBkashPayment}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg ${
                          bkashPaymentSuccess ? 'cursor-default' : 'cursor-pointer'
                        } transition-all duration-200 ${
                          selectedPayment === 'bkash' 
                            ? bkashPaymentSuccess 
                              ? 'border-green-500 bg-green-50'
                              : ''
                            : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50'
                        } ${bkashPaymentSuccess && selectedPayment !== 'bkash' ? 'opacity-50' : ''}`}
                      >
                        <img src="https://i.imgur.com/ASu87Xi.png" alt="bKash" className="h-8 mb-2" />
                        <span className="text-sm font-medium text-gray-600">Pay with bKash</span>
                        {bkashPaymentSuccess && selectedPayment === 'bkash' && (
                          <span className="text-green-500 text-sm mt-2">Payment Completed</span>
                        )}
                      </div>

                      <div 
                        onClick={handleCodPayment}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg ${
                          bkashPaymentSuccess ? 'cursor-default' : 'cursor-pointer'
                        } transition-all duration-200 ${
                          selectedPayment === 'cod'
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-500 hover:bg-teal-50'
                        } ${bkashPaymentSuccess ? 'opacity-50' : ''}`}
                      >
                        <svg className="w-8 h-8 text-teal-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-600">Cash on Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition-colors duration-300">
                Back
              </button>
              <button type="submit" className="w-1/2 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded transition-colors duration-300">
                Place Order
              </button>
            </div>
          </div>
        )}
      </form>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-8">
                Thank you for your purchase. Your order has been received and will be processed shortly.
                You will receive an email confirmation with your order details.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGoHome}
                  className="w-full sm:w-auto px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300 font-medium"
                >
                  Return to Home
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
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
  step: PropTypes.number.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  resetCheckout: PropTypes.func.isRequired,
  selectedPayment: PropTypes.string,
  setSelectedPayment: PropTypes.func.isRequired
}

export default CheckoutForm
