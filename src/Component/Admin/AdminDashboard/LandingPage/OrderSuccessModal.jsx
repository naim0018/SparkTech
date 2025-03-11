import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-toastify';

const OrderSuccessModal = ({ isOpen, onClose, orderDetails }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderDetails.orderId);
    setCopied(true);
    toast.info('অর্ডার আইডি কপি করা হয়েছে!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "bg-blue-50 border border-blue-200",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-auto p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              অর্ডার সফলভাবে সম্পন্ন হয়েছে!
            </h2>
            <p className="text-gray-600 mb-6">
              আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। অনুগ্রহ করে অর্ডার আইডিটি সংরক্ষণ করুন।
            </p>

            {/* Order Details */}
            <div className="bg-green-50 rounded-xl p-6 mb-6">
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">অর্ডার আইডি:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-700">{orderDetails.orderId}</span>
                    <button
                      onClick={handleCopyOrderId}
                      className="p-2 hover:bg-green-100 rounded-full transition-colors"
                      title="Copy Order ID"
                    >
                      {copied ? (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">পণ্যের মূল্য:</span>
                  <span className="font-medium">৳{orderDetails.productPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ডেলিভারি চার্জ:</span>
                  <span className="font-medium">৳{orderDetails.deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-green-700 pt-2 border-t border-green-200">
                  <span>মোট মূল্য:</span>
                  <span>৳{orderDetails.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCopyOrderId}
              className="w-full py-3 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors"
            >
              অর্ডার আইডি কপি করুন
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderDetails: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    productPrice: PropTypes.number.isRequired,
    deliveryCharge: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired
  }).isRequired
};

export default OrderSuccessModal; 