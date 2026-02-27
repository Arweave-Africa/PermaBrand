import { useNavigate } from "react-router-dom";
import { TBrandkit } from "../../types";
import { FC } from "react";
import folder_icon from "../../assets/folder.svg";
import arrow_right from "../../assets/arrow_right.svg";

const Brandkit: FC<{ brandkit: TBrandkit }> = ({ brandkit }) => {
  const navigate = useNavigate();
  const name = brandkit.name.trim();
  const description = brandkit.description?.trim() || "No description provided.";

  const handleGoToBrandkit = () => {
    navigate(`/${brandkit.url}`);
  };

  return (
    <button
      type="button"
      onClick={handleGoToBrandkit}
      className="group w-full max-w-[920px] cursor-pointer rounded-2xl border border-[#D5D5D5] bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#B8B8B8] hover:shadow-[0_16px_40px_-30px_rgba(17,24,39,0.7)] focus:outline-none focus:ring-2 focus:ring-[#212121] focus:ring-offset-2 sm:p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D5D5D5] bg-[#F9F9F9]">
            <img src={folder_icon} alt="" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-[500] text-[#212121] sm:text-lg">
              {name}
            </h3>
          </div>
        </div>

        <div className="rounded-full border border-[#D5D5D5] bg-[#F9F9F9] p-1.5 transition group-hover:border-[#9CA3AF] group-hover:bg-white">
          <img src={arrow_right} alt="open brandkit" className="h-3 w-3" />
        </div>
      </div>

      <p className="mb-4 max-h-12 overflow-hidden text-sm font-light leading-relaxed text-[#4B5563]">
        {description}
      </p>
    </button>
  );
};

export default Brandkit;
