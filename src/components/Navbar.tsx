import permabrand_logo from "../assets/logo_black.svg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="h-8 w-full bg-[#F3F3F3] p-2 md:p-8 flex items-center justify-between">
      <Logo />
      <Logo />
    </div>
  );
};

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/")}
      className="flex items-center cursor-pointer"
    >
      <img src={permabrand_logo} alt="permabrand" className="h-4 md:h-6" />
    </div>
  );
};

export default Navbar;
