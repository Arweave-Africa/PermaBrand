import { ChangeEvent, FormEvent, useState } from "react";
import upload_logo from "../assets/upload.svg";
import trash_logo from "../assets/trash.svg";
import toast, { Toaster } from "react-hot-toast";
import { getARBalance, getUploadingPrice } from "../lib/arweave";
import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import {
  createDataItemSigner,
  dryrun,
  message,
  result,
} from "@permaweb/aoconnect";
import { processId } from "../utils/constants";
import { ArconnectSigner, TurboFactory } from "@ardrive/turbo-sdk/web";
import { useNavigate } from "react-router-dom";

type FileToDisplay = { url: string; name: any };

const Create = () => {
  const [folder, setFolder] = useState<FileList>();
  const [isLoading, setIsLoading] = useState(false);
  const [folderToDisplay, setFolderToDisplay] = useState<Array<FileToDisplay>>(
    [],
  );
  const userAddress = useActiveAddress();
  const { connect } = useConnection();
  const [uploadingCost, setUploadingCost] = useState(0);
  const navigate = useNavigate();

  const handleBrandKitFolderUpload = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { files } = e.target;
    setFolder(files || ({} as FileList));
    const filteredFolder = Object.keys(files!).filter(
      //@ts-ignore
      (key, index) => files![key].name !== ".DS_Store",
    );
    const transformedFolder = filteredFolder.map((key) => {
      //@ts-ignore
      const localPath = URL.createObjectURL(files![key]);
      const file = {
        url: localPath,
        //@ts-ignore
        name: files![key].name,
      };
      return file;
    });
    setFolderToDisplay(transformedFolder);
    const uploadingPrice = await getUploadingPrice(files!);
    setUploadingCost(uploadingPrice);
  };

  const connectWallet = async () => {
    await connect();
  };

  const handleDeleteFolder = () => {
    setFolder({} as FileList);
    setFolderToDisplay([]);
    setUploadingCost(0);
  };

  const handleRegisterBrandkit = async (e: FormEvent) => {
    e.preventDefault();
    //@ts-ignore
    const formData = new FormData(e.target);

    const name = formData.get("name");
    const description = formData.get("description");

    if (!folder) {
      return toast("The brandkit folder is missing");
    }

    if (!name) {
      return toast("Name is missing");
    }

    setIsLoading(true);
    await getUploadingPrice(folder);

    try {
      const userBalance = await getARBalance(userAddress || "");
      const uploadingPrice = await getUploadingPrice(folder);

      if (userBalance < uploadingPrice) {
        setIsLoading(false);
        return toast(
          "Your AR Balance is too low to upload your Brandkit on Arweave",
        );
      }

      const signer = new ArconnectSigner(window.arweaveWallet);
      const turbo = TurboFactory.authenticated({ signer });
      const filteredFolder = Object.values(folder).filter(
        //@ts-ignore
        (value, index) => {
          return value.name !== ".DS_Store";
        },
      );

      const { manifestResponse } = await turbo.uploadFolder({
        files: filteredFolder.map((file) => file),
      });

      const tags = [
        { name: "Action", value: "Add-Brandkit" },
        { name: "Name", value: name },
        { name: "ArweaveId", value: manifestResponse?.id },
      ];

      if (description) {
        tags.push({ name: "Description", value: description });
      }
      const messageId = await message({
        process: processId,
        signer: createDataItemSigner(window.arweaveWallet),
        tags,
      });

      /*let { Messages } = */ await result({
        message: messageId,
        process: processId,
      });
      //const res = JSON.parse(Messages[0].Data)
      toast.success("Brandkit uploaded and registered! Congratulations!");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsLoading(false);
      navigate("/");
      /*navigate(`/brandkit/${res.creator}`, { 
        state:{
          brandkit:res, 
          files: []
        }
      })*/
    } catch (error) {
      console.log(error);
      //@ts-ignore
      toast.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-var(--navbar-h))] w-full flex justify-center py-3 px-2 sm:px-12 md:py-8">
      <form
        onSubmit={handleRegisterBrandkit}
        className="w-full lg:w-10/12 xl:w-1/2 h-full flex flex-col items-center"
      >
        <h2 className="text-xl mb-4 w-[350px] sm:w-[500px] md:w-[600px] md:text-2xl md:mb-10">
          Upload Kits
        </h2>
        <div>
          <div className="text-sm md:text-xl mb-2 text-gray-500">
            Upload Your Brand Assets
          </div>
          <div className="text-sm font-light text-gray-500 mb-2">
            Put all your images in one folder and just upload the folder
          </div>
          <div className="w-[350px] h-[100px] sm:w-[500px] md:w-[600px] rounded-xl border-[1px] border-dashed border-[var(--light-gray)]">
            {folderToDisplay?.length > 0 && (
              <div className="h-full w-full relative flex gap-4 items-center px-2 overflow-x-scroll">
                {folderToDisplay.map((file, index) => (
                  <img
                    key={index}
                    src={file.url}
                    alt={file.name}
                    className="h-20 rounded-sm border-[1px] border-gray-200 p-2"
                  />
                ))}
                <div
                  onClick={handleDeleteFolder}
                  className="h-6 w-6 rounded-[50%] hover:border-red-500 cursor-pointer hover:scale-105 transition-all ease-in-out delay-100  absolute top-1 right-2 border-[1px] border-gray-200"
                >
                  <img src={trash_logo} alt="delete" className="p-[2px]" />
                </div>
              </div>
            )}
            {folderToDisplay?.length == 0 && (
              <div className="h-full w-full">
                <label htmlFor="folder-picker" className="cursor-pointer">
                  <div className="flex flex-col h-full w-full gap-2 items-center justify-center">
                    <img src={upload_logo} alt="upload" className="h-6 w-6" />
                    <span className="text-xs text-gray-400">
                      .SVG, .PNG, .JPG
                    </span>
                    <div className="text-[#212121] border border-[#212121] px-4 py-1 rounded-xl text-xs">
                      Browse Folder
                    </div>
                  </div>
                </label>
                <input
                  onChange={handleBrandKitFolderUpload}
                  type="file"
                  accept="image/*"
                  //@ts-expect-error
                  directory=""
                  webkitdirectory=""
                  multiple
                  hidden
                  id="folder-picker"
                />
              </div>
            )}
          </div>
          <div className="my-2 text-gray-500 text-sm font-light">
            <i>
              Your uploading cost is{" "}
              <span className="text-black font-semibold">{uploadingCost}</span>{" "}
              AR
            </i>
          </div>
        </div>
        <div className="mt-6 text-sm">
          <div className="text-sm md:text-xl mb-2  text-gray-500">
            Add details
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-10">
            <div className="flex flex-col gap-1 md:gap-2 text-sm">
              <label htmlFor="">Company / Community Name</label>
              <input
                name="name"
                type="text"
                placeholder="Enter Your Company Name"
                className="h-8 pl-4 w-[350px] sm:w-[500px] md:w-[300px] outline-none border-[1px] border-[var(--light-gray)] rounded-xl"
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-1 md:gap-2">
            <label htmlFor="">Description (optional)</label>
            <textarea
              name="description"
              placeholder="Brief description of your company/community"
              className="h-20 w-[350px] sm:w-[500px] md:w-[600px] pl-4 pt-2 outline-none border-[1px] border-[var(--light-gray)] rounded-xl"
            />
          </div>
        </div>
        <div className="flex w-full justify-center mt-10">
          {!isLoading && !userAddress && (
            <button
              onClick={connectWallet}
              className="bg-[#212121] text-white rounded-xl h-8 w-[200px] cursor-pointer hover:scale-105 transition-all delay-75"
            >
              Connect Wallet
            </button>
          )}
          {!isLoading && userAddress && (
            <button
              type="submit"
              className="bg-[#212121] text-white rounded-xl h-8 w-[200px] cursor-pointer hover:scale-105 transition-all delay-75"
            >
              Upload Brandkit
            </button>
          )}
          {isLoading && (
            <button
              disabled
              className="bg-[#212121] text-white rounded-xl h-8 w-[200px] hover:scale-105 transition-all delay-75 cursor-not-allowed"
            >
              loading...
            </button>
          )}
        </div>
      </form>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Create;
