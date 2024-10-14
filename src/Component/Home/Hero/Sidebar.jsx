import { TfiAngleRight } from "react-icons/tfi"
import { sidebarRoute } from "../../../Router/SidebarRoute"
import { navbarGenerator } from "../../../utils/navbarGenerator"
import { useTheme } from "../../../ThemeContext" // Import useTheme hook

const Sidebar = () => {
    const sidebar = navbarGenerator(sidebarRoute)
    const { isDarkMode } = useTheme() // Use the useTheme hook

  return (
    <div className={`w-[306px] h-full border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t-0 rounded-bl-lg rounded-br-lg p-3 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
{
      sidebar.map(item=>{
         return (
              <div className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'text-white' : 'text-black'}`} key={item.name}>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.icon}</p>
                  <p className={`w-[198px] px-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</p>
                  <TfiAngleRight className={`text-[10px] rotate-90 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`} />
              </div>
         )
  })
}
    </div>
  )
}

export default Sidebar