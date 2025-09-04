const BrandkitPageLoader = () => {
  return (
    <div className="min-h[calc(100vh-5rem)">
      <div className="bg-[#F3F3F3] w-full py-5 lg:py-10 px-[5%] md:px-[10%]">
        <div className="flex items-start md:items-center">
          <div className="h-8 w-8 md:h-24 md:w-24 lg:h-40 lg:w-40 mr-2 md:mr-10 rounded-lg bg-gray-200 animate-pulse p-2">
            
          </div>
          <div>
            <h1 className="h-6 w-40 mt-0 md:mt-4 mb-4 bg-gray-200 animate-pulse">
              
            </h1>
            <p className="h-8  w-[300px] sm:w-[500px]  bg-gray-200 animate-pulse">
             
            </p>
          </div>
        </div>
      </div>
      <h3 className="w-full text-center py-4 text-lg md:text-2xl font-[500]">
        Assets
      </h3>
      <div className="w-full flex justify-center pt-4 md:pt-10">
        <div className="max-w-[1500px] flex flex-wrap justify-center gap-x-16 gap-y-8 pb-10 px-4">
          {Array(4).fill("").map((_, index) => (
            <div key={index} className="h-28 w-64 md:h-34 md:w-72 bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandkitPageLoader
