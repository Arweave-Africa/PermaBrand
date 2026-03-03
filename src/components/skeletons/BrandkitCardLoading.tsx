const BrandkitCardLoading = () => {
  return (
    <div className="w-full max-w-[920px] rounded-2xl border border-[#D5D5D5] bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D5D5D5] bg-[#F9F9F9]">
            <div className="h-5 w-5 rounded bg-[#D5D5D5] animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="h-5 w-44 rounded bg-[#D5D5D5] animate-pulse sm:h-6" />
          </div>
        </div>

        <div className="rounded-full border border-[#D5D5D5] bg-[#F9F9F9] p-1.5">
          <div className="h-3 w-3 rounded-full bg-[#D5D5D5] animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-[#D5D5D5] animate-pulse" />
        <div className="h-4 w-4/5 rounded bg-[#D5D5D5] animate-pulse" />
      </div>
    </div>
  );
};

export default BrandkitCardLoading;
