
import Benefits from './Benefits/Benefits'
import Brands from './Brands/Brands'
import HeroContainer from './Hero/HeroContainer'
import NewArrivals from './NewArrivals/NewArrivals'
import Offers from './Offers/Offers'
import SpecialOffers from './SpecialOffers/SpecialOffers'
import TrendingProducts from './TrendingProducts/TrendingProducts'

const HomeContainer = () => {
  return (
    <div>
        <HeroContainer/>
        <div className="py-[72px] space-y-[72px]">
        <Benefits/>
        <NewArrivals/>
        <TrendingProducts/>
        <Offers/>
        <SpecialOffers/>
        <Brands/>
        </div>
    </div>
  )
}

export default HomeContainer