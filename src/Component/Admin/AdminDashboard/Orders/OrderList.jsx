import { FiEye, FiTrash2 } from 'react-icons/fi';
import PropTypes from 'prop-types';

const OrderList = ({ orders, viewMode, handleUpdateOrder, handleDeleteOrder, setSelectedOrder, orderStatuses }) => {
  if (viewMode === 'table') {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={order.items[0].image} 
                      alt={order.items[0].name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{order.items[0].name}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length > 1 ? `+${order.items.length - 1} more items` : ''}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">
                      {`${order.billingInformation.name}`}
                    </p>
                    <p className="text-sm text-gray-500">{order.billingInformation.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrder(order._id, e.target.value)}
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(order.status)}`}
                  >
                    {orderStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ৳{order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Grid View
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src={order.items[0].image}
                alt={order.items[0].name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{order.items[0].name}</p>
                <p className="text-sm text-gray-500">
                  {order.items.length > 1 ? `+${order.items.length - 1} more items` : ''}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedOrder(order)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FiEye className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteOrder(order._id)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">
              Customer: {`${order.billingInformation.name}`}
            </p>
            <p className="text-gray-600">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              Total: ৳{order.totalAmount.toFixed(2)}
            </p>
            <select
              value={order.status}
              onChange={(e) => handleUpdateOrder(order._id, e.target.value)}
              className={`w-full rounded-lg px-3 py-2 ${getStatusStyle(order.status)}`}
            >
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

const getStatusStyle = (status) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return styles[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  viewMode: PropTypes.string.isRequired,
  handleUpdateOrder: PropTypes.func.isRequired,
  handleDeleteOrder: PropTypes.func.isRequired,
  setSelectedOrder: PropTypes.func.isRequired,
  orderStatuses: PropTypes.array.isRequired
};

export default OrderList; 