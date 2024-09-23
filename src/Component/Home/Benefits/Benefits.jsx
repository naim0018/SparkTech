import { BiSupport } from "react-icons/bi";
import { BsArrowRepeat } from "react-icons/bs";
import { CiCreditCard1 } from "react-icons/ci";
import { LiaShippingFastSolid } from "react-icons/lia";
import { TbCurrencyTaka } from "react-icons/tb";

const Benefits = () => {
  return (
    <div className="container mx-auto md:grid md:grid-cols-2 gap-6 items-center justify-between ">
      <div className="flex items-center justify-center  gap-4">
        <div className="w-[86px] h-[86px] rounded-full flex items-center justify-center border bg-gray-200">
          <LiaShippingFastSolid className="text-[32px] " />
        </div>
        <div className="">
          <h6 className="text-base font-semibold">Free Shipping & Returns</h6>
          <p className="flex items-center text-sm font-normal">
            For all orders over 2000{" "}
            <span>
              <TbCurrencyTaka />
            </span>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center  gap-4">
        <div className="w-[86px] h-[86px] rounded-full flex items-center justify-center border bg-gray-200">
          <CiCreditCard1 className="text-[32px]" />
        </div>
        <div className="">
          <h6 className="text-base font-semibold">Secure Payment</h6>
          <p className="flex items-center text-sm font-normal">We ensure secure payment</p>
        </div>
      </div>
      <div className="flex items-center justify-center  gap-4">
        <div className="w-[86px] h-[86px] rounded-full flex items-center justify-center border bg-gray-200">
          <BsArrowRepeat className="text-[32px] " />
        </div>
        <div className="">
          <h6 className="text-base font-semibold">Money Back Guarantee</h6>
          <p className="flex items-center text-sm font-normal">Returning money 30 days</p>
        </div>
      </div>
      <div className="flex items-center justify-center  gap-4">
        <div className="w-[86px] h-[86px] rounded-full flex items-center justify-center border bg-gray-200">
          <BiSupport className="text-[32px] " />
        </div>
        <div className="">
          <h6 className="text-base font-semibold">24/7 Customer Support</h6>
          <p className="flex items-center text-sm font-normal">Friendly customer support</p>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
