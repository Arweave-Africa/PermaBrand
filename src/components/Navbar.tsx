import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import permabrand_logo from "../assets/logo_black.svg";
import { truncate } from "../utils";
//import Profile from "./modals/Profile";
//import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { connect, connected } = useConnection();
  const activeAddress = useActiveAddress();
  const navigate = useNavigate()
  //const [toggleProfileModal, setToggleProfileModal] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-20 w-full bg-[#F3F3F3] px-2 md:px-12 flex items-center justify-between">
      <div onClick={() => navigate("/")} className="flex items-center cursor-pointer">
        <img
          src={permabrand_logo}
          alt="permabrand"
          className="h-12 w-12 text-[#212121] mr-2"
        />
        <h1 className="hidden sm:flex font-semibold text-3xl tracking-[3px]">
          PermaBrand
        </h1>
      </div>
      {!connected && (
        <button
          onClick={handleConnect}
          className="px-2 py-1 text-[#212121] rounded-md border border-[#212121] hover:bg-[#212121] hover:text-white cursor-pointer"
        >
          Connect Wallet
        </button>
      )}
      {connected && (
        <div
          //onClick={() => setToggleProfileModal(true)}
          className="px-2 py-1 text-[#212121] rounded-md border border-[#212121] hover:bg-[#212121] hover:text-white cursor-pointer"
        >
          {truncate(activeAddress!)}
        </div>
      )}
      {/*toggleProfileModal && <Profile closeModal={setToggleProfileModal} />*/}
    </div>
  );
};

export default Navbar;
