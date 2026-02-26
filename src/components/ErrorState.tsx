type ErrorStateProps = {
  title?: string;
  message: string;
};

const ErrorState = ({ title = "Something went wrong", message }: ErrorStateProps) => {
  return (
    <div className="mx-auto flex w-11/12 max-w-[700px] flex-col items-center rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center">
      <h3 className="text-base font-semibold text-red-700">{title}</h3>
      <p className="mt-2 text-sm text-red-600">{message}</p>
    </div>
  );
};

export default ErrorState;
