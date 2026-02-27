import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import copy_logo from "../assets/copy.svg";
import copy_success_logo from "../assets/copy-success.svg";
import { useState } from "react";
import useFolder from "../hooks/useFolder";
import BrandkitPageLoader from "../components/skeletons/BrandkitPageLoader";
import NotFound from "./404";
import useBrandkits from "../hooks/useBrandkits";
import { useActiveAddress } from "@arweave-wallet-kit/react";

const Brandkit = () => {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const userAddress = useActiveAddress();
  const brandkitUrl = pathname.replace(/\//g, "");
  const { brandkits, isBrandkitsLoading, isBrandkitsFetching } = useBrandkits()
  const brandkit = brandkits?.find((b) => b.url === brandkitUrl);
  const { isLoading: filesLoading, files } = useFolder(brandkit?.folderId ?? "");
  const fileEntries = Object.entries(files);
  const firstFileId = fileEntries[0]?.[1]?.id;
  const isCreator = userAddress === brandkit?.creator;

  if (isBrandkitsLoading || (!brandkit && isBrandkitsFetching) || (brandkit && filesLoading)) {
    return <BrandkitPageLoader />;
  }

  if (!brandkit) return <NotFound/>

  const fileCount = fileEntries.length;

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full bg-white px-4 py-6 sm:px-6 md:px-10 md:py-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <section className="relative overflow-hidden rounded-3xl border border-[#D5D5D5] bg-white p-4 shadow-[0_18px_60px_-42px_rgba(17,24,39,0.45)] sm:p-7 md:p-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-gray-300 pb-4">
            <p className="rounded-full border border-[#D5D5D5] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#555555]">
              Brandkit
            </p>
            <div className="flex items-center gap-2">
              <p className="rounded-full border border-[#D5D5D5] px-3 py-1 text-xs font-[500] text-[#555555]">
                {fileCount} assets
              </p>
              {isCreator && (
                <button
                  type="button"
                  onClick={() => navigate(`/edit/${brandkit.url}`)}
                  className="rounded-full border border-[#D5D5D5] bg-white px-3 py-1 text-xs font-[500] text-[#212121] transition hover:border-[#9CA3AF] cursor-pointer"
                >
                  Edit Brandkit
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-[180px_1fr] md:gap-8">
            <div className="h-24 w-24 md:h-[180px] md:w-[180px] rounded-2xl border border-[#D5D5D5] p-3 flex items-center justify-center">
              {firstFileId ? (
                <Logo id={firstFileId} alt={brandkit.name} />
              ) : (
                <span className="text-xs text-[#555555]">No preview</span>
              )}
            </div>

            <div className="flex min-h-[180px] flex-col justify-between">
              <div>
                <h1 className="text-2xl font-[500] text-[#212121] md:text-4xl">
                  {brandkit.name}
                </h1>
                <p className="mt-4 max-w-[900px] text-sm font-light leading-relaxed text-[#555555] md:text-base">
                  {brandkit.description || "No description provided"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 md:mt-10">
          <div className="mb-6 flex flex-col items-start justify-between gap-3 border-b border-dashed border-gray-300 pb-4 sm:flex-row sm:items-center">
            <h3 className="text-xl font-[500] text-[#212121] md:text-2xl">Assets</h3>
            <p className="text-xs font-[500] text-[#555555] md:text-sm">
              Tap the copy icon on each card to copy the Arweave link.
            </p>
          </div>

          <div className="grid grid-cols-1 justify-items-center gap-5 pb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {fileEntries.map(([key, value], index:number) => (
              <LogoCard key={index} id={value.id} alt={key}  />
            ))}
          </div>
          {fileCount === 0 && (
            <div className="rounded-2xl border border-dashed border-[#D5D5D5] px-4 py-10 text-center text-sm text-[#555555]">
              No assets were found in this brandkit.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Brandkit;

const Logo = ({ id, alt }: { id: string; alt: string }) => {
  return (
    <img
      src={`https://arweave.net/${id}`}
      alt={alt}
      className="h-full w-full object-contain"
    />
  );
};

const LogoCard = ({ id, alt }: { id: string; alt: string }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(`https://arweave.net/raw/${text}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1000);
  };

  return (
    <div className="group relative w-full max-w-[280px] rounded-2xl border border-[#D5D5D5] bg-white p-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-24px_rgba(17,24,39,0.55)]">
      <div className="relative flex h-40 items-center justify-center rounded-xl border border-gray-200 p-3">
        <Logo id={id} alt={alt} />
      </div>

      <div className="mt-3 border-t border-dashed border-gray-300 pt-2">
        <p className="truncate text-xs font-[500] text-[#555555]" title={alt}>
          {alt}
        </p>
      </div>

      <div
        onClick={() => copy(id)}
        className="absolute right-5 top-5 h-6 w-6 cursor-pointer rounded-full border border-gray-300 bg-white transition hover:border-black"
      >
        <img
          src={!copySuccess ? copy_logo : copy_success_logo}
          alt="copy"
          className="h-full w-full p-1"
        />
      </div>
    </div>
  );
};
