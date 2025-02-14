import PropTypes from 'prop-types';

const OrderStats = ({ orders, orderStatuses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-blue-800 font-semibold">Total Orders</h3>
        <p className="text-2xl font-bold">{orders?.length || 0}</p>
      </div>
      {orderStatuses.map(status => (
        <div key={status.value} className={`bg-${status.color}-50 p-4 rounded-lg`}>
          <h3 className={`text-${status.color}-800 font-semibold`}>{status.label}</h3>
          <p className="text-2xl font-bold">
            {orders?.filter(order => order.status.toLowerCase() === status.value).length || 0}
          </p>
        </div>
      ))}
    </div>
  );
};

OrderStats.propTypes = {
  orders: PropTypes.array.isRequired,
  orderStatuses: PropTypes.array.isRequired
};

export default OrderStats; 