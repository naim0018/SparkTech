import Banner from './Banner'
import Sidebar from './Sidebar'

const HeroContainer = () => {
  return (
    <div className='flex items-start justify-center gap-6 w-[1296px] mx-auto h-[546px]'>
        <Sidebar/>
        <Banner/>
    </div>
  )
}

export default HeroContainer