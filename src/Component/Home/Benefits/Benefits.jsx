import { BiSupport } from "react-icons/bi";
import { BsArrowRepeat } from "react-icons/bs";
import { CiCreditCard1 } from "react-icons/ci";
import { LiaShippingFastSolid } from "react-icons/lia";
import { TbCurrencyTaka } from "react-icons/tb";

const Benefits = () => {
  const benefitItems = [
    {
      icon: <LiaShippingFastSolid className="text-3xl md:text-4xl" />,
      title: "Free Shipping & Returns",
      description: (
        <>
          For all orders over 2000 <TbCurrencyTaka className="inline" />
        </>
      ),
    },
    {
      icon: <CiCreditCard1 className="text-3xl md:text-4xl" />,
      title: "Secure Payment",
      description: "We ensure secure payment",
    },
    {
      icon: <BsArrowRepeat className="text-3xl md:text-4xl" />,
      title: "Money Back Guarantee",
      description: "Returning money within 30 days",
    },
    {
      icon: <BiSupport className="text-3xl md:text-4xl" />,
      title: "24/7 Customer Support",
      description: "Friendly customer support",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefitItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-gray-100">
              {item.icon}
            </div>
            <div className="flex-1">
              <h6 className="text-lg font-semibold mb-2">{item.title}</h6>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
