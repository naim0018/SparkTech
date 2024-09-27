// Import necessary dependencies and components
import { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { FiMenu, FiX, FiHome } from 'react-icons/fi'
import { navbarGenerator } from '../../utils/navbarGenerator'
import { adminRoute } from '../../Router/AdminRoute'

// AdminLayout component for the admin dashboard
const AdminLayout = () => {
  // State for sidebar visibility and screen size
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  // Generate sidebar items from admin routes
  const sidebarItems = navbarGenerator(adminRoute)

  // Effect to handle screen resize and sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024)
      setIsSidebarOpen(window.innerWidth >= 1024)
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
    <div className='flex flex-col lg:flex-row min-h-screen'>
      {/* Hamburger menu button for small screens */}
      <button
        className="fixed top-4 left-4 z-20 lg:hidden bg-gray-700 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar component */}
      <aside className={`bg-gray-700 text-white w-full lg:w-64 lg:min-h-screen fixed lg:static z-10 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'top-0' : '-top-full lg:top-0'
      }`}>
        {/* Admin dashboard header */}
        <header className="p-4 mt-10 lg:mt-0 flex justify-center items-center">
          <h1 className="text-2xl font-bold">E-commerce Admin</h1>
        </header>
        {/* Navigation menu */}
        <nav className="mt-8 px-5 pb-10">
          {/* Home NavLink */}
          <NavLink
            to="/"
            className={({ isActive }) => 
              `flex items-center gap-2 py-2 px-4 text-white transition-colors duration-200 ${
                isActive ? 'bg-white/20 font-bold' : 'hover:bg-white/10'
              }`
            }
            onClick={() => isSmallScreen && setIsSidebarOpen(false)}
          >
            <FiHome />
            Home
          </NavLink>
          {sidebarItems.map(({ name, path, icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) => 
                `flex items-center gap-2 py-2 px-4 text-white transition-colors duration-200 ${
                  isActive ? 'bg-white/20 font-bold' : 'hover:bg-white/10'
                }`
              }
              onClick={() => isSmallScreen && setIsSidebarOpen(false)}
            >
              {icon}
              {name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-grow p-4 lg:p-8">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
