
const BrandkitCardLoading = () => {

  return (
    <div className="w-[300px] p-4 rounded-lg bg-[#F9F9F9] border border-[#D5D5D5]">
        <div className="w-full h-20 bg-gray-200 animate-pulse rounded-lg flex justify-center">

        </div>
        <h3 className="font-[500] my-4 w-[150px] ml-[70px] h-4 bg-gray-200 animate-pulse text-center"></h3>
        <div className="h-16 w-full mb-4">
            <div className="h-4 w-full bg-gray-200 animate-pulse mb-1"></div>
            <div className="h-4 w-full bg-gray-200 animate-pulse mb-1"></div>
            <div className="h-4 w-full bg-gray-200 animate-pulse mb-1"></div>
        </div>
        <div className="flex w-full justify-end">
        <button className="h-6 w-[60px] text-sm font-light cursor-pointer">
            View kit
        </button>
        </div>
    </div>
  )
}

export default BrandkitCardLoading
