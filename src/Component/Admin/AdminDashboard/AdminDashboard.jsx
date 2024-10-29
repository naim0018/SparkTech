/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaBox, FaDollarSign, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../../../ThemeContext';
import { useGetAllProductsQuery } from '../../../redux/api/ProductApi';
import { useGetAllUsersQuery } from '../../../redux/api/UserApi';
import { useGetAllOrdersQuery } from '../../../redux/api/OrderApi';

const AdminDashboard = () => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  const { data: productsData } = useGetAllProductsQuery({ limit: 1000 });
  const { data: usersData } = useGetAllUsersQuery();
  const { data: ordersData } = useGetAllOrdersQuery();

  useEffect(() => {
    if (productsData && usersData && ordersData) {
      const pendingOrders = ordersData?.data?.filter(order => order.status.toLowerCase() === 'pending').length || 0;
      const completedOrders = ordersData?.data?.filter(order => order.status.toLowerCase() === 'completed').length || 0;
      const completedOrdersRevenue = ordersData?.data?.filter(order => order.status.toLowerCase() === 'completed')
        .reduce((acc, order) => acc + order.totalAmount, 0) || 0;

      setStats({
        totalUsers: usersData.totalUsers || 0,
        totalOrders: ordersData.totalOrders || 0,
        totalProducts: productsData.products.length || 0,
        totalRevenue: completedOrdersRevenue,
        pendingOrders,
        completedOrders,
      });

      const productSales = productsData.products.map(product => ({
        ...product,
        totalSales: ordersData.data.reduce((acc, order) => {
          const orderItem = order.items.find(item => item.productId === product._id);
          return acc + (orderItem ? orderItem.quantity : 0);
        }, 0),
        revenue: ordersData.data.reduce((acc, order) => {
          const orderItem = order.items.find(item => item.productId === product._id);
          return acc + (orderItem ? orderItem.price * orderItem.quantity : 0);
        }, 0)
      }));

      const sortedProducts = productSales.sort((a, b) => b.totalSales - a.totalSales);
      setTopSellingProducts(sortedProducts.slice(0, 5));
    }
  }, [productsData, usersData, ordersData]);

  const StatCard = ({ icon, title, value, color }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center ${color}`}>
      <div className="mr-4 text-4xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FaUsers />} title="Total Users" value={stats.totalUsers} color="text-blue-500" />
        <StatCard icon={<FaShoppingCart />} title="Total Orders" value={stats.totalOrders} color="text-green-500" />
        <StatCard icon={<FaBox />} title="Total Products" value={stats.totalProducts} color="text-yellow-500" />
        <StatCard icon={<FaDollarSign />} title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} color="text-purple-500" />
        <StatCard icon={<FaClock />} title="Pending Orders" value={stats.pendingOrders} color="text-orange-500" />
        <StatCard icon={<FaCheckCircle />} title="Completed Orders" value={stats.completedOrders} color="text-teal-500" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Top Selling Products</h2>
        {topSellingProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300">Product</th>
                  <th className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300">Total Sales</th>
                  <th className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.map(product => (
                  <tr key={product._id} className="border-b dark:border-gray-700">
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-300">{product.basicInfo.title}</td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-300">{product.totalSales}</td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-300">${product.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Loading top selling products...</p>
        )}
      </div>
      
    </div>
  );
};

export default AdminDashboard;
