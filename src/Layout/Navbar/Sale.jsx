import { PiPercentBold } from "react-icons/pi"


const Sale = () => {
  return (
    <div className="hidden lg:flex items-center justify-center gap-2">
    <div className="size-12 bg-[#333D4C] rounded-full flex items-center justify-center">
      <PiPercentBold className="text-[#F55266] text-xl" />
    </div>
    <div>
      <p className="text-xs font-normal text-[#CAD0D9]">
        Only this month
      </p>
      <p className="text-base font-medium text-white">Super Sale 20%</p>
    </div>
  </div>
  )
}

export default Sale