import Arweave from "arweave";

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

async function getFolderSize(folder: FileList) {
  let totalSize = 0;

  async function calculateSize(folder: FileList) {
    const filteredFolder = Object.values(folder).filter(
      //@ts-ignore
      (value, index) => value.name !== ".DS_Store",
    );

    filteredFolder.forEach((entry) => {
      totalSize += entry.size;
    });
  }

  await calculateSize(folder);
  return totalSize;
}

export const getUploadingPrice = async (folder: FileList) => {
  const totalFolderSize = await getFolderSize(folder);
  const price = await arweave.transactions.getPrice(totalFolderSize);
  return Number(arweave.ar.winstonToAr(price));
};

export const getARBalance = async (address: string) => {
  const balance = await arweave.wallets.getBalance(address);
  return Number(arweave.ar.winstonToAr(balance));
};
