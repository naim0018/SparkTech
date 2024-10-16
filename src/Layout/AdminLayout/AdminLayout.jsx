/* eslint-disable no-unused-vars */
// Import necessary dependencies and components
import { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { FiMenu, FiX, FiHome, FiUser, FiLogOut } from 'react-icons/fi'
import { navbarGenerator } from '../../utils/navbarGenerator'
import { adminRoute } from '../../Router/AdminRoute'

// AdminLayout component for the admin dashboard
const AdminLayout = () => {
  // State for sidebar visibility and screen size
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  // Generate sidebar items from admin routes
  const sidebarItems = navbarGenerator(adminRoute)

  // Effect to handle screen resize and sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      const largeScreen = window.innerWidth >= 1440
      setIsLargeScreen(largeScreen)
      setIsSidebarOpen(largeScreen)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`bg-emerald-700 dark:bg-emerald-900 text-white w-64 min-h-screen p-4 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out xl:translate-x-0 fixed xl:static z-30 hover:bg-emerald-600 dark:hover:bg-emerald-800`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
          <button onClick={toggleSidebar} className="xl:hidden">
            <FiX size={24} />
          </button>
        </div>
        <nav>
          {sidebarItems.map(({ name, path, icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center space-x-2 mb-4 px-4 py-2 rounded transition-colors ${
                  isActive ? 'bg-emerald-800 dark:bg-emerald-700' : 'hover:bg-emerald-600 dark:hover:bg-emerald-800'
                }`
              }
            >
              {icon}
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-md p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 dark:text-gray-300 focus:outline-none xl:hidden"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <NavLink to="/" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <FiHome />
                <span>Home</span>
              </NavLink>
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <FiUser />
                <span>Profile</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-700 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
