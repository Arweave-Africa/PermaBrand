import { ChangeEvent, FormEvent, useState } from "react";
import upload_logo from "../assets/upload.svg";
import trash_logo from "../assets/trash.svg";
import toast, { Toaster } from "react-hot-toast";
import { getARBalance, getUploadingPrice } from "../lib/arweave";
import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import {
  createDataItemSigner,
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
      return toast.error("The brandkit folder is missing", { });
    }

    if (!name) {
      return toast.error("Name is missing");
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

      if(!manifestResponse?.id) {
        return toast.error("Failed to upload brandkit. Please try again.")
      }

      const tags = [
        { name: "Action", value: "Add-Brandkit" },
        { name: "Name", value: name },
        { name: "ArweaveId", value: manifestResponse.id },
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
      
      navigate(`/brandkit/${manifestResponse.id}`);
    } catch (error) {
      console.log(error);
      //@ts-ignore
      toast.error(error);
      setIsLoading(false);
    }
  };

  const hasFiles = folderToDisplay.length > 0;

  return (
    <div className="relative min-h-[calc(100vh-var(--navbar-h))] w-full overflow-hidden bg-gradient-to-b from-[#f7f8fa] via-[#f3f4f6] to-white px-3 py-6 sm:px-8 md:py-10">
      <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#dbe8ff]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-[#d8f6e8]/60 blur-3xl" />

      <form
        onSubmit={handleRegisterBrandkit}
        className="relative mx-auto w-full max-w-3xl rounded-2xl border border-[#e5e7eb] bg-white/90 p-4 shadow-[0_16px_60px_-30px_rgba(17,24,39,0.35)] backdrop-blur sm:p-8"
      >
        <div className="mb-8">
          <p className="mb-2 inline-flex items-center rounded-full border border-[#dbe1ea] bg-[#f8fafc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5f6b7a]">
            Create Brandkit
          </p>
          <p className="mt-2 text-sm text-[#5a6576]">
            Add one folder with your logos and brand files. We will preserve it
            on Arweave and register it instantly.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-[#fbfcfd] p-3 sm:p-4">
          {hasFiles && (
            <div className="relative flex h-32 items-center gap-3 overflow-x-auto pr-12">
              {folderToDisplay.map((file, index) => (
                <img
                  key={index}
                  src={file.url}
                  alt={file.name}
                  className="h-24 w-24 shrink-0 rounded-lg border border-[#dde3eb] bg-white p-2 object-contain"
                />
              ))}
              <button
                type="button"
                onClick={handleDeleteFolder}
                className="absolute right-1 top-1 h-8 w-8 rounded-full border border-[#d8dee8] bg-white p-1 transition hover:scale-105 hover:border-red-500"
              >
                <img src={trash_logo} alt="delete folder" className="h-full w-full" />
              </button>
            </div>
          )}

          {!hasFiles && (
            <label
              htmlFor="folder-picker"
              className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#cfd7e3] bg-white text-center transition hover:border-[#9ca7b8] hover:bg-[#fafbff]"
            >
              <img src={upload_logo} alt="upload" className="mb-2 h-7 w-7" />
              <div className="text-sm font-medium text-[#1f2937]">
                Drag and drop or browse your folder
              </div>
              <span className="mt-1 text-xs text-[#748094]">
                PNG, JPG, SVG and more
              </span>
              <span className="mt-3 rounded-lg border border-[#1f2937] px-4 py-1.5 text-xs font-semibold text-[#1f2937]">
                Browse Folder
              </span>
            </label>
          )}

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

        <div className="mt-3 rounded-xl border border-[#e7edf6] bg-[#f8fbff] px-3 py-2 text-sm text-[#4f5d73]">
          Estimated upload cost:{" "}
          <span className="font-semibold text-[#111827]">{uploadingCost} AR</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 text-sm md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium text-[#1f2937]">
              Company / Community Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your company name"
              className="h-11 rounded-xl border border-[#d5dbe5] bg-white px-4 outline-none transition placeholder:text-[#9aa4b3] focus:border-[#111827]"
            />
          </div>
          <div className="md:col-span-1" />
        </div>

        <div className="mt-5 flex flex-col gap-2 text-sm">
          <label htmlFor="description" className="font-medium text-[#1f2937]">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Brief description of your company or community"
            className="h-28 resize-none rounded-xl border border-[#d5dbe5] bg-white px-4 py-3 outline-none transition placeholder:text-[#9aa4b3] focus:border-[#111827]"
          />
        </div>

        <div className="mt-8 flex w-full justify-center sm:justify-end">
          {!isLoading && !userAddress && (
            <button
              type="button"
              onClick={connectWallet}
              className="h-11 w-full rounded-xl bg-[#111827] text-sm font-semibold text-white transition hover:bg-[#0b1220] sm:w-52"
            >
              Connect Wallet
            </button>
          )}
          {!isLoading && userAddress && (
            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-[#111827] text-sm font-semibold text-white transition hover:bg-[#0b1220] sm:w-52"
            >
              Upload Brandkit
            </button>
          )}
          {isLoading && (
            <button
              disabled
              className="h-11 w-full cursor-not-allowed rounded-xl bg-[#111827]/80 text-sm font-semibold text-white sm:w-52"
            >
              Uploading...
            </button>
          )}
        </div>
      </form>
      <Toaster position="top-center"/>
    </div>
  );
};

export default Create;
