/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCreateOrderMutation } from '../../redux/api/OrderApi'
import { clearCart } from '../../redux/features/CartSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import OrderSuccessModal from '../Admin/AdminDashboard/LandingPage/OrderSuccessModal'
import PropTypes from 'prop-types'

const CheckoutForm = ({ onOrderSuccess }) => {
  const dispatch = useDispatch()
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const cartItems = useSelector((state) => state.cart?.cartItems)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successOrderDetails, setSuccessOrderDetails] = useState(null)
  const [deliveryLocation, setDeliveryLocation] = useState('insideDhaka')
  const navigate = useNavigate()

  const calculateTotalAmount = () => {
    const productTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const deliveryCharge = deliveryLocation === 'insideDhaka' ? 80 : 150
    return productTotal + deliveryCharge
  }

  const handleCancel = () => {
    setShowSuccessModal(false)
    navigate('/')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const formData = {
        name: e.target.name.value,
        phone: e.target.phone.value,
        email: e.target.email.value || 'no-email@example.com',
        address: e.target.address.value,
        notes: e.target.notes.value,
        courierCharge: deliveryLocation
      }

      const orderData = {
        body: {
          items: cartItems.map(item => ({
            product: item.id,
            image: item.image,
            quantity: item.quantity,
            itemKey: item.itemKey,
            price: item.price,
            selectedVariants: Array.isArray(item.selectedVariants) 
              ? item.selectedVariants.reduce((obj, variant) => ({
                  ...obj,
                  [variant.group]: {
                    value: variant.value,
                    price: variant.price || 0
                  }
                }), {})
              : item.selectedVariants || {}
          })),
          totalAmount: calculateTotalAmount(),
          status: "pending",
          billingInformation: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            country: "Bangladesh",
            paymentMethod: "cash on delivery",
            notes: formData.notes || ""
          },
          paymentInfo: {
            paymentMethod: "cash on delivery",
            status: "pending",
            amount: calculateTotalAmount(),
            transactionId: "",
            paymentDate: new Date().toISOString(),
            bkashNumber: ""
          },
          courierCharge: formData.courierCharge,
          cuponCode: ""
        }
      }

      const response = await createOrder(orderData).unwrap()
      
      const orderDetails = {
        orderId: response.data._id,
        productPrice: calculateTotalAmount() - (deliveryLocation === 'insideDhaka' ? 80 : 150),
        deliveryCharge: deliveryLocation === 'insideDhaka' ? 80 : 150,
        totalAmount: calculateTotalAmount()
      }

      onOrderSuccess(orderDetails)
      
      dispatch(clearCart())
      localStorage.setItem('lastOrderId', response.data._id)

    } catch (error) {
      toast.error(
        <div>
          <h3 className="font-bold text-red-800">দুঃখিত! অর্ডার সম্পন্ন করা যায়নি।</h3>
          {error.data?.message && (
            <p className="text-sm text-red-600 mt-1">কারণ: {error.data.message}</p>
          )}
        </div>
      )
      console.error('Order creation failed:', error)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ফোন নাম্বার <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                pattern="01[3-9][0-9]{8}"
                required
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ঠিকানা <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              required
              rows="3"
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ইমেইল <span className="text-gray-500 text-sm">(ঐচ্ছিক)</span>
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0"
            />
          </div>
        </div>

        {/* Delivery Location */}
        <div className="bg-green-50 p-4 rounded-xl">
          <label className="block text-gray-700 font-medium mb-2">
            ডেলিভারি এলাকা <span className="text-red-500">*</span>
          </label>
          <select
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border-2 border-green-200 focus:border-green-500 focus:ring-0 bg-white"
            required
          >
            <option value="insideDhaka">ঢাকার ভিতরে (৳80)</option>
            <option value="outsideDhaka">ঢাকার বাইরে (৳150)</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            অতিরিক্ত তথ্য <span className="text-gray-500 text-sm">(ঐচ্ছিক)</span>
          </label>
          <textarea
            name="notes"
            rows="2"
            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
            }
          `}
        >
          {isLoading ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
        </button>
      </form>

      {/* Success Modal */}
      {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={handleCancel}
          orderDetails={successOrderDetails}
        />
      )}
    </>
  )
}

CheckoutForm.propTypes = {
  onOrderSuccess: PropTypes.func.isRequired
}

export default CheckoutForm
