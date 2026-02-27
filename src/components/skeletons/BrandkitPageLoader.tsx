const BrandkitPageLoader = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] w-full bg-white px-4 py-6 sm:px-6 md:px-10 md:py-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <section className="relative overflow-hidden rounded-3xl border border-[#D5D5D5] bg-white p-4 shadow-[0_18px_60px_-42px_rgba(17,24,39,0.45)] sm:p-7 md:p-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-gray-300 pb-4">
            <p className="rounded-full border border-[#D5D5D5] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#555555]">
              Brandkit
            </p>
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-[180px_1fr] md:gap-8">
            <div className="h-24 w-24 md:h-[180px] md:w-[180px] rounded-2xl border border-[#D5D5D5] p-3">
              <div className="h-full w-full rounded-xl bg-gray-200 animate-pulse" />
            </div>

            <div className="flex min-h-[180px] flex-col justify-between">
              <div>
                <div className="h-9 w-48 rounded bg-gray-200 animate-pulse md:w-72" />
                <div className="mt-4 h-4 w-full max-w-[760px] rounded bg-gray-200 animate-pulse" />
                <div className="mt-2 h-4 w-[86%] max-w-[680px] rounded bg-gray-200 animate-pulse" />
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
            {Array(4)
              .fill("")
              .map((_, index) => (
                <div
                  key={index}
                  className="relative w-full max-w-[280px] rounded-2xl border border-[#D5D5D5] bg-white p-3"
                >
                  <div className="h-40 w-full rounded-xl border border-gray-200 bg-gray-200 animate-pulse" />
                  <div className="mt-3 border-t border-dashed border-gray-300 pt-2">
                    <div className="h-3 w-[75%] rounded bg-gray-200 animate-pulse" />
                  </div>
                  <div className="absolute right-5 top-5 h-6 w-6 rounded-full border border-gray-300 bg-gray-200 animate-pulse" />
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default BrandkitPageLoader
