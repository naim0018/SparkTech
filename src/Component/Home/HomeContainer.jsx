import Benefits from './Benefits/Benefits'
// import CustomerReviews from './CustomerReviews/CustomerReviews'
import HeroContainer from './Hero/HeroContainer'
import NewArrivals from './NewArrivals/NewArrivals'
import Offers from './Offers/Offers'
import SpecialOffers from './SpecialOffers/SpecialOffers'
import TrendingProducts from './TrendingProducts/TrendingProducts'
import { Helmet } from 'react-helmet'

const HomeContainer = () => {
  return (
    <div>
        <Helmet>
          <title>BestBuy4uBD | Online Shopping in Bangladesh</title>
          <meta name="description" content="Shop the latest electronics, gadgets, and accessories. Find great deals on trending products with fast delivery across Bangladesh." />
          <meta name="keywords" content="online shopping, electronics, gadgets, Bangladesh, BestBuy4uBD" />
        </Helmet>
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