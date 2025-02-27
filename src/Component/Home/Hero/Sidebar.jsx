import { TfiAngleDown } from "react-icons/tfi"
import { useTheme } from "../../../ThemeContext"
import { useNavigate } from "react-router-dom"
import { useGetAllCategoriesQuery } from "../../../redux/api/CategoriesApi"
import { useState } from "react"

const Sidebar = () => {
    const { isDarkMode } = useTheme()
    const navigate = useNavigate()
    const { data } = useGetAllCategoriesQuery()
    const categories = data?.data || []
    const [hoveredCategory, setHoveredCategory] = useState(null)

    const handleCategoryClick = (category) => {
        navigate(`/shop?category=${encodeURIComponent(category)}`);
    }

    const handleSubCategoryClick = (e, category, subCategory) => {
        e.stopPropagation();
        navigate(`/shop?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subCategory.name)}`);
    }

    return (
        <div className={`w-[306px] h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-b-lg`}>
            {categories.map((categoryData, index) => (
                <div 
                    key={categoryData._id}
                    className="relative"
                    onMouseEnter={() => setHoveredCategory(categoryData._id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                >
                    <div 
                        className={`group flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-3 cursor-pointer transition-colors duration-200 ${
                            index !== categories.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                        }`}
                        onClick={() => handleCategoryClick(categoryData.name)}
                    >
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {categoryData.name}
                        </span>
                        {categoryData.subCategories && categoryData.subCategories.length > 0 && (
                            <TfiAngleDown className={`text-xs transform transition-transform duration-200 
                                ${hoveredCategory === categoryData._id ? '-rotate-90' : ''} 
                                ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} 
                            />
                        )}
                    </div>

                    {/* Subcategories dropdown */}
                    {categoryData.subCategories && categoryData.subCategories.length > 0 && hoveredCategory === categoryData._id && (
                        <div className={`absolute left-full top-0 w-[200px] shadow-lg rounded-r-lg overflow-hidden
                            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                            animate-fadeIn z-50`}
                        >
                            {categoryData.subCategories.map((subCategory, subIndex) => (
                                <div
                                    key={subIndex}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700
                                        transition-colors duration-200
                                        ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                                    onClick={(e) => handleSubCategoryClick(e, categoryData.name, subCategory)}
                                >
                                    <span className="text-sm">{subCategory.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Sidebar