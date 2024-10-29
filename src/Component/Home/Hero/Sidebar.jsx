import { TfiAngleRight } from "react-icons/tfi"
import { useTheme } from "../../../ThemeContext"
import { useGetAllProductsQuery } from "../../../redux/api/ProductApi" // Import the query hook

const Sidebar = () => {
    const { isDarkMode } = useTheme()
    const { data: products, isLoading, isError } = useGetAllProductsQuery() // Use the query hook

    // Create a unique array of product categories
    const uniqueCategories = products ? [...new Set(products?.products?.map(product => product?.basicInfo?.category))] : []

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error loading categories</div>

    return (
        <div className={`w-[306px] h-full border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t-0 rounded-bl-lg rounded-br-lg p-3  ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            {uniqueCategories.map((category, index) => (
                <div className={`flex items-center justify-between gap-2 px-3 py-2 border ${isDarkMode ? 'text-white' : 'text-black'}`} key={index}>
                    <p className={`w-[198px] px-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{category}</p>
                    <TfiAngleRight className={`text-[10px] rotate-90 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`} />
                </div>
            ))}
        </div>
    )
}

export default Sidebar