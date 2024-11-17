/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiHome, FiUser, FiLogOut } from 'react-icons/fi'
import { navbarGenerator } from '../../utils/navbarGenerator'
import { adminRoute } from '../../Router/AdminRoute'
import { userRoute } from '../../Router/UserRoute'
import { useTheme } from '../../ThemeContext'
import { BiHome } from 'react-icons/bi'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const sidebarItems = user?.role === 'admin' ? navbarGenerator(adminRoute) : navbarGenerator(userRoute)
  const { isDarkMode } = useTheme()
  const location = useLocation()
  const baseRoute = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <aside
        className={`${isDarkMode ? 'bg-emerald-900' : 'bg-emerald-700'} text-white w-64 min-h-screen p-4 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out xl:translate-x-0 fixed xl:static z-30 ${isDarkMode ? 'hover:bg-emerald-800' : 'hover:bg-emerald-600'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">{user?.role === 'admin' ? 'Admin Panel' : 'User Dashboard'}</h2>
          <button onClick={toggleSidebar} className="xl:hidden">
            <FiX size={24} />
          </button>
        </div>
        <nav>
          <NavLink to={baseRoute} end className={({ isActive }) =>
                `flex items-center space-x-2 mb-4 px-4 py-2 rounded transition-colors ${
                  isActive ? (isDarkMode ? 'bg-emerald-700' : 'bg-emerald-800') : (isDarkMode ? 'hover:bg-emerald-800' : 'hover:bg-emerald-600')
                }`
              }
            >
              <BiHome />
              <span>Dashboard</span>
          </NavLink>
          {sidebarItems.map(({ name, path, icon }) => (
            <NavLink
              key={name}
              to={`${baseRoute}/${path}`}
              className={({ isActive }) =>
                `flex items-center space-x-2 mb-4 px-4 py-2 rounded transition-colors ${
                  isActive ? (isDarkMode ? 'bg-emerald-700' : 'bg-emerald-800') : (isDarkMode ? 'hover:bg-emerald-800' : 'hover:bg-emerald-600')
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
        <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-4`}>
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} focus:outline-none xl:hidden`}
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <NavLink to="/" className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiHome />
                <span>Home</span>
              </NavLink>
              <button className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiUser />
                <span>Profile</span>
              </button>
              <button className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiLogOut />
                <span>Logout</span>
              </button>
              
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} p-6`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
