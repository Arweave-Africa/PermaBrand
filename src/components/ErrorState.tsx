type ErrorStateProps = {
  title?: string;
  message: string;
};

const ErrorState = ({ title = "Something went wrong", message }: ErrorStateProps) => {
  return (
    <div className="relative mx-auto w-11/12 max-w-[760px] overflow-hidden rounded-2xl border border-[#D5D5D5] bg-[linear-gradient(135deg,#ffffff_0%,#f6f8fb_45%,#eef3ff_100%)] px-5 py-7 text-center shadow-[0_20px_50px_-40px_rgba(17,24,39,0.7)]">
      <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-[#dbe8ff]/60 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-8 h-28 w-28 rounded-full bg-[#dff5ea]/70 blur-2xl" />

      <div className="relative mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#CAD5E4] bg-white text-lg text-[#1F2937]">
        !?
      </div>

      <h3 className="relative text-base font-semibold tracking-wide text-[#111827] sm:text-lg">
        {title}
      </h3>
      <p className="relative mx-auto mt-2 max-w-[560px] text-sm leading-relaxed text-[#4B5563]">
        {message}
      </p>
    </div>
  );
};

export default ErrorState;
