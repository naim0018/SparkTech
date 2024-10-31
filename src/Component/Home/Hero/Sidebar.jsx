import { TfiAngleDown } from "react-icons/tfi"
import { useTheme } from "../../../ThemeContext"
import { useNavigate } from "react-router-dom"
import { fixedCategory } from "../../../utils/variables"

const Sidebar = () => {
    const { isDarkMode } = useTheme()
    const navigate = useNavigate()
    

    const handleCategoryClick = (category) => {
        navigate(`/shop?category=${category}`);
    }

    return (
        <div className={`w-[306px] h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-b-lg`}>
            {fixedCategory.map((category, index) => (
                <div 
                    key={index}
                    className={`group flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-3 cursor-pointer transition-colors duration-200 ${
                        index !== fixedCategory.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                    }`}
                    onClick={() => handleCategoryClick(category)}
                >
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {category}
                    </span>
                    <TfiAngleDown className={`text-xs transform transition-transform duration-200 group-hover:translate-x-1 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
            ))}
        </div>
    )
}

export default Sidebar