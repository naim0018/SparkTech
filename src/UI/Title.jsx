/* eslint-disable react/prop-types */
import { useTheme } from '../ThemeContext';

const Title = ({title}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`relative mb-8 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/30'} rounded-2xl`}>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center space-x-4">
          <div className={`w-1 h-12 ${isDarkMode ? 'bg-orange-400' : 'bg-orange-500'} rounded-full`}></div>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} tracking-wide`}>
            {title}
          </h2>
        </div>
        <div className={`flex items-center space-x-2`}>
          <div className={`w-20 h-0.5 ${isDarkMode ? 'bg-orange-400/50' : 'bg-orange-500/50'} rounded-full`}></div>
          <div className={`w-10 h-0.5 ${isDarkMode ? 'bg-orange-400/30' : 'bg-orange-500/30'} rounded-full`}></div>
          <div className={`w-5 h-0.5 ${isDarkMode ? 'bg-orange-400/20' : 'bg-orange-500/20'} rounded-full`}></div>
        </div>
      </div>

      <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${
        isDarkMode 
          ? 'from-transparent via-orange-400/30 to-transparent' 
          : 'from-transparent via-orange-500/30 to-transparent'
      }`}></div>
      
      <div className={`absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l ${
        isDarkMode 
          ? 'from-orange-400/10 to-transparent' 
          : 'from-orange-500/10 to-transparent'
      }`}></div>
    </div>
  )
}

export default Title