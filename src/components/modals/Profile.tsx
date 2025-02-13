import ArweaveImage from "../ArweaveImage";
import arrow_right from "../../assets/arrow_right.svg";
import loader from "../../assets/loader.svg";
import { Dispatch, SetStateAction, useState } from "react";
import { useConnection } from "@arweave-wallet-kit/react";

const Profile = ({
  closeModal,
}: {
  closeModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { disconnect } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const profile = {
    logo: "",
    name: "Autonomous Finance",
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await disconnect();
      closeModal(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => closeModal(false)}
      className="h-screen w-screen fixed inset-0 bg-black/40 z-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-12 top-20 py-10 w-[300px] flex flex-col items-center bg-white rounded-lg"
      >
        <div className="h-20 w-20 border border-black rounded-[50%]">
          <ArweaveImage
            src={`https://arweave.net/${profile.logo}`}
            alt={profile.name}
          />
        </div>
        <div className="text-gray-500 text-sm">{profile.name}</div>
        <div className="group flex items-center my-10 cursor-pointer">
          <span className="group-hover:text-blue-500">Visit Profile</span>{" "}
          <img
            src={arrow_right}
            color="blue"
            alt="arrow right"
            className="h-4 w-6 group-hover:scale-110 group-hover:ml-[2px] transition-all ease-in-out delay-100"
          />
        </div>
        {!isLoading && (
          <button
            onClick={handleLogout}
            className="rounded-lg flex items-center justify-center h-7 w-[120px] cursor-pointer text-red-500 hover:text-white hover:bg-red-500 border border-red-500"
          >
            Logout
          </button>
        )}
        {isLoading && (
          <button
            disabled
            className="rounded-lg flex items-center justify-center h-7 w-[120px] cursor-not-allowed border border-gray-300"
          >
            <img
              src={loader}
              color="blue"
              alt="arrow right"
              className="h-4 w-4 animate-spin"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
