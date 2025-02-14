/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useCreateOrderMutation } from '../../redux/api/OrderApi'
import { clearCart } from '../../redux/features/CartSlice'
import { useCreateBkashPaymentMutation } from '../../redux/api/BkashApi'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

function CheckoutForm({ resetCheckout, selectedPayment, setSelectedPayment, setPaymentStatus }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const dispatch = useDispatch()
  const [createOrder] = useCreateOrderMutation()
  const cartItems = useSelector((state) => state.cart?.cartItems)
  
  const cartTotal = cartItems?.reduce((total, item) => total + item.price * item.quantity, 0) || 0
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const shippingCost = 0
  const taxRate = 0
  const location = useLocation()
  const [createBkashPayment] = useCreateBkashPaymentMutation()
  const user = useSelector((state) => state.auth?.user)
  const navigate = useNavigate()
  const [bkashPaymentSuccess, setBkashPaymentSuccess] = useState(false)

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
      toast.error('Failed to initiate bKash payment')
    }
  }

  const handleCodPayment = () => {
    if (bkashPaymentSuccess) return
    setSelectedPayment('cod')
    setPaymentStatus('cod')
  }

  const onSubmit = async (formData) => {
    if (!selectedPayment) {
      toast.error('Please select a payment method')
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
        items: cartItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          itemKey: item.itemKey,
          selectedVariants: item.selectedVariants?.reduce((acc, variant) => {
            acc[variant.group] = {
              value: variant.value,
              price: variant.price,
            }
            return acc
          }, {})
        })),
        totalAmount: cartTotal + shippingCost + (cartTotal * taxRate),
        status: 'pending',
        billingInformation: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          streetAddress: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country || 'Bangladesh',
          paymentMethod: selectedPayment,
          notes: formData.notes
        },
        paymentInfo: {
          paymentMethod: selectedPayment === 'bkash' ? 'bkash' : 'cash on delivery',
          status: 'pending',
          amount: cartTotal + shippingCost + (cartTotal * taxRate),
          ...(selectedPayment === 'bkash' && {
            bkashNumber: formData.bkashNumber,
            transactionId: formData.transactionId
          })
        }
      }
      const response = await createOrder(orderData).unwrap()
      if (response.success) {
        dispatch(clearCart())
        localStorage.removeItem('checkoutFormData')
        Swal.close()
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('Order creation error:', error)
      
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Billing Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              {...register('firstName', { required: 'First name is required' })}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.firstName && (
              <span className="text-red-500 text-xs">{errors.firstName.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.lastName && (
              <span className="text-red-500 text-xs">{errors.lastName.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9+\-\s()]*$/,
                  message: 'Invalid phone number'
                }
              })}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.phone && (
              <span className="text-red-500 text-xs">{errors.phone.message}</span>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input
              {...register('address', { required: 'Address is required' })}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.address && (
              <span className="text-red-500 text-xs">{errors.address.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                {...register('city', { required: 'City is required' })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.city && (
                <span className="text-red-500 text-xs">{errors.city.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <input
                {...register('zipCode', { required: 'ZIP code is required' })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.zipCode && (
                <span className="text-red-500 text-xs">{errors.zipCode.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                {...register('country')}
                defaultValue="Bangladesh"
                className="w-full px-3 py-2 border rounded bg-gray-100"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Order Notes */}
        <div>
          <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
          <textarea 
            {...register('notes')}
            rows="2"
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleBkashPayment}
              className={`p-3 rounded border ${
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
              className={`p-3 rounded border ${
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

        {/* Terms & Submit */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                {...register('terms', { required: true })}
                className="mr-2"
              />
              I agree to the terms and conditions
            </label>
            {errors.terms && (
              <span className="text-red-500 text-xs">You must agree to the terms</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700"
          >
            Place Order
          </button>
        </div>
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
