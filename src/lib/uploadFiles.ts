import { getARBalance, getUploadingPrice } from "./arweave";

export const BALANCE_CHECK_MIN_BYTES = 100 * 1024;

export const filterUploadableFiles = (files: File[]) =>
  files.filter((file) => file.name !== ".DS_Store");

const getTotalFilesSize = (files: File[]) =>
  files.reduce((total, file) => total + file.size, 0);

export class UploadFolderError extends Error {
  code: "INSUFFICIENT_BALANCE" | "UPLOAD_FAILED";

  constructor(
    code: "INSUFFICIENT_BALANCE" | "UPLOAD_FAILED",
    message: string,
  ) {
    super(message);
    this.code = code;
  }
}

type UploadFilesToArweaveParams = {
  files: File[];
  userAddress: string;
  insufficientBalanceMessage: string;
  uploadFailedMessage: string;
};

export const uploadFilesToArweave = async ({
  files,
  userAddress,
  insufficientBalanceMessage,
  uploadFailedMessage,
}: UploadFilesToArweaveParams) => {
  const filteredFiles = filterUploadableFiles(files);

  if (getTotalFilesSize(filteredFiles) >= BALANCE_CHECK_MIN_BYTES) {
    const userBalance = await getARBalance(userAddress);
    const uploadPrice = await getUploadingPrice(filteredFiles);

    if (userBalance < uploadPrice) {
      throw new UploadFolderError(
        "INSUFFICIENT_BALANCE",
        insufficientBalanceMessage,
      );
    }
  }

  const { ArconnectSigner, TurboFactory } = await import("@ardrive/turbo-sdk/web");
  const signer = new ArconnectSigner(window.arweaveWallet);
  const turbo = TurboFactory.authenticated({ signer });

  const { manifestResponse } = await turbo.uploadFolder({
    files: filteredFiles,
  });

  if (!manifestResponse?.id) {
    throw new UploadFolderError("UPLOAD_FAILED", uploadFailedMessage);
  }

  return manifestResponse.id;
};
