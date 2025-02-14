import { FiSearch, FiCalendar } from 'react-icons/fi';
import PropTypes from 'prop-types';

const OrderFilters = ({ 
  searchTerm, 
  dateFilter, 
  statusFilter, 
  setSearchTerm, 
  setDateFilter, 
  setStatusFilter,
  orderStatuses 
}) => {
  return (
    <div className="flex gap-4 mb-8">
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search orders..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        {orderStatuses.map(status => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
};

OrderFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  dateFilter: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  setDateFilter: PropTypes.func.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  orderStatuses: PropTypes.array.isRequired
};

export default OrderFilters; 