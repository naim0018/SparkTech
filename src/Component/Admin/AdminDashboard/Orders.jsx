/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useGetAllOrdersQuery, useUpdateOrderMutation, useDeleteOrderMutation } from '../../../redux/api/OrderApi';
import { FiSearch, FiCalendar, FiFilter, FiChevronDown, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Orders = () => {
  const { data: orders, isLoading, isError } = useGetAllOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    if (orders?.data) {
      let result = [...orders.data];
      
      // Apply filters
      if (searchTerm) {
        result = result.filter(order => 
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${order.billingInformation.firstName} ${order.billingInformation.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.billingInformation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.billingInformation.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.billingInformation.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (dateFilter) {
        result = result.filter(order => 
          new Date(order.createdAt).toLocaleDateString() === new Date(dateFilter).toLocaleDateString()
        );
      }
      if (statusFilter) {
        result = result.filter(order => order.status === statusFilter);
      }

      // Apply sorting
      result.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredOrders(result);
    }
  }, [orders, searchTerm, dateFilter, statusFilter, sortField, sortDirection]);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 p-4">Error fetching orders</div>;

  const handleSort = (field) => {
    setSortField(field);
    setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const handleUpdateOrder = async (id, newStatus) => {
    setIsUpdating(true);
    setUpdatingOrderId(id);
    try {
      await updateOrder({ id, status: newStatus }).unwrap();
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(id).unwrap();
        toast.success('Order deleted successfully');
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) 
      ? date.toLocaleString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      : 'Invalid Date';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard');
    }, (err) => {
      toast.error('Failed to copy');
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search orders..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="date"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative">
                <select 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Pending">Pending</option>
                </select>
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Email', 'Phone', 'City', 'Total Amount', 'Status', 'Date', 'Actions'].map((header, index) => (
                    <th 
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort(['_id', 'billingInformation.firstName', 'billingInformation.email', 'billingInformation.phone', 'billingInformation.city', 'totalAmount', 'status', 'createdAt'][index])}
                    >
                      <div className="flex items-center gap-1">
                        {header}
                        {sortField === ['_id', 'billingInformation.firstName', 'billingInformation.email', 'billingInformation.phone', 'billingInformation.city', 'totalAmount', 'status', 'createdAt'][index] && (
                          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 truncate">
                      <div className="flex items-center">
                        <span 
                          className="cursor-pointer" 
                          onClick={() => copyToClipboard(order._id)}
                          title="Click to copy"
                        >
                          {order._id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 truncate">
                      <div className="flex items-center">
                        <span 
                          className="cursor-pointer" 
                          onClick={() => copyToClipboard(`${order.billingInformation.firstName} ${order.billingInformation.lastName}`)}
                          title="Click to copy"
                        >
                          {`${order.billingInformation.firstName} ${order.billingInformation.lastName}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 truncate">
                      <div className="flex items-center">
                        <span 
                          className="cursor-pointer" 
                          onClick={() => copyToClipboard(order.billingInformation.email)}
                          title="Click to copy"
                        >
                          {order.billingInformation.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 truncate">
                      <div className="flex items-center">
                        <span 
                          className="cursor-pointer" 
                          onClick={() => copyToClipboard(order.billingInformation.phone)}
                          title="Click to copy"
                        >
                          {order.billingInformation.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 truncate">
                      <div className="flex items-center">
                        <span 
                          className="cursor-pointer" 
                          onClick={() => copyToClipboard(order.billingInformation.city)}
                          title="Click to copy"
                        >
                          {order.billingInformation.city}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 truncate">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 truncate">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => setSelectedOrder(order)}
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => handleUpdateOrder(order._id, 'Processing')}
                        disabled={isUpdating && updatingOrderId === order._id}
                        title="Update Status"
                      >
                        {isUpdating && updatingOrderId === order._id ? 'Updating...' : <FiEdit />}
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteOrder(order._id)}
                        title="Delete Order"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Details</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Order ID: {selectedOrder._id}
                </p>
                <p className="text-sm text-gray-500">
                  Customer: {`${selectedOrder.billingInformation.firstName} ${selectedOrder.billingInformation.lastName}`}
                </p>
                <p className="text-sm text-gray-500">
                  Email: {selectedOrder.billingInformation.email}
                </p>
                <p className="text-sm text-gray-500">
                  Phone: {selectedOrder.billingInformation.phone}
                </p>
                <p className="text-sm text-gray-500">
                  City: {selectedOrder.billingInformation.city}
                </p>
                <p className="text-sm text-gray-500">
                  Total Amount: ${selectedOrder.totalAmount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {selectedOrder.status}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
