import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import { useQueryClient } from "@tanstack/react-query";
import upload_logo from "../assets/upload.svg";
import trash_logo from "../assets/trash.svg";
import { getARBalance, getUploadingPrice } from "../lib/arweave";
import { hb_url, processId, scheduler } from "../utils/constants";
import useBrandkits from "../hooks/useBrandkits";
import BrandkitPageLoader from "../components/skeletons/BrandkitPageLoader";
import NotFound from "./404";

type FileToDisplay = { file: File; url: string; name: string; key: string };

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

  const [selectedFiles, setSelectedFiles] = useState<Array<FileToDisplay>>([]);
  const [uploadingCost, setUploadingCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const selectedFilesRef = useRef<Array<FileToDisplay>>([]);

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
      files.map((entry) => entry.file),
    );
    setUploadingCost(uploadingPrice);
  };

  const handleBrandkitFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) {
      e.target.value = "";
      return;
    }

    const filteredFiles = Array.from(files).filter(
      (file) => file.name !== ".DS_Store",
    );
    const newEntries = filteredFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      key: getFileKey(file),
    }));

    const existingKeys = new Set(selectedFiles.map((entry) => entry.key));
    const uniqueNewEntries = newEntries.filter(
      (entry) => !existingKeys.has(entry.key),
    );
    const nextFiles = [...selectedFiles, ...uniqueNewEntries];

    setSelectedFiles(nextFiles);
    await updateUploadingCost(nextFiles);
    e.target.value = "";
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
        const { ArconnectSigner, TurboFactory } = await import("@ardrive/turbo-sdk/web");
        const userBalance = await getARBalance(userAddress || "");
        const price = await getUploadingPrice(
          selectedFiles.map((entry) => entry.file),
        );

        if (userBalance < price) {
          setIsLoading(false);
          return toast.error(
            "Your AR Balance is too low to upload updated assets",
          );
        }

        const signer = new ArconnectSigner(window.arweaveWallet);
        const turbo = TurboFactory.authenticated({ signer });
        const filteredFiles = selectedFiles
          .map((entry) => entry.file)
          .filter((file) => file.name !== ".DS_Store");

        const { manifestResponse } = await turbo.uploadFolder({
          files: filteredFiles,
        });

        if (!manifestResponse?.id) {
          return toast.error("Failed to upload updated assets");
        }
        manifestId = manifestResponse.id;
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
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isBrandkitsLoading) return <BrandkitPageLoader />;
  if (!brandkit) return <NotFound />;

  const isCreator = userAddress === brandkit.creator;
  const hasFiles = selectedFiles.length > 0;

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
                className="shrink-0 cursor-pointer rounded-lg border border-dashed border-[#cfd7e3] bg-white px-3 py-2 text-xs font-semibold text-[#1f2937] transition hover:border-[#9ca7b8]"
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
                Optional: upload new files to replace existing assets
              </div>
              <span className="mt-1 text-xs text-[#748094]">
                Leave empty to keep current files
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
