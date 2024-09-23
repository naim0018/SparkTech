import Banner from './Banner'
import Sidebar from './Sidebar'

const HeroContainer = () => {
  return (
    <div className='container mx-auto lg:flex items-start gap-6 h-[546px]'>
      <div className="hidden lg:flex w-[306px] h-[546px]">
        <Sidebar/>
      </div>
        <Banner/>
    </div>
  )
}

export default HeroContainer