import Arweave from "arweave";

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

async function getFilesSize(files:File[]) {

  if (!Array.isArray(files)) {
    throw new Error("Expected an array of files");
  }

  return files.reduce((total, file) => {
    if (!file || typeof file.size !== "number") {
      throw new Error("Each item must have a numeric 'size' property");
    }
    return total + file.size;
  }, 0);
}

export const getUploadingPrice = async (files: File[]) => {
  const totalFilesSize = await getFilesSize(files);
  const price = await arweave.transactions.getPrice(totalFilesSize);
  return Number(arweave.ar.winstonToAr(price));
};

export const getARBalance = async (address: string) => {
  const balance = await arweave.wallets.getBalance(address);
  return Number(arweave.ar.winstonToAr(balance));
};
