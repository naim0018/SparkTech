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
          content={`Order details for ${order.billingInformation.firstName} ${order.billingInformation.lastName} - Order status: ${order.status}`} 
        />
      </Helmet>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Order Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Information */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-600 text-sm">Order ID</p>
                <p className="font-medium">{order._id}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className={`font-medium ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="font-medium">৳{order.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Name</p>
                  <p className="font-medium">
                    {`${order.billingInformation.firstName} ${order.billingInformation.lastName}`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-medium">{order.billingInformation.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="font-medium">{order.billingInformation.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Address</p>
                  <p className="font-medium">{order.billingInformation.streetAddress}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 border-b pb-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.selectedVariants && item.selectedVariants.length > 0 && (
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">Variants:</p>
                          <div className="flex flex-wrap gap-2">
                            {item.selectedVariants.map((variant, vIndex) => (
                              <span 
                                key={vIndex}
                                className="text-xs bg-gray-100 px-2 py-1 rounded"
                              >
                                {variant.group}: {variant.value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">৳{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            {order.paymentInfo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Payment Method</p>
                    <p className="font-medium capitalize">{order.paymentInfo.paymentMethod}</p>
                  </div>
                  {order.paymentInfo.transactionId && (
                    <div>
                      <p className="text-gray-600 text-sm">Transaction ID</p>
                      <p className="font-medium">{order.paymentInfo.transactionId}</p>
                    </div>
                  )}
                  {order.paymentInfo.bkashNumber && (
                    <div>
                      <p className="text-gray-600 text-sm">bKash Number</p>
                      <p className="font-medium">{order.paymentInfo.bkashNumber}</p>
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

const getStatusColor = (status) => {
  const colors = {
    pending: 'text-yellow-600',
    processing: 'text-blue-600',
    shipped: 'text-indigo-600',
    delivered: 'text-green-600',
    cancelled: 'text-red-600'
  };
  return colors[status.toLowerCase()] || 'text-gray-600';
};

OrderDetails.propTypes = {
  order: PropTypes.object,
  onClose: PropTypes.func.isRequired
};

export default OrderDetails; 