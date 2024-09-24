import { FaStar } from "react-icons/fa";
import { useGetAllProductQuery } from "../../../redux/api/ProductApi";

const NAProductsList = () => {
  const { data, isLoading, error } = useGetAllProductQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred!</div>;
  console.log(data.data)

  return (
    <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-6">
  {
    data.data.map((product) => {
      return (
        <div key={product._id} className="w-full h-[115px] border rounded-lg shadow-md flex gap-4">
          <div className="flex-shrink-0 p-1">
            {
              product.images.slice(0, 1).map((image) => {
                return (
                  <img src={image} alt={product.name} key={image} className="w-[100px] h-[100px] rounded-md" />
                )
              })
            }
          </div>
          <div className="flex flex-col justify-evenly text-start w-full">
            <div className="flex items-center">
              {[...Array(5)].map((star, index) => {
                return (
                  <FaStar
                    key={index}
                    className={index < product.rating ? "text-yellow-500" : "text-gray-300"}
                  />
                );
              })}
              <span className="text-gray-600 ml-2">{product.ratingCount}</span>
            </div>
            <h3 className="text-[14px] font-medium text-gray-700">{product.title}</h3>
            <p className="text-[20px] font-semibold text-gray-500">${product.price}</p>
          </div>
        </div>
      )
    })
  }
</div>

  );
};

export default NAProductsList;

