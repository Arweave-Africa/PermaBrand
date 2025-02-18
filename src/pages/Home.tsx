import { useNavigate } from "react-router-dom";
import lines_logo from "../assets/hero-bg.svg";
import search from "../assets/search.svg"
import Brandkit from "../components/cards/Brandkit";
import { useQuery } from "@tanstack/react-query";
import { processId } from "../utils/constants";
import { dryrun } from "@permaweb/aoconnect";
import BrandkitCardLoading from "../components/skeletons/BrandkitCardLoading";

const Home = () => {

  const navigate = useNavigate()

  const {
    isLoading,
    data: brandkits
  } = useQuery({
    queryKey: ["brandkits-fetch"],
    queryFn: async () => {
      try {
        const { Messages } = await dryrun({
          process: processId,
          tags: [{ name: "Action", value: "Get-Brandkits" }],
        });
        return JSON.parse(Messages[0].Data)
      } catch (error) {
        console.log(error);
        console.error("Error fetching tokens.");
      }
    },
  });

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full">
      <div className="py-10 w-full flex justify-center bg-[#F3F3F3] relative">
        <div className="w-11/12 md:w-9/12 lg:w-9/12 xl:w-7/12 flex flex-col items-center">
          <div className="text-3xl lg:text-5xl xl:text-7xl font-bold tracking-wider">
            Explore and Share <br />
            Arweave <span className="text-blue-600">BrandKits</span>
          </div>
          <div className="flex justify-center">
            <p className="my-10 px-5 lg:px-0 text-sm sm:text-lg text-[#555555] font-[500] xl:text-3xl text-center">
              Upload and showcase your brand assets <br /> with the Arweave
              ecosystem
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <a href="#brandkits">
              <div className="h-10 w-[150px] flex items-center justify-center rounded-lg border border-black cursor-pointer hover:bg-black hover:text-white">Explore Kits</div>
            </a>
            <button onClick={() =>navigate("/create")} className="h-10 w-[150px] rounded-lg border border-black text-white bg-black cursor-pointer hover:text-black hover:bg-white">
              Upload Kit
            </button>
          </div>
        </div>
        <div>
          <img
            src={lines_logo}
            alt="lines"
            className="h-[150px] sm:h-[300px] lg:h-[400px] absolute left-0 top-5"
          />
        </div>
      </div>
      <div className="flex w-full justify-center">
      <div className="w-11/12 lg:w-10/12 xl:w-[1200px] py-8" id="brandkits">
        <div className="w-full flex justify-center mb-8">
          <div className="bg-[#F3F3F3] border border-[#D5D5D5] rounded-lg h-12 px-1 md:px-2 w-[350px] sm:w-[450px] md:w-[600px] flex items-center">
            <input type="text" className="flex-1 h-9 outline-none" placeholder="Search for Company/Community Name" />
            <div className="h-9 bg-black text-white rounded-lg flex items-center justify-center tracking-wide px-1 md:px-2"> <img src={search} alt="search" className="h-5 mx-1" /> <span className="hidden md:flex">Search</span></div>
          </div>
        </div>
        { !isLoading && <div className="flex justify-center gap-4 flex-wrap pb-10">
          {Object.values(brandkits).map((brandkit:any, index:number) => <Brandkit key={index} brandkit={brandkit}/>)}
        </div>}
        { !isLoading && brandkits.length == 0 && <div className="flex justify-center">
          <i className="text-gray-500 font-light md:text-xl">No Brandkits found</i>
        </div>}
        {isLoading && <div className="flex justify-center gap-4 flex-wrap pb-10">
          {Array(6).fill("").map((_, index) => <BrandkitCardLoading key={index}/>)}
        </div>}
      </div>
      </div>
    </div>
  );
};

export default Home;
