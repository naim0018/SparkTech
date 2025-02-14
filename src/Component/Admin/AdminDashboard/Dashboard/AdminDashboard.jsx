/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useTheme } from '../../../../ThemeContext';
import { useGetAllProductsQuery } from '../../../../redux/api/ProductApi';
import { useGetAllUsersQuery } from '../../../../redux/api/UserApi';
import { useGetAllOrdersQuery } from '../../../../redux/api/OrderApi';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  FaUsers, FaShoppingCart, FaBox, FaDollarSign, 
  FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { isDarkMode } = useTheme();
  const { data: productsData } = useGetAllProductsQuery({ limit: 1000 });
  const { data: usersData } = useGetAllUsersQuery();
  const { data: ordersData } = useGetAllOrdersQuery();

  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    if (ordersData?.data) {
      const pending = ordersData.data.filter(order => order.status === 'pending').length;
      const completed = ordersData.data.filter(order => order.status === 'completed').length;
      const revenue = ordersData.data.reduce((acc, order) => acc + order.totalAmount, 0);
      const avgOrder = revenue / ordersData.data.length || 0;

      setOrderStats({
        totalOrders: ordersData.data.length,
        pendingOrders: pending,
        completedOrders: completed,
        totalRevenue: revenue,
        averageOrderValue: avgOrder
      });

      const recent = [...ordersData.data]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentOrders(recent);
    }
  }, [ordersData]);

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-transform transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {change && (
        <div className="mt-2 flex items-center">
          {change > 0 ? (
            <FaArrowUp className="w-4 h-4 text-green-500" />
          ) : (
            <FaArrowDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`ml-1 text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Math.abs(change)}%
          </span>
          <span className="ml-2 text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Dashboard Overview
        </h1>
        <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Welcome back! Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FaDollarSign}
          title="Total Revenue"
          value={`$${orderStats.totalRevenue.toLocaleString()}`}
          change={12.5}
          color="bg-blue-500"
        />
        <StatCard
          icon={FaShoppingCart}
          title="Total Orders"
          value={orderStats.totalOrders}
          change={8.2}
          color="bg-green-500"
        />
        <StatCard
          icon={FaUsers}
          title="Total Users"
          value={usersData?.totalUsers || 0}
          change={-2.4}
          color="bg-purple-500"
        />
        <StatCard
          icon={FaBox}
          title="Total Products"
          value={productsData?.products?.length || 0}
          change={5.7}
          color="bg-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-transform transform hover:scale-105`}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Revenue Overview
          </h2>
          <div className="h-80">
            <Line
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  label: 'Revenue',
                  data: [3000, 4500, 3800, 5200, 4800, 6000],
                  borderColor: '#3B82F6',
                  tension: 0.4
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                  },
                  x: {
                    grid: {
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Order Status Chart */}
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-transform transform hover:scale-105`}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Order Status
          </h2>
          <div className="h-80 flex items-center justify-center">
            <Doughnut
              data={{
                labels: ['Completed', 'Pending', 'Cancelled'],
                datasets: [{
                  data: [
                    orderStats.completedOrders,
                    orderStats.pendingOrders,
                    0
                  ],
                  backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-transform transform hover:scale-105`}>
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-3">{order._id.slice(-6)}</td>
                    <td className="py-3">{order.customerName}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3">${order.totalAmount}</td>
                    <td className="py-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
