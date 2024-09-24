import { FaStar } from "react-icons/fa";
import { useGetAllProductQuery } from "../../../redux/api/ProductApi";
import Title from "../../../UI/Title";
import { MdOutlineShoppingCart } from "react-icons/md";

const SpecialOffers = () => {
  const { data, isLoading, error } = useGetAllProductQuery();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred!</div>;
  console.log(data.data);
  return (
    <div className="container mx-auto">
      <Title title={"Special Offers"} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.data.slice(0, 8).map((product) => {
          return (
            <div
              key={product._id}
              className="w-[306px] lg:w-full flex flex-col  items-center justify-center   p-4 pt-8  group cursor-pointer"
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-[258px] h-[240px] p-6 group-hover:scale-110 group-hover:transition group-hover:duration-300 "
              />
              <div className="flex items-center my-1">
                {[...Array(5)].map((star, index) => {
                  return (
                    <FaStar
                      key={index}
                      className={`${
                        index < product.rating
                          ? "text-yellow-500 "
                          : "text-gray-300 "
                      } size-[12px] lg:size-[16px] `}
                    />
                  );
                })}
              </div>
              <h2 className="text-sm font-medium mb-3 mt-2 overflow-hidden text-ellipsis h-10 text-gray-900 ">
                {product.title}
              </h2>

              <div className="flex items-center justify-between w-full px-2">
                <div className="flex items-center mb-2">
                  <span className="text-xl font-bold">${product.price}</span>
                  {product.oldPrice && (
                    <span className="text-gray-500 line-through ml-2">
                      ${product.oldPrice}
                    </span>
                  )}
                </div>
                <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded hover:">
                  <MdOutlineShoppingCart className=" size-[20px]" />
                </button>
              </div>
              <div className="w-full px-2 my-2">
                <p className="text-gray-500 text-sm">
                  Available :{" "}
                  <span className="text-gray-900 font-semibold">
                    {product.stockQuantity}
                  </span>
                </p>
                <div className="w-full overflow-hidden bg-gray-300 rounded-full h-1 my-[5px]">
                  <div
                    className="bg-red-500 h-1 rounded-full "
                    style={{ width: `${(product.stockQuantity / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpecialOffers;
