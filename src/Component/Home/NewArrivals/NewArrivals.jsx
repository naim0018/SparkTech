import Title from "../../../UI/Title"
import NAProductsList from "./NAProductsList"


const NewArrivals = () => {
  return (
    <div className="w-[1296px] mx-auto">
        <Title title={"New Arrivals"}/>
        <div className=" flex items-start gap-6">
             <div className="w-[416px]">
                <img src="https://i.imgur.com/vZLZS8L.png" alt="" />
             </div>
             <div className="">
                 <NAProductsList/>
             </div>
        </div>

    </div>
  )
}

export default NewArrivals