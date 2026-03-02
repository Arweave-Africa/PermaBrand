import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import upload_logo from "../assets/upload.svg";
import trash_logo from "../assets/trash.svg";
import toast, { Toaster } from "react-hot-toast";
import { getARBalance, getUploadingPrice } from "../lib/arweave";
import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import { hb_url, processId, scheduler } from "../utils/constants";
import { useNavigate } from "react-router-dom";

type FileToDisplay = { file: File; url: string; name: string; key: string };

const Create = () => {
  const [selectedFiles, setSelectedFiles] = useState<Array<FileToDisplay>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userAddress = useActiveAddress();
  const { connect } = useConnection();
  const [uploadingCost, setUploadingCost] = useState(0);
  const selectedFilesRef = useRef<Array<FileToDisplay>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    selectedFilesRef.current = selectedFiles;
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      selectedFilesRef.current.forEach((entry) => URL.revokeObjectURL(entry.url));
    };
  }, []);

  const getFileKey = (file: File) =>
    `${file.name}-${file.size}-${file.lastModified}`;

  const updateUploadingCost = async (files: Array<FileToDisplay>) => {
    if (files.length === 0) {
      setUploadingCost(0);
      return;
    }
    const uploadingPrice = await getUploadingPrice(
      files.map((entry) => entry.file)
    );
    setUploadingCost(uploadingPrice);
  };

  const handleBrandkitFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) {
      e.target.value = "";
      return;
    }

    const filteredFiles = Array.from(files).filter((file) => file.name !== ".DS_Store");
    const newEntries = filteredFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      key: getFileKey(file),
    }));

    const existingKeys = new Set(selectedFiles.map((entry) => entry.key));
    const uniqueNewEntries = newEntries.filter((entry) => !existingKeys.has(entry.key));
    const nextFiles = [...selectedFiles, ...uniqueNewEntries];

    setSelectedFiles(nextFiles);
    await updateUploadingCost(nextFiles);
    e.target.value = "";
  };

  const connectWallet = async () => {
    await connect();
  };

  const handleDeleteFiles = () => {
    selectedFiles.forEach((entry) => URL.revokeObjectURL(entry.url));
    setSelectedFiles([]);
    setUploadingCost(0);
  };

  const handleRemoveFile = async (key: string) => {
    const fileToRemove = selectedFiles.find((entry) => entry.key === key);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }

    const nextFiles = selectedFiles.filter((entry) => entry.key !== key);
    setSelectedFiles(nextFiles);
    await updateUploadingCost(nextFiles);
  };

  const handleRegisterBrandkit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    const description = formData.get("description");

    if (selectedFiles.length === 0) {
      return toast.error("No files selected");
    }

    if (!name) {
      return toast.error("Name is missing");
    }

    setIsLoading(true);

    try {
      const userBalance = await getARBalance(userAddress || "");
      const uploadingPrice = await getUploadingPrice(
        selectedFiles.map((entry) => entry.file)
      );

      if (userBalance < uploadingPrice) {
        setIsLoading(false);
        return toast.error(
          "Your AR Balance is too low to upload your Brandkit on Arweave",
        );
      }

      const [{ ArconnectSigner, TurboFactory }, { connect: aoConnect, createDataItemSigner }] =
        await Promise.all([
          import("@ardrive/turbo-sdk/web"),
          import("@permaweb/aoconnect"),
        ]);

      const signer = new ArconnectSigner(window.arweaveWallet);
      const turbo = TurboFactory.authenticated({ signer });
      const filteredFiles = selectedFiles
        .map((entry) => entry.file)
        .filter((file) => {
          return file.name !== ".DS_Store";
        },
      );

      const { manifestResponse } = await turbo.uploadFolder({
        files: filteredFiles
      });

      if (!manifestResponse?.id) {
        return toast.error("Failed to upload brandkit. Please try again.");
      }

      const tags = [
        { name: "Action", value: "add-brandkit" },
        { name: "Name", value: name },
        { name: "Arweave-Manifest-Id", value: manifestResponse.id },
      ];

      if (description) {
        tags.push({ name: "Description", value: description });
      }

      const ao = aoConnect({
        MODE: "mainnet",
        SCHEDULER: scheduler,
        URL: hb_url,
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const messageId = await ao.message({
        process: processId,
        tags
      });

      const res = await ao.result({
        message: messageId,
        process: processId,
      });

      if (res.Error) {
        throw new Error(res.Error);
      }

      toast.success("Brandkit uploaded and registered! Congratulations!");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    finally {
      setIsLoading(false);
    }
  };

  const hasFiles = selectedFiles.length > 0;

  return (
    <div className="relative min-h-[calc(100vh-var(--navbar-h))] w-full overflow-hidden px-3 py-6 sm:px-8 md:py-10">
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
            Select your asset(s). We will preserve them on
            Arweave and register them instantly.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-[#fbfcfd] p-3 sm:p-4">
          {hasFiles && (
            <div className="relative flex h-32 items-center gap-3 overflow-x-auto pr-12">
              {selectedFiles.map((file) => (
                <div key={file.key} className="relative h-24 w-24 shrink-0">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-24 w-24 rounded-lg border border-[#dde3eb] bg-white p-2 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.key)}
                    className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full border border-[#d8dee8] bg-white text-xs leading-none text-[#5a6576] transition hover:border-red-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label
                htmlFor="files-picker"
                className="shrink-0 rounded-lg border border-dashed border-[#cfd7e3] bg-white px-3 py-2 text-xs font-semibold text-[#1f2937] cursor-pointer transition hover:border-[#9ca7b8]"
              >
                Add more files
              </label>
              <button
                type="button"
                onClick={handleDeleteFiles}
                className="absolute right-1 top-1 h-8 w-8 rounded-full border border-[#d8dee8] bg-white p-1 transition hover:scale-105 hover:border-red-500"
              >
                <img src={trash_logo} alt="delete files" className="h-full w-full" />
              </button>
            </div>
          )}

          {!hasFiles && (
            <label
              htmlFor="files-picker"
              className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#cfd7e3] bg-white text-center transition hover:border-[#9ca7b8] hover:bg-[#fafbff]"
            >
              <img src={upload_logo} alt="upload" className="mb-2 h-7 w-7" />
              <div className="text-sm font-medium text-[#1f2937]">
                Choose one or multiple files to upload
              </div>
              <span className="mt-1 text-xs text-[#748094]">
                PNG, JPG, SVG and more
              </span>
              <span className="mt-3 rounded-lg border border-[#1f2937] px-4 py-1.5 text-xs font-semibold text-[#1f2937]">
                Browse Files
              </span>
            </label>
          )}

          <input
            onChange={handleBrandkitFileUpload}
            type="file"
            accept="image/*"
            multiple
            hidden
            id="files-picker"
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
              className="h-11 w-full cursor-not-allowed rounded-xl bg-[#111827]/80 text-sm font-semibold text-white sm:w-52 flex items-center justify-center gap-2"
            >
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading...
            </button>
          )}
        </div>
      </form>
      <Toaster position="top-center" />
    </div>
  );
};

export default Create;
