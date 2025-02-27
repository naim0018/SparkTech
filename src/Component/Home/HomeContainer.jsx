import Benefits from "./Benefits/Benefits";
import HeroContainer from "./Hero/HeroContainer";
import NewArrivals from "./NewArrivals/NewArrivals";
import SpecialOffers from "./SpecialOffers/SpecialOffers";
import TrendingProducts from "./TrendingProducts/TrendingProducts";
import CategoryProduct from "./CategoryBasedProduct/CategoryProduct";
import { Helmet } from "react-helmet";

const HomeContainer = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>BestBuy4uBD | Online Shopping in Bangladesh</title>
        <meta
          name="description"
          content="Shop the latest electronics, gadgets, and accessories. Find great deals on trending products with fast delivery across Bangladesh."
        />
        <meta
          name="keywords"
          content="online shopping, electronics, gadgets, Bangladesh, BestBuy4uBD"
        />
      </Helmet>

      {/* Hero Section - Full width */}
      <HeroContainer />

      {/* Main Content Container */}

      <div className="container mx-auto space-y-16 sm:space-y-20 py-12 sm:py-16">
        <Benefits />
        <NewArrivals />
        <CategoryProduct />
        <TrendingProducts />
        <SpecialOffers />
      </div>
    </div>
  );
};

export default HomeContainer;
