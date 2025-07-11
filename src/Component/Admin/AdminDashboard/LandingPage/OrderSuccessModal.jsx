import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const OrderSuccessModal = ({ isOpen, onClose, orderDetails }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#FFC107', '#2196F3']
      });
    }
  }, [isOpen]);

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

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl max-w-2xl w-full mx-auto p-10 border border-green-100">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              অর্ডার সফলভাবে সম্পন্ন হয়েছে!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। অনুগ্রহ করে অর্ডার আইডিটি সংরক্ষণ করুন।
            </p>

            {/* Order Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 mb-8 shadow-inner border border-green-100">
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
              className="w-full py-4 text-lg bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              অর্ডার আইডি কপি করুন
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 text-lg bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 border border-gray-200 transform hover:scale-[1.02] shadow-md"
            >
              ঠিক আছে
            </button>
            <button
              onClick={handleGoHome}
              className="w-full py-4 text-lg bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-all duration-300 border border-blue-200 transform hover:scale-[1.02] shadow-md"
            >
              হোম পেজে যান
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