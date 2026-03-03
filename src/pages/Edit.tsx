import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import { useQueryClient } from "@tanstack/react-query";
import { hb_url, processId, scheduler } from "../utils/constants";
import useBrandkits from "../hooks/useBrandkits";
import BrandkitPageLoader from "../components/skeletons/BrandkitPageLoader";
import NotFound from "./404";
import FilePicker from "../components/FilePicker";
import useUploadSelection from "../hooks/useUploadSelection";
import { UploadFolderError, uploadFilesToArweave } from "../lib/uploadFiles";

const Edit = () => {
  const { url } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { connect } = useConnection();
  const userAddress = useActiveAddress();
  const { brandkits, isBrandkitsLoading } = useBrandkits();
  const brandkit = useMemo(
    () => brandkits?.find((entry) => entry.url === url),
    [brandkits, url],
  );

  const [isLoading, setIsLoading] = useState(false);
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

  const handleUpdateBrandkit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!brandkit) return;

    const formData = new FormData(e.currentTarget);
    const trimmedName = String(formData.get("name") ?? "").trim();
    const trimmedDescription = String(formData.get("description") ?? "").trim();
    const isNameChanged = trimmedName !== brandkit.name;
    const isDescriptionChanged =
      trimmedDescription !== (brandkit.description ?? "").trim();
    const hasNewFiles = selectedFiles.length > 0;

    if (!isNameChanged && !isDescriptionChanged && !hasNewFiles) {
      return toast("Nothing to update");
    }

    setIsLoading(true);
    try {
      const { connect: aoConnect, createDataItemSigner } = await import("@permaweb/aoconnect");
      const ao = aoConnect({
        MODE: "mainnet",
        SCHEDULER: scheduler,
        URL: hb_url,
        signer: createDataItemSigner(window.arweaveWallet),
      });

      let manifestId = "";
      if (hasNewFiles) {
        manifestId = await uploadFilesToArweave({
          files: selectedFiles.map((entry) => entry.file),
          userAddress: userAddress || "",
          insufficientBalanceMessage:
            "Your AR Balance is too low to upload updated assets",
          uploadFailedMessage: "Failed to upload updated assets",
        });
      }

      const tags = [
        { name: "Action", value: "update-brandkit" },
        { name: "Brandkit-Id", value: brandkit.id },
      ];

      if (isNameChanged) {
        tags.push({ name: "Name", value: trimmedName });
      }
      if (isDescriptionChanged) {
        tags.push({ name: "Description", value: trimmedDescription });
      }
      if (manifestId) {
        tags.push({ name: "Arweave-Manifest-Id", value: manifestId });
      }

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

      queryClient.invalidateQueries({ queryKey: ["brandkits-fetch"] });
      toast.success("Brandkit updated");
      const nextUrl = trimmedName.toLowerCase().replace(/\s+/g, "-");
      navigate(`/${nextUrl}`);
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

  if (isBrandkitsLoading) return <BrandkitPageLoader />;
  if (!brandkit) return <NotFound />;

  const isCreator = userAddress === brandkit.creator;

  return (
    <div className="relative min-h-[calc(100vh-var(--navbar-h))] w-full overflow-hidden px-3 py-6 sm:px-8 md:py-10">
      <form
        onSubmit={handleUpdateBrandkit}
        className="relative mx-auto w-full max-w-3xl rounded-2xl border border-[#e5e7eb] bg-white/90 p-4 shadow-[0_16px_60px_-30px_rgba(17,24,39,0.35)] backdrop-blur sm:p-8"
      >
        <button
          type="button"
          onClick={() => navigate(`/${brandkit.url}`)}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d5dbe5] bg-white px-3 py-1.5 text-xs font-semibold text-[#1f2937] transition hover:border-[#9ca7b8]"
        >
          <span aria-hidden="true">←</span>
          Back to Brandkit
        </button>

        <div className="mb-8">
          <p className="mb-2 inline-flex items-center rounded-full border border-[#dbe1ea] bg-[#f8fafc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5f6b7a]">
            Edit Brandkit
          </p>
          <p className="mt-2 text-sm text-[#5a6576]">
            Update metadata and optionally upload a new asset set.
          </p>
        </div>

        {!userAddress && (
          <div className="mb-4 rounded-xl border border-[#e7edf6] bg-[#f8fbff] p-3 text-sm text-[#4f5d73]">
            Connect the creator wallet to update this brandkit.
          </div>
        )}
        {userAddress && !isCreator && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Only the creator wallet can update this brandkit.
          </div>
        )}

        <FilePicker
          files={selectedFiles}
          hasFiles={hasFiles}
          onFileInputChange={handleFileInputChange}
          onDeleteFiles={handleDeleteFiles}
          onRemoveFile={handleRemoveFile}
          emptyTitle="Optional: upload new files to replace existing assets"
          emptyHint="Leave empty to keep current files"
          inputId="edit-files-picker"
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
              defaultValue={brandkit.name}
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
            defaultValue={brandkit.description ?? ""}
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
              disabled={!isCreator}
              className="h-11 w-full rounded-xl bg-[#111827] text-sm font-semibold text-white transition enabled:hover:bg-[#0b1220] disabled:cursor-not-allowed disabled:bg-[#111827]/50 sm:w-52"
            >
              Update Brandkit
            </button>
          )}
          {isLoading && (
            <button
              disabled
              className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#111827]/80 text-sm font-semibold text-white sm:w-52"
            >
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Updating...
            </button>
          )}
        </div>
      </form>
      <Toaster position="top-center" />
    </div>
  );
};

export default Edit;
