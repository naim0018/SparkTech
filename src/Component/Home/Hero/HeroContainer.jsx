import Banner from './Banner'
import Sidebar from './Sidebar'
import { useTheme } from '../../../ThemeContext' // Import useTheme hook

const HeroContainer = () => {
  const { isDarkMode } = useTheme() // Use the useTheme hook

  return (
    <div className={`container mx-auto flex flex-col lg:flex-row items-start gap-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="w-full lg:w-[306px] lg:h-[546px] hidden lg:block">
        <Sidebar/>
      </div>
      <div className="flex-grow w-full">
        <Banner/>
      </div>
    </div>
  )
}

export default HeroContainer