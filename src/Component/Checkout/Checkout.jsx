/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useCreateOrderMutation } from '../../redux/api/OrderApi'
import { clearCart } from '../../redux/features/CartSlice'
import { useCreateBkashPaymentMutation } from '../../redux/api/bkashApi'
import { useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'

function CheckoutForm({ step, nextStep, prevStep, resetCheckout }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const dispatch = useDispatch()
  const [createOrder] = useCreateOrderMutation()
  const cartItems = useSelector((state) => state.cart.cartItems)
  const cartTotal = useSelector((state) => state.cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0))
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const shippingCost = 0
  const taxRate = 0
  const location = useLocation()
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const message = searchParams.get('message')
    const trxID = searchParams.get('trxID')
    const amount = searchParams.get('amount')

    if (message === 'Successful') {
      Swal.fire({
        title: 'Payment Successful!',
        text: `Transaction ID: ${trxID}\nAmount Paid: ${amount} BDT`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
    }
  }, [location])

  const onSubmit = async (data) => {
    if (step < 4) {
      nextStep()
    } else {
      try {
        const orderData = {
          items: cartItems.map((item) => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: cartTotal + shippingCost + (cartTotal * taxRate),
          status: 'Pending',
          billingInformation: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            streetAddress: data.streetAddress,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country,
            paymentMethod: data.paymentMethod,
            cardNumber: data.cardNumber,
            expMonth: data.expMonth,
            expYear: data.expYear,
            cvv: data.cvv,
            notes: data.notes
          }
        }  
        const result = await createOrder(orderData).unwrap()
        console.log("result", result)
        console.log("orderData", orderData)
        console.log('Order created:', result)
        dispatch(clearCart())
        setShowSuccessModal(true)
      } catch (error) {
        console.error('Failed to create order:', error)
        if (error.status === 400) {
          console.error('Bad Request:', error.data)
          if (error.data && error.data.errorSources) {
            error.data.errorSources.forEach(errorSource => {
              console.error(`${errorSource.path}: ${errorSource.message}`)
            })
          }
        } else {
          console.error('An unexpected error occurred:', error.message)
        }
      }
    }
  }

  const handleGoHome = () => {
    setShowSuccessModal(false)
    resetCheckout()
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
                {errors.firstName && <span className="text-red-500">This field is required</span>}
              </div>
              <div>
                <label htmlFor="lastName" className="text-gray-700">Last Name</label>
                <input id="lastName" placeholder="Doe" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('lastName', { required: true })} />
                {errors.lastName && <span className="text-red-500">This field is required</span>}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="text-gray-700">Email</label>
              <input id="email" type="email" placeholder="john@example.com" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
              {errors.email && <span className="text-red-500">Please enter a valid email</span>}
            </div>
            <div>
              <label htmlFor="phone" className="text-gray-700">Phone Number</label>
              <input id="phone" type="tel" placeholder="+1 (555) 123-4567" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('phone', { required: true })} />
              {errors.phone && <span className="text-red-500">This field is required</span>}
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
              <input id="streetAddress" placeholder="123 Main St" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('streetAddress', { required: true })} />
              {errors.streetAddress && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="text-gray-700">City</label>
                <input id="city" placeholder="New York" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('city', { required: true })} />
                {errors.city && <span className="text-red-500">This field is required</span>}
              </div>
              <div>
                <label htmlFor="state" className="text-gray-700">State</label>
                <select id="state" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('state', { required: true })}>
                  <option value="ny">New York</option>
                  <option value="ca">California</option>
                  <option value="tx">Texas</option>
                </select>
                {errors.state && <span className="text-red-500">This field is required</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="zipCode" className="text-gray-700">ZIP Code</label>
                <input id="zipCode" placeholder="12345" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('zipCode', { required: true })} />
                {errors.zipCode && <span className="text-red-500">This field is required</span>}
              </div>
              <div>
                <label htmlFor="country" className="text-gray-700">Country</label>
                <select id="country" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('country', { required: true })}>
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="uk">United Kingdom</option>
                </select>
                {errors.country && <span className="text-red-500">This field is required</span>}
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
            <label className="text-gray-700">Payment Method</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                <input type="radio" name="paymentMethod" value="card" id="card" className="h-4 w-4 text-teal-600 border-gray-300" {...register('paymentMethod', { required: true })} />
                <label htmlFor="card" className="flex items-center cursor-pointer">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"></path></svg>
                  Credit Card
                </label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                <input type="radio" name="paymentMethod" value="paypal" id="paypal" className="h-4 w-4 text-teal-600 border-gray-300" {...register('paymentMethod', { required: true })} />
                <label htmlFor="paypal" className="flex items-center cursor-pointer">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"></path></svg>
                  PayPal
                </label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                <input type="radio" name="paymentMethod" value="cod" id="cod" className="h-4 w-4 text-teal-600 border-gray-300" {...register('paymentMethod', { required: true })} />
                <label htmlFor="cod" className="flex items-center cursor-pointer">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"></path></svg>
                  Cash on Delivery
                </label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                <input type="radio" name="paymentMethod" value="bkash" id="bkash" className="h-4 w-4 text-teal-600 border-gray-300" {...register('paymentMethod', { required: true })} />
                <label htmlFor="bkash" className="flex items-center cursor-pointer">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"></path></svg>
                  bKash
                </label>
              </div>
              {errors.paymentMethod && <span className="text-red-500">Please select a payment method</span>}
            </div>
            {watch('paymentMethod') === 'card' && (
              <>
                <div>
                  <label htmlFor="cardNumber" className="text-gray-700">Card Number</label>
                  <input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('cardNumber', { required: true })} />
                  {errors.cardNumber && <span className="text-red-500">This field is required</span>}
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="expMonth" className="text-gray-700">Exp. Month</label>
                    <select id="expMonth" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('expMonth', { required: true })}>
                      {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {errors.expMonth && <span className="text-red-500">This field is required</span>}
                  </div>
                  <div>
                    <label htmlFor="expYear" className="text-gray-700">Exp. Year</label>
                    <select id="expYear" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('expYear', { required: true })}>
                      {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.expYear && <span className="text-red-500">This field is required</span>}
                  </div>
                  <div>
                    <label htmlFor="cvv" className="text-gray-700">CVV</label>
                    <input id="cvv" placeholder="123" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('cvv', { required: true })} />
                    {errors.cvv && <span className="text-red-500">This field is required</span>}
                  </div>
                </div>
              </>
            )}
            {watch('paymentMethod') === 'bkash' && (
              <div>
                <label htmlFor="bkashNumber" className="text-gray-700">bKash Number</label>
                <input id="bkashNumber" placeholder="01XXXXXXXXX" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('bkashNumber', { required: true })} />
                {errors.bkashNumber && <span className="text-red-500">This field is required</span>}
              </div>
            )}
            <div>
              <label htmlFor="notes" className="text-gray-700">Order Notes (Optional)</label>
              <textarea id="notes" placeholder="Any special instructions for your order?" className="mt-1 p-2 border border-gray-300 rounded w-full" {...register('notes')}></textarea>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="h-4 w-4 text-teal-600 border-gray-300 rounded" {...register('terms', { required: true })} />
              <label htmlFor="terms" className="text-sm text-gray-700">I agree to the terms and conditions</label>
            </div>
            {errors.terms && <span className="text-red-500">You must agree to the terms and conditions</span>}
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

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Payment Method</h4>
              <p className="capitalize">{watch('paymentMethod') === 'cod' ? 'Cash on Delivery' : watch('paymentMethod')}</p>
              {watch('paymentMethod') === 'bkash' && <p>bKash Number: {watch('bkashNumber')}</p>}
              {watch('paymentMethod') === 'card' && <p>Card ending in: {watch('cardNumber')?.slice(-4)}</p>}
            </div>

            {watch('notes') && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Order Notes</h4>
                <p>{watch('notes')}</p>
              </div>
            )}

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
            <p className="mb-6">Thank you for your purchase.</p>
            <div className="flex space-x-4">
              <button onClick={handleGoHome} className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded transition-colors duration-300">
                Go Back to Home
              </button>
              <button onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded transition-colors duration-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function OrderSummary() {
  const cartItems = useSelector((state) => state.cart.cartItems)
  const cartTotal = useSelector((state) => state.cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0))
  const [createBkashPayment] = useCreateBkashPaymentMutation()
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()
  console.log("user", user)
  const shippingCost = 0
  const taxRate = 0

  const searchParams = new URLSearchParams(location.search)
  const message = searchParams.get('message')

  const handleBkashPayment = async () => {
  
    try {
      const response = await createBkashPayment({
        amount: cartTotal,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "Inv" + Math.random().toString(36).substring(2, 7),
        userEmail: user?.email
      }).unwrap()

      if (response.bkashURL) {
        window.location.href = response.bkashURL
      }
    } catch (error) {
      console.error('Bkash payment error:', error)
    }
  }

  return (
    <div className="md:w-1/3 bg-gray-50 p-8">
      <h2 className="text-2xl font-light mb-6 text-gray-800">Order Summary</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-gray-600">
            <div className="flex items-center">
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover mr-4" />
              <span>{item.name}</span>
            </div>
            <span>${item.price.toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>
        {/* <div className="flex justify-between text-gray-600">   
          <span>Tax</span>
          <span>${(cartTotal * taxRate).toFixed(2)}</span>
        </div> */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-semibold text-lg text-gray-800">
            <span>Total</span>
            <span>${(cartTotal + shippingCost + (cartTotal * taxRate)).toFixed(2)}</span>
          </div>
        </div>
        {/* <div className="mt-6">
          <input placeholder="Enter promo code" className="bg-white border-gray-300 p-2 rounded w-full" />
          <button className="w-full mt-2 bg-gray-800 text-white p-2 rounded hover:bg-gray-900 transition-colors duration-300">
            Apply Promo Code
          </button>
        </div> */}
        <div className="mt-6">
          {message === 'Successful' ? (
            <button disabled className="w-full mt-2 bg-green-500 text-white p-2 rounded">
              Payment Complete
            </button>
          ) : (
            <button onClick={handleBkashPayment} className="w-full mt-2 bg-gray-800 text-white p-2 rounded hover:bg-gray-900 transition-colors duration-300">
              Pay with bKash
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Component() {
  const [step, setStep] = useState(1)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)
  const resetCheckout = () => setStep(1)

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
                  <span className="text-sm">{i === 1 ? 'Details' : i === 2 ? 'Shipping' : i === 3 ? 'Payment' : 'Review'}</span>
                </div>
              ))}
            </div>
            <CheckoutForm step={step} nextStep={nextStep} prevStep={prevStep} resetCheckout={resetCheckout} />
          </div>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
