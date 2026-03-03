import { FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import { hb_url, processId, scheduler } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import FilePicker from "../components/FilePicker";
import useUploadSelection from "../hooks/useUploadSelection";
import { UploadFolderError, uploadFilesToArweave } from "../lib/uploadFiles";

const Create = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userAddress = useActiveAddress();
  const { connect } = useConnection();
  const navigate = useNavigate();
  const {
    selectedFiles,
    uploadingCost,
    hasFiles,
    handleFileInputChange,
    handleDeleteFiles,
    handleRemoveFile,
  } = useUploadSelection();

  const connectWallet = async () => {
    await connect();
  };

  const handleRegisterBrandkit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (selectedFiles.length === 0) {
      return toast.error("No files selected");
    }

    if (!name) {
      return toast.error("Name is missing");
    }

    setIsLoading(true);

    try {
      const [{ connect: aoConnect, createDataItemSigner }, manifestId] = await Promise.all([
        import("@permaweb/aoconnect"),
        uploadFilesToArweave({
          files: selectedFiles.map((entry) => entry.file),
          userAddress: userAddress || "",
          insufficientBalanceMessage:
            "Your AR Balance is too low to upload your Brandkit on Arweave",
          uploadFailedMessage: "Failed to upload brandkit. Please try again.",
        }),
      ]);

      const tags = [
        { name: "Action", value: "add-brandkit" },
        { name: "Name", value: name },
        { name: "Arweave-Manifest-Id", value: manifestId },
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
        tags,
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
      if (error instanceof UploadFolderError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

        <FilePicker
          files={selectedFiles}
          hasFiles={hasFiles}
          onFileInputChange={handleFileInputChange}
          onDeleteFiles={handleDeleteFiles}
          onRemoveFile={handleRemoveFile}
          emptyTitle="Choose one or multiple files to upload"
          emptyHint="PNG, JPG, SVG and more"
          inputId="create-files-picker"
        />

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
              className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#111827]/80 text-sm font-semibold text-white sm:w-52"
            >
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
