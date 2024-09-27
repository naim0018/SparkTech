import { TfiAngleRight } from "react-icons/tfi"
import { sidebarRoute } from "../../../Router/SidebarRoute"
import { navbarGenerator } from "../../../utils/navbarGenerator"


const Sidebar = () => {
    const sidebar = navbarGenerator(sidebarRoute)
  return (
    <div className="text-black w-[306px] h-full border border-t-0 rounded-bl-lg rounded-br-lg p-3 bg-white ">
{
      sidebar.map(item=>{
         return (
              <div className="text-black flex items-center gap-2 px-3 py-2 " key={item.name}>
                  <p className="text-gray-400">{item.icon}</p>
                  <p className="text-gray-700 w-[198px] px-3 text-sm font-medium ">{item.name}</p>
                  <TfiAngleRight className="text-gray-700 text-[10px] rotate-90" />
              </div>
         )
  })
}
    </div>
  )
}

export default Sidebar