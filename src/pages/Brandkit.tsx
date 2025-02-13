import { useLocation } from "react-router-dom";
import permabrand_logo from "../assets/logo_black.svg";

const Brandkit = () => {
  const { state } = useLocation()


  return (
    <div className="min-h[calc(100vh-5rem)">
      <div className="bg-[#F3F3F3] w-full py-5 md:py-20">
      <div className="px-4 xl:px-64 flex ">
        <img src={permabrand_logo} alt="" className="h-8 w-8 md:h-24 md:w-24 lg:h-40 lg:w-40 mr-2 md:mr-10 rounded-lg" />
        <div>
          <h1 className="font-[500] text-lg md:text-3xl mt-0 md:mt-4 mb-4">{state.name}</h1>
          <p className="font-light text-xs md:text-sm max-w-[900px]">{state.description || "No Description provided"}</p>
        </div>
      </div>
      </div>
      <h3 className="w-full text-center py-4 text-lg md:text-2xl font-[500]">Logos</h3>
      <div className="w-full flex justify-center pt-4 md:pt-10">
        <div className="max-w-[1500px] flex flex-wrap justify-center gap-x-16 gap-y-8 pb-10 px-4">
          {Array(11).fill("").map((_, index) => <Logo key={index}/>)}
        </div>
      </div>
    </div>
  )
}

export default Brandkit

const Logo = () => {
  return (
    <div>
      <img src="" alt="" className="h-64 w-64 md:h-44 md:w-44 rounded-lg bg-blue-500"/>
    </div>
  )
}
