import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetAllOrdersQuery, useUpdateOrderMutation, useDeleteOrderMutation } from '../../../../redux/api/OrderApi';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import OrderList from './OrderList';
import OrderStats from './OrderStats';
import OrderFilters from './OrderFilters';
import OrderDetails from './OrderDetails';

const orderStatuses = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'processing', label: 'Processing', color: 'blue' },
  { value: 'shipped', label: 'Shipped', color: 'indigo' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' }
];

const Orders = () => {
  // API Queries & Mutations
  const { data: orders, isLoading } = useGetAllOrdersQuery();
  console.log(orders)
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  // State Management
  const [viewMode, setViewMode] = useState('table');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Filter orders based on search, date and status
  useEffect(() => {
    if (orders?.data) {
      let filtered = [...orders.data];

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(order => 
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${order.billingInformation.firstName} ${order.billingInformation.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.billingInformation.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply date filter
      if (dateFilter) {
        filtered = filtered.filter(order => 
          new Date(order.createdAt).toLocaleDateString() === new Date(dateFilter).toLocaleDateString()
        );
      }

      // Apply status filter
      if (statusFilter) {
        filtered = filtered.filter(order => 
          order.status.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      setFilteredOrders(filtered);
    }
  }, [orders, searchTerm, dateFilter, statusFilter]);

  // Handlers
  const handleUpdateOrder = async (orderId, newStatus) => {
    try {
      await updateOrder({ id: orderId, status: newStatus }).unwrap();
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId).unwrap();
        toast.success('Order deleted successfully');
      } catch (error) {
        toast.error('Failed to delete order', error);
      }
    }
  };

  const handleExportCSV = () => {
    if (!filteredOrders.length) {
      toast.warning('No orders to export');
      return;
    }

    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Date', 'Status', 'Total'],
      ...filteredOrders.map(order => [
        order._id,
        `${order.billingInformation.firstName} ${order.billingInformation.lastName}`,
        order.billingInformation.email,
        new Date(order.createdAt).toLocaleDateString(),
        order.status,
        order.totalAmount.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toLocaleDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Orders Management | Admin Dashboard</title>
        <meta name="description" content="Manage all customer orders, track order status, and handle order processing efficiently." />
        <meta name="keywords" content="orders, order management, admin dashboard, ecommerce" />
      </Helmet>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <div className="flex gap-4">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FiDownload /> Export CSV
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Grid View
              </button>
            </div>
          </div>
        </div>

        <OrderStats orders={orders?.data} orderStatuses={orderStatuses} />
        
        <OrderFilters 
          searchTerm={searchTerm}
          dateFilter={dateFilter}
          statusFilter={statusFilter}
          setSearchTerm={setSearchTerm}
          setDateFilter={setDateFilter}
          setStatusFilter={setStatusFilter}
          orderStatuses={orderStatuses}
        />

        <OrderList 
          orders={filteredOrders}
          viewMode={viewMode}
          handleUpdateOrder={handleUpdateOrder}
          handleDeleteOrder={handleDeleteOrder}
          setSelectedOrder={setSelectedOrder}
          orderStatuses={orderStatuses}
        />

        {selectedOrder && (
          <OrderDetails 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </div>
    </>
  );
};

export default Orders; 