import lines_logo from "../assets/hero-bg.svg";
import Brandkit from "../components/cards/Brandkit";
import CtaButton from "../components/buttons/CtaButton";
import { TBrandkit } from "../types";
import useBrandkits from "../hooks/useBrandkits";
import useSearch from "../hooks/useSearch";
import BrandkitCardLoading from "../components/skeletons/BrandkitCardLoading";
import ErrorState from "../components/ErrorState";

const Home = () => {
  const { brandkits, isBrandkitsLoading, brandkitError } = useBrandkits();
  const { searchNameKey, setSearchNameKey, filteredBrandkits } = useSearch(brandkits ?? []);
  const hasQuery = searchNameKey.trim().length > 0;
  const totalBrandkits = brandkits?.length ?? 0;
  const visibleBrandkits = filteredBrandkits?.length ?? 0;

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full bg-white">
      <section className="w-full bg-[#F3F3F3] px-4 py-8 md:py-12">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-[#D5D5D5] bg-white px-6 py-10 sm:px-10">
            <img
              src={lines_logo}
              alt="decorative lines"
              className="pointer-events-none absolute left-0 sm:-left-20 top-0 h-[150px] opacity-80 sm:h-[400px] lg:h-[900px]"
            />

            <div className="relative z-10 flex w-full flex-col items-center">
              <h1 className="text-center text-2xl font-bold tracking-wide sm:text-4xl lg:text-5xl">
                Your Brand, Forever
                <br />
                on the Permaweb
              </h1>

              <p className="mt-4 max-w-2xl text-center text-sm font-[500] text-[#555555] sm:text-base">
                Upload, share, and preserve your brand assets with long-term access for your team and community.
              </p>

              <div className="mt-8">
                <CtaButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center px-4 py-8 md:py-10" id="brandkits">
        <div className="w-full max-w-[1200px]">
          <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
            <h2 className="text-xl font-[500] text-[#212121] sm:text-2xl">Brandkits</h2>
            <div className="rounded-full border border-[#D5D5D5] bg-[#F9F9F9] px-3 py-1 text-xs font-[500] text-[#555555] sm:text-sm">
              {hasQuery ? `${visibleBrandkits} results for "${searchNameKey}"` : `${totalBrandkits} total`}
            </div>
          </div>

          <div className="mb-12 flex w-full justify-center">
            <input
              type="text"
              value={searchNameKey}
              onChange={(e) => setSearchNameKey(e.target.value)}
              className="w-full max-w-[620px] rounded-lg border border-[#D5D5D5] bg-white px-4 py-2.5 text-sm font-[500] text-[#212121] placeholder-[#555555] focus:border-[#212121] focus:outline-none focus:ring-1 focus:ring-[#212121] sm:py-3"
              placeholder="Search for Company/Community Name"
            />
          </div>

          {!isBrandkitsLoading && brandkitError && (
            <ErrorState
              title="Unable to load brandkits"
              message={
                brandkitError instanceof Error
                  ? brandkitError.message
                  : "Please refresh and try again."
              }
            />
          )}
          {!isBrandkitsLoading && !brandkitError && (
            <div className="flex flex-col items-center gap-4 flex-wrap pb-10">
              {(filteredBrandkits ?? []).map(
                (brandkit: TBrandkit) => (
                  <Brandkit key={brandkit.id || brandkit.url} brandkit={brandkit} />
                ),
              )}
            </div>
          )}
          {!isBrandkitsLoading && !brandkitError && filteredBrandkits?.length == 0 && (
            <div className="flex justify-center">
              <i className="font-semibold">No Brandkits found</i>
            </div>
          )}

          {isBrandkitsLoading && (
            <div className="flex justify-center gap-4 flex-wrap pb-10">
              {Array(3)
                .fill("")
                .map((_, index) => (
                  <BrandkitCardLoading key={index} />
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
