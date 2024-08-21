const Offers = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="w-[306px] h-[210px] flex justify-center items-center rounded-xl  bg-gradient-to-r from-[#E7F0FD] to-[#ACCBEE] ">
        <p className="flex items-center justify-center gap-4">
          <span className="text-7xl font-bold text-gray-900">20 </span>
          <span className=" flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-gray-900">%</span>
            <span className="text-xl font-bold text-gray-900">OFF</span>
          </span>
        </p>
      </div>
      <p  className="border border-dashed  border-[#ACCBEE] w-[2px] h-[180px] "></p>
      <div className="w-[990px] h-[210px] bg-gradient-to-l from-[#E7F0FD] to-[#ACCBEE] flex justify-evenly items-center rounded-xl ">
        <div className="">
        <h4 className="text-[28px] font-bold uppercase">Seasonal weekly sale 2024</h4>
        <p className="text-lg text-[#222934]">Use code <span>Sale 2024</span> to get best offer</p>
        </div>
        <div className=""></div>
      </div>
    </div>
  );
};

export default Offers;
