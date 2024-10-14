/* eslint-disable react/prop-types */
import { useTheme } from '../ThemeContext'; // Import useTheme hook

const Title = ({title}) => {
  const { isDarkMode } = useTheme(); // Use the useTheme hook

  return (
    <div>
        <p className={`text-[28px] font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{title}</p>
        <hr className={`border my-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}/>
    </div>
  )
}

export default Title