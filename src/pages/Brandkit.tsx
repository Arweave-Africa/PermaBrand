import { useLocation } from "react-router-dom";
import copy_logo from "../assets/copy.svg"
import copy_success_logo from "../assets/copy-success.svg"
import { useState } from "react";
import { TBrandkit } from "../types";

const Brandkit = () => {
  const { state } = useLocation()

  return (
    <div className="min-h[calc(100vh-5rem)">
      <div className="bg-[#F3F3F3] w-full py-5 md:py-20">
      <div className="px-4 xl:px-64 flex ">
        <div className="h-8 w-8 md:h-24 md:w-24 lg:h-40 lg:w-40 mr-2 md:mr-10 rounded-lg border border-gray-200 p-2 flex items-center justify-center">
          {/**@ts-expect-error */}
          <Logo url={Object.values(state.files)[0].id} alt={state.brandkit.name}/>
        </div>
        <div>
          <h1 className="font-[500] text-lg md:text-3xl mt-0 md:mt-4 mb-4">{state.brandkit.name}</h1>
          <p className="font-light text-xs md:text-sm max-w-[900px]">{state.brandkit.description || "No Description provided"}</p>
        </div>
      </div>
      </div>
      <h3 className="w-full text-center py-4 text-lg md:text-2xl font-[500]">Logos</h3>
      <div className="w-full flex justify-center pt-4 md:pt-10">
        <div className="max-w-[1500px] flex flex-wrap justify-center gap-x-16 gap-y-8 pb-10 px-4">
          {Object.values(state.files).map((file:any, index) => <LogoCard key={index} file={file}/>)}
        </div>
      </div>
    </div>
  )
}

export default Brandkit

const Logo = ({url, alt}:{url:string, alt:string}) => {
  return (
    <img src={`https://arweave.net/${url}`} alt={alt} className="h-full w-full object-contain"/>
  )
}

const LogoCard = ({file}:{file:TBrandkit}) => {
  const [copySuccess, setCopySuccess] = useState(false)

  const copy = (text:string) => {
    navigator.clipboard.writeText(`https://arweave.net/raw/${text}`)
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1000);
  }
  
  return (
    <div className="relative h-28 w-64 md:h-34 md:w-72 flex items-center justify-center rounded-lg p-2 border border-gray-200">
            <Logo url={file.id} alt={file.name}/>
            <div onClick={() => copy(file.id)} className="absolute bottom-0.5 right-0.5 md:bottom-2 md:right-2 h-5 w-5 md:h-6 md:w-6 cursor-pointer rounded-full border-1 border-gray-300 hover:border-black" >
              <img src={!copySuccess ? copy_logo : copy_success_logo} alt="copy" className="h-full w-full p-1" />
            </div>
          </div>
  )
}
