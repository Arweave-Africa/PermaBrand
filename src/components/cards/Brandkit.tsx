import { useNavigate } from "react-router-dom";
import { TBrandkit } from "../../types";
import { FC } from "react";
import folder_icon from "../../assets/folder.svg";

const Brandkit: FC<{ brandkit: TBrandkit }> = ({ brandkit }) => {
  const navigate = useNavigate();

  const handleGoToBrandkit = () => {
    navigate(`/brandkit/${brandkit.id}`);
  };

  return (
    <div
      onClick={handleGoToBrandkit}
      className="w-11/12 md:w-[700px] p-4 rounded-lg bg-[#F9F9F9] border border-[#D5D5D5] cursor-pointer hover:border-gray-400 group"
    >
      <div className="flex items-center mb-4">
        <img src={folder_icon} alt="folder" className="h-8" />
        <h3 className="font-[500] ml-3">
          {brandkit.name || "Arweavers to the moon"}
        </h3>
      </div>
      <p className="text-sm font-light overflow-hidden mb-4">
        {brandkit.description || "No Description provided"}
      </p>
    </div>
  );
};

export default Brandkit;
