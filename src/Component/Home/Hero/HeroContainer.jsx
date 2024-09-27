import Banner from './Banner'
import Sidebar from './Sidebar'

const HeroContainer = () => {
  return (
    <div className='container mx-auto flex flex-col lg:flex-row items-start gap-6'>
      <div className=" w-full lg:w-[306px] lg:h-[546px] hidden lg:block">
        <Sidebar/>
      </div>
      <div className="flex-grow w-full">
        <Banner/>
      </div>
    </div>
  )
}

export default HeroContainer