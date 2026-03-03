import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getUploadingPrice } from "../lib/arweave";
import { filterUploadableFiles } from "../lib/uploadFiles";

export type FileToDisplay = { file: File; url: string; name: string; key: string };

const getFileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;
const MIN_PRICE_CALCULATION_BYTES = 100 * 1024;

export default function useUploadSelection() {
  const [selectedFiles, setSelectedFiles] = useState<Array<FileToDisplay>>([]);
  const [uploadingCost, setUploadingCost] = useState(0);
  const selectedFilesRef = useRef<Array<FileToDisplay>>([]);

  useEffect(() => {
    selectedFilesRef.current = selectedFiles;
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      selectedFilesRef.current.forEach((entry) => URL.revokeObjectURL(entry.url));
    };
  }, []);

  const updateUploadingCost = async (files: Array<FileToDisplay>) => {
    if (files.length === 0) {
      setUploadingCost(0);
      return;
    }

    const totalSize = files.reduce((sum, entry) => sum + entry.file.size, 0);
    if (totalSize < MIN_PRICE_CALCULATION_BYTES) {
      setUploadingCost(0);
      return;
    }

    const uploadingPrice = await getUploadingPrice(
      files.map((entry) => entry.file),
    );
    setUploadingCost(uploadingPrice);
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files || files.length === 0) {
      e.target.value = "";
      return;
    }

    const filteredFiles = filterUploadableFiles(Array.from(files));
    const newEntries = filteredFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      key: getFileKey(file),
    }));

    const existingKeys = new Set(selectedFiles.map((entry) => entry.key));
    const acceptedEntries: Array<FileToDisplay> = [];
    const rejectedEntries: Array<FileToDisplay> = [];

    newEntries.forEach((entry) => {
      if (existingKeys.has(entry.key)) {
        rejectedEntries.push(entry);
        return;
      }

      acceptedEntries.push(entry);
      existingKeys.add(entry.key);
    });

    rejectedEntries.forEach((entry) => URL.revokeObjectURL(entry.url));

    const nextFiles = [...selectedFiles, ...acceptedEntries];
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

  return {
    selectedFiles,
    uploadingCost,
    hasFiles: selectedFiles.length > 0,
    handleFileInputChange,
    handleDeleteFiles,
    handleRemoveFile,
  };
}
