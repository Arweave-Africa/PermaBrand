import lines_logo from "../assets/hero-bg.svg";
import Brandkit from "../components/cards/Brandkit";
import { useQuery } from "@tanstack/react-query";
import { processId } from "../utils/constants";
import { dryrun } from "@permaweb/aoconnect";
import BrandkitCardLoading from "../components/skeletons/BrandkitCardLoading";
import { useEffect, useState } from "react";
import CtaButton from "../components/buttons/CtaButton";
import { TBrandkit } from "../types";

const Home = () => {
  const { isLoading, data: brandkits } = useQuery({
    queryKey: ["brandkits-fetch"],
    queryFn: async () => {
      try {
        const { Messages } = await dryrun({
          process: processId,
          tags: [{ name: "Action", value: "Get-Brandkits" }],
        });
        return JSON.parse(Messages[0].Data);
      } catch (error) {
        console.log(error);
        console.error("Error fetching brandkits.");
      }
    },
  });

  const [filteredBrandkits, setFilteredBrandkits] = useState(brandkits);
  const [name, setName] = useState("");

  const searchName = (name: string) => {
    if (name.trim().length == 0) {
      setFilteredBrandkits(brandkits);
      return;
    }

    const result = brandkits.filter((brandkit: any) =>
      String(brandkit.name)
        .toLocaleLowerCase()
        .includes(name.toLocaleLowerCase()),
    );
    setFilteredBrandkits(result);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchName(name);
    }, 500);

    return () => clearTimeout(timer);
  }, [name]);

  useEffect(() => {
    setFilteredBrandkits(brandkits);
  }, [brandkits]);

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full">
      <div className="py-10 w-full flex justify-center bg-[#F3F3F3]">
        <div className="w-full flex flex-col items-center">
          <div className="text-lg sm:text-3xl lg:text-5xl font-bold text-center tracking-wider">
            Your Brand, Forever <br /> on the Permaweb
          </div>

          <p className="text-xs lg:text-sm text-[#555555] font-[500] text-center mt-5 mb-8 px-20">
            Upload, share, and preserve your brand assets <br /> on the Permaweb
          </p>
          <div className="mt-8">
            <CtaButton />
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
            <div className="bg-[#F3F3F3] focus-within:bg-white border border-[#D5D5D5] rounded-lg h-10 sm:h-12 px-1 md:px-2 w-[350px] sm:w-[450px] md:w-[600px] flex items-center">
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="flex-1 h-9 outline-none bg-transparent px-2 sm:px-4"
                placeholder="Search for Company/Community Name"
              />
            </div>
          </div>
          {!isLoading && (
            <div className="flex flex-col items-center gap-4 flex-wrap pb-10">
              {(filteredBrandkits?? []).map(
                (brandkit: TBrandkit, index: number) => (
                  <Brandkit key={index} brandkit={brandkit} />
                ),
              )}
            </div>
          )}
          {!isLoading && filteredBrandkits?.length == 0 && (
            <div className="flex justify-center">
              <i className="font-semibold">No Brandkits found</i>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center gap-4 flex-wrap pb-10">
        {Array(3)
          .fill("")
          .map((_, index) => (
            <BrandkitCardLoading key={index} />
          ))}
        </div>)}
        </div>
      </div>
    </div>
  );
};

export default Home;
