import { useState } from 'react'
import { useSelector } from 'react-redux'


export default function Component() {
  const [step, setStep] = useState(1)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const cartTotal = useSelector((state) => state.cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0))

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-6xl">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-light mb-6 text-gray-800">Checkout</h1>
            <div className="mb-8 flex justify-between">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex items-center ${i < step ? 'text-teal-600' : i === step ? 'text-teal-500' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${i < step ? 'border-teal-600 bg-teal-600 text-white' : i === step ? 'border-teal-500 text-teal-500' : 'border-gray-400'}`}>
                    {i < step ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> : i}
                  </div>
                  <span className="text-sm">{i === 1 ? 'Details' : i === 2 ? 'Shipping' : 'Payment'}</span>
                </div>
              ))}
            </div>
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="text-gray-700">First Name</label>
                    <input id="firstName" placeholder="John" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-gray-700">Last Name</label>
                    <input id="lastName" placeholder="Doe" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-gray-700">Email</label>
                  <input id="email" type="email" placeholder="john@example.com" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div>
                  <label htmlFor="phone" className="text-gray-700">Phone Number</label>
                  <input id="phone" type="tel" placeholder="+1 (555) 123-4567" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <button onClick={nextStep} className="w-full bg-teal-500 hover:bg-teal-600 text-white p-2 rounded transition-colors duration-300">
                  Continue to Shipping
                </button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="address" className="text-gray-700">Street Address</label>
                  <input id="address" placeholder="123 Main St" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="text-gray-700">City</label>
                    <input id="city" placeholder="New York" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                  </div>
                  <div>
                    <label htmlFor="state" className="text-gray-700">State</label>
                    <select id="state" className="mt-1 p-2 border border-gray-300 rounded w-full">
                      <option value="ny">New York</option>
                      <option value="ca">California</option>
                      <option value="tx">Texas</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="zip" className="text-gray-700">ZIP Code</label>
                    <input id="zip" placeholder="12345" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                  </div>
                  <div>
                    <label htmlFor="country" className="text-gray-700">Country</label>
                    <select id="country" className="mt-1 p-2 border border-gray-300 rounded w-full">
                      <option value="us">United States</option>
                      <option value="ca">Canada</option>
                      <option value="uk">United Kingdom</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sameAsBilling" className="h-4 w-4 text-teal-600 border-gray-300 rounded" />
                  <label htmlFor="sameAsBilling" className="text-sm text-gray-700">Billing address same as shipping</label>
                </div>
                <div className="flex space-x-4">
                  <button onClick={prevStep} className="w-1/2 bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition-colors duration-300">
                    Back
                  </button>
                  <button onClick={nextStep} className="w-1/2 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded transition-colors duration-300">
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
                    <input type="radio" name="paymentMethod" value="card" id="card" className="h-4 w-4 text-teal-600 border-gray-300" />
                    <label htmlFor="card" className="flex items-center cursor-pointer">
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"></path></svg>
                      Credit Card
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                    <input type="radio" name="paymentMethod" value="paypal" id="paypal" className="h-4 w-4 text-teal-600 border-gray-300" />
                    <label htmlFor="paypal" className="flex items-center cursor-pointer">
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"></path></svg>
                      PayPal
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="cardNumber" className="text-gray-700">Card Number</label>
                  <input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="expMonth" className="text-gray-700">Exp. Month</label>
                    <select id="expMonth" className="mt-1 p-2 border border-gray-300 rounded w-full">
                      {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="expYear" className="text-gray-700">Exp. Year</label>
                    <select id="expYear" className="mt-1 p-2 border border-gray-300 rounded w-full">
                      {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cvv" className="text-gray-700">CVV</label>
                    <input id="cvv" placeholder="123" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="text-gray-700">Order Notes (Optional)</label>
                  <textarea id="notes" placeholder="Any special instructions for your order?" className="mt-1 p-2 border border-gray-300 rounded w-full"></textarea>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="terms" className="h-4 w-4 text-teal-600 border-gray-300 rounded" />
                  <label htmlFor="terms" className="text-sm text-gray-700">I agree to the terms and conditions</label>
                </div>
                <div className="flex space-x-4">
                  <button onClick={prevStep} className="w-1/2 bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition-colors duration-300">
                    Back
                  </button>
                  <button className="w-1/2 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded transition-colors duration-300">
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
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
                <span>$5.00</span>
              </div>
              <div className="flex justify-between text-gray-600">   
                <span>Tax</span>
                <span>$9.50</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-semibold text-lg text-gray-800">
                  <span>Total</span>
                  <span>${(cartTotal + 5 + 9.50).toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6">
                <input placeholder="Enter promo code" className="bg-white border-gray-300 p-2 rounded w-full" />
                <button className="w-full mt-2 bg-gray-800 text-white p-2 rounded hover:bg-gray-900 transition-colors duration-300">
                  Apply Promo Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
