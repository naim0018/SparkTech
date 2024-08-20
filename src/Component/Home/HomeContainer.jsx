
import Benefits from './Benefits/Benefits'
import HeroContainer from './Hero/HeroContainer'
import NewArrivals from './NewArrivals/NewArrivals'

const HomeContainer = () => {
  return (
    <div>
        <HeroContainer/>
        <div className="py-[72px] space-y-[72px]">
        <Benefits/>
        <NewArrivals/>
        </div>
    </div>
  )
}

export default HomeContainer