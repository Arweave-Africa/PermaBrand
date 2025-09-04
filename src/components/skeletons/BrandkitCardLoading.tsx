import folder_icon from "../../assets/folder.svg";

const BrandkitCardLoading = () => {
  return (
    <div
      className="w-11/12 md:w-[700px] p-4 rounded-lg bg-[#F9F9F9] border border-[#D5D5D5] cursor-pointer hover:border-gray-400 group"
    >
      <div className="flex items-center mb-4">
        <img src={folder_icon} alt="folder" className="h-8" />
        <h3 className="font-[500] ml-3 h-4 w-44 bg-[#D5D5D5] animate-pulse">
        </h3>
      </div>
      <p className="text-sm font-light overflow-hidden mb-4 h-8 w-full bg-[#D5D5D5] animate-pulse">
        
      </p>
    </div>
  );
};

export default BrandkitCardLoading;
