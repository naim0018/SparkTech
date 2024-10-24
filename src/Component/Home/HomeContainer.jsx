import Benefits from './Benefits/Benefits'
// import CustomerReviews from './CustomerReviews/CustomerReviews'
import HeroContainer from './Hero/HeroContainer'
import NewArrivals from './NewArrivals/NewArrivals'
import Offers from './Offers/Offers'
import SpecialOffers from './SpecialOffers/SpecialOffers'
import TrendingProducts from './TrendingProducts/TrendingProducts'

const HomeContainer = () => {
  return (
    <div>
        <HeroContainer/>
        <div className="px-2 md:px-0  py-[72px] space-y-[72px]">
        <Benefits/>
        <NewArrivals/>
        <TrendingProducts/>
        <Offers/>
        <SpecialOffers/>
        {/* <Brands/> */}
        {/* <CustomerReviews/> */}
        </div>
    </div>
  )
}

export default HomeContainer