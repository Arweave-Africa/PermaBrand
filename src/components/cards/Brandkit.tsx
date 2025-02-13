import { useNavigate } from "react-router-dom"
import { TBrandkit } from "../../types"
import { FC } from "react"
import useFolder from "../../hooks/use-folder"

const Brandkit:FC<{brandkit:TBrandkit}> = ({brandkit}) => {
    const navigate = useNavigate()
    const { files } = useFolder(brandkit.folderId)
    console.log(files)
  return (
    <div onClick={() =>navigate(`/brandkit/${brandkit.creator}`, { state:brandkit})} className="w-[300px] p-4 rounded-lg bg-[#F9F9F9] border border-[#D5D5D5] cursor-pointer hover:border-blue-500 group">
        <div className="w-full h-20 rounded-lg flex justify-center">
            <img className="h-full shadow-sm m-1 rounded-lg object-contain" src={""} alt="" />
        </div>
        <h3 className="font-[500] my-4 text-center">{brandkit.name || "Arweavers to the moon"}</h3>
        <p className="h-16 w-[250px] text-[#555555] text-sm font-light overflow-hidden mb-4">{brandkit.description || "No Description provided"}</p>
        <div className="flex w-full justify-end">
        <button className="h-6 w-[60px] text-sm font-light cursor-pointer group-hover:text-blue-500 group-hover:border-b group-hover:border-b-blue-500">
            View kit
        </button>
        </div>
    </div>
  )
}

export default Brandkit
