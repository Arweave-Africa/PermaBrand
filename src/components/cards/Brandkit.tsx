import { useNavigate } from "react-router-dom"
import { TBrandkit } from "../../types"
import { FC } from "react"
import useFolder from "../../hooks/use-folder"
import arrow_right from "../../assets/arrow_right.svg";

const Brandkit:FC<{brandkit:TBrandkit}> = ({brandkit}) => {
    const navigate = useNavigate()
    const { files, isLoading } = useFolder(brandkit.folderId)

    const handleGoToBrandkit = () => {
      navigate(`/brandkit/${brandkit.creator}`, { 
        state:{
          brandkit, 
          files
        }
      })
    }

    if(isLoading) return <div>Loading...</div>
    
    //@ts-ignore
    const randomFileId = Object.values(files!)[Math.floor(Math.random() * Object.values(files!).length)].id

  return (
    <div onClick={handleGoToBrandkit} className="w-[300px] p-4 rounded-lg bg-[#F9F9F9] border border-[#D5D5D5] cursor-pointer hover:border-blue-500 group">
        <div className="w-full h-20 rounded-lg flex justify-center">
            <img className="h-full shadow-sm m-1 rounded-lg object-contain" src={`https://arweave.net/${randomFileId}`} alt={Object.keys(files!)[0] || "brandkit main logo"} />
        </div>
        <h3 className="font-[500] my-4 text-center">{brandkit.name || "Arweavers to the moon"}</h3>
        <p className="h-16 w-[250px] text-[#555555] text-sm font-light overflow-hidden mb-4">{brandkit.description || "No Description provided"}</p>
        <div className="flex w-full justify-end">
        <div className="group w-32 flex items-center justify-end hover:justify-center transition-all ease-in-out delay-50">
          <span>View Kit</span>{" "}
            <img
            src={arrow_right}
            color="blue"
            alt="arrow right"
            className="h-4 w-0 group-hover:w-6 transition-all ease-in-out delay-50"
          />
        </div> 
        </div>
    </div>
  )
}

export default Brandkit
