import { sidebarRoute } from "../../../Router/SidebarRoute"
import { navbarGenerator } from "../../../utils/navbarGenerator"


const Sidebar = () => {
    const sidebar = navbarGenerator(sidebarRoute)

  return (
    <div className="text-black space-y-1">
{
      sidebar.map(item=>{
         return (
              <div className="text-black flex items-center gap-2 " key={item.name}>
                  <p className="text-gray-400">{item.icon}</p>
                  <p className="text-black">{item.name}</p>
              </div>
         )
  })
}
    </div>
  )
}

export default Sidebar