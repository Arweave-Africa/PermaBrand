import { useNavigate } from "react-router-dom";
import { TBrandkit } from "../../types";
import { FC } from "react";
import folder_icon from "../../assets/folder.svg";
import arrow_right from "../../assets/arrow_right.svg";

const Brandkit: FC<{ brandkit: TBrandkit }> = ({ brandkit }) => {
  const navigate = useNavigate();
  const title = brandkit.name.trim();
  const description = brandkit.description?.trim() || "No description provided.";

  const handleGoToBrandkit = () => {
    navigate(`/${brandkit.url}`);
  };

  return (
    <div
      onClick={handleGoToBrandkit}
      className="group w-11/12 cursor-pointer rounded-2xl border border-[#D5D5D5] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#B8B8B8] hover:shadow-[0_16px_40px_-30px_rgba(17,24,39,0.7)] md:w-[700px]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#DDE1E5] bg-[#F9F9F9]">
            <img src={folder_icon} alt="folder" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-[500] text-[#111827] sm:text-lg">
              {title}
            </h3>
          </div>
        </div>

        <div className="rounded-full border border-[#D5D5D5] bg-[#F9F9F9] p-1.5 transition group-hover:border-[#9CA3AF]">
          <img src={arrow_right} alt="open brandkit" className="h-3 w-3" />
        </div>
      </div>

      <p className="mb-5 max-h-12 overflow-hidden text-sm font-light leading-relaxed text-[#4B5563]">
        {description}
      </p>
    </div>
  );
};

export default Brandkit;
