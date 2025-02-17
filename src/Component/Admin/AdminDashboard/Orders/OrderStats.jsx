import PropTypes from 'prop-types';

const OrderStats = ({ orders, orderStatuses }) => {
  const getStatusColors = (status) => {
    const colors = {
      'pending': ['bg-amber-100', 'text-amber-800', 'bg-amber-200'],
      'processing': ['bg-sky-100', 'text-sky-800', 'bg-sky-200'],
      'shipped': ['bg-indigo-100', 'text-indigo-800', 'bg-indigo-200'],
      'delivered': ['bg-emerald-100', 'text-emerald-800', 'bg-emerald-200'],
      'cancelled': ['bg-rose-100', 'text-rose-800', 'bg-rose-200']
    };
    return colors[status] || ['bg-gray-100', 'text-gray-800', 'bg-gray-200'];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col">
          <h3 className="text-gray-800 font-medium text-sm uppercase tracking-wider">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{orders?.length || 0}</p>
          <div className="mt-3 h-1 w-full bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {orderStatuses.map(status => {
        const [bgColor, textColor, progressColor] = getStatusColors(status.value);
        return (
          <div 
            key={status.value} 
            className={`${bgColor} p-4 rounded-lg shadow-sm border border-gray-200`}
          >
            <div className="flex flex-col">
              <h3 className={`${textColor} font-medium text-sm uppercase tracking-wider`}>
                {status.label}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {orders?.filter(order => order.status.toLowerCase() === status.value).length || 0}
              </p>
              <div className={`mt-3 h-1 w-full ${progressColor} rounded-full`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

OrderStats.propTypes = {
  orders: PropTypes.array.isRequired,
  orderStatuses: PropTypes.array.isRequired
};

export default OrderStats;