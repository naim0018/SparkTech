import { CiSearch } from "react-icons/ci"


const SearchInput = () => {
  return (
    <div className="lg:w-[490px] lg:px-5 lg:border border-white rounded-full flex items-center">
    <CiSearch className="hidden lg:flex text-xl text-white " />
    <input
      type="text"
      placeholder="Search the products"
      className=" hidden lg:flex outline-none  py-2 bg-transparent w-full text-white font-normal px-4 placeholder:text-[#6c727f]"
    />
  </div>
  )
}

export default SearchInput