import curved_arrow_icon from "../../assets/curved_arrow.svg";
import { useNavigate } from "react-router-dom";

const CtaButton = () => {
  const navigate = useNavigate();

  return (
    <div className="flex relative justify-center items-center gap-3">
      <img
        src={curved_arrow_icon}
        alt="arrow-to-right"
        className="w-[30px] absolute -top-6 -left-3 animate-bounce"
      />
      <button
        onClick={() => navigate("/create")}
        className="h-8 sm:h-10 min-w-[150px] px-10 rounded-lg border border-black text-white bg-black cursor-pointer hover:text-black hover:bg-white"
      >
        Upload Brandkit
      </button>
      <img
        src={curved_arrow_icon}
        alt="arrow-to-right"
        className="w-[30px] absolute -bottom-6 -right-3 rotate-180 animate-bounce"
      />
    </div>
  );
};

export default CtaButton;
