/* eslint-disable react/prop-types */

const Menu = ({isOpen,setIsOpen}) => {
  
  return (
    <div className="lg:hidden relative z-50">
    <label
      onClick={() => setIsOpen(!isOpen)}
      className="flex flex-col gap-2 w-[22px] sm:w-8 cursor-pointer"
    >
      <div
        className={`rounded-2xl h-[3px] w-1/2 bg-white duration-200 ease-out ${
          isOpen
            ? "rotate-[225deg] origin-right -translate-x-[8px] translate-y-[3px] sm:-translate-x-[12px] sm:-translate-y-[1px]"
            : ""
        }`}
      ></div>
      <div
        className={`rounded-2xl h-[3px] w-full bg-white duration-200 ease-in ${
          isOpen ? "-rotate-45" : ""
        }`}
      ></div>
      <div
        className={`rounded-2xl h-[3px] w-1/2 bg-white duration-200 ease-out place-self-end ${
          isOpen
            ? "rotate-[225deg] origin-left translate-x-[8px] -translate-y-[3px] sm:translate-x-[12px] sm:translate-y-[1px]"
            : ""
        }`}
      ></div>
    </label>
  </div>
  )
}

export default Menu