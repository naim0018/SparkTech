/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form"
import BasicInformation from "./AddProduct/BasicInformation"

const ABC = ({products}) => {
    const {register, handleSubmit, watch } = useForm({
        defaultValues:{
            ...products
        }
    })
    console.log({products})
    const onSubmit = (data) => {
        console.log(data)
    }

    handleSubmit(onSubmit)

  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <p>ABC</p>
            <button type="submit">Submit</button>
            <p>Additional Information</p>
            <input {...register("price.regularPrice")}  className="text-gray-500"/>
            {/* <BasicInformation register={register}  watch={watch} />  */}
        </form>
    </div>
  )
}

export default ABC
