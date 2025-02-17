import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const OrderDetails = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <>
      <Helmet>
        <title>Order #{order._id} Details | Admin Dashboard</title>
        <meta 
          name="description" 
          content={`Order details for ${order.billingInformation.name} - Order status: ${order.status}`} 
        />
      </Helmet>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Order #{order._id.slice(-6)}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="space-y-8">
            {/* Order Status Banner */}
            <div className={`${getStatusBgColor(order.status)} p-4 rounded-lg`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Order Status</p>
                  <p className="text-lg font-bold capitalize">{order.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Order Date</p>
                  <p className="text-lg font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white shadow-sm rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium text-lg">{order.billingInformation.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium text-lg">{order.billingInformation.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium text-lg">{order.billingInformation.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Shipping Address</p>
                  <p className="font-medium text-lg">{order.billingInformation.address}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white shadow-sm rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-4">Order Items</h3>
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex gap-6">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{item.name}</h4>
                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">৳{(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-gray-600 text-sm">৳{item.price.toFixed(2)} per unit</p>
                          </div>
                        </div>
                        
                        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                          <div className="mt-3">
                            <p className="text-gray-600 mb-2">Selected Options:</p>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(item.selectedVariants).map(([key, variant]) => (
                                <span 
                                  key={key}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700"
                                >
                                  {key}: {variant.value} (+৳{variant.price})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>৳{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {order.paymentInfo && (
              <div className="bg-white shadow-sm rounded-lg p-6 border">
                <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium text-lg capitalize">{order.paymentInfo.paymentMethod}</p>
                  </div>
                  {order.paymentInfo.transactionId && (
                    <div>
                      <p className="text-gray-600">Transaction ID</p>
                      <p className="font-medium text-lg">{order.paymentInfo.transactionId}</p>
                    </div>
                  )}
                  {order.paymentInfo.bkashNumber && (
                    <div>
                      <p className="text-gray-600">bKash Number</p>
                      <p className="font-medium text-lg">{order.paymentInfo.bkashNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const getStatusBgColor = (status) => {
  const colors = {
    pending: 'bg-yellow-50',
    processing: 'bg-blue-50',
    shipped: 'bg-indigo-50',
    delivered: 'bg-green-50',
    cancelled: 'bg-red-50'
  };
  return colors[status.toLowerCase()] || 'bg-gray-50';
};


OrderDetails.propTypes = {
  order: PropTypes.object,
  onClose: PropTypes.func.isRequired
};

export default OrderDetails;