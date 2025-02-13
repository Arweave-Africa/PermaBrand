import Arweave from "arweave";

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

export async function arrayBufferToFileList(arrayBuffer: ArrayBuffer): Promise<FileList> {
  const dataView = new DataView(arrayBuffer);
  
  // Read metadata length (first 4 bytes)
  const metadataLength = dataView.getUint32(0, true);

  // Extract metadata
  const metadataBuffer = new Uint8Array(arrayBuffer, 4, metadataLength);
  const metadataString = new TextDecoder().decode(metadataBuffer);
  const metadata = JSON.parse(metadataString);

  const dataTransfer = new DataTransfer();

  let offset = 4 + metadataLength;
  for (const { name, type, size } of metadata) {
    const fileBuffer = arrayBuffer.slice(offset, offset + size);
    const file = new File([fileBuffer], name, { type });
    dataTransfer.items.add(file);
    offset += size;
  }

  return dataTransfer.files;
}



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

async function folderToArrayBuffer(fileList: FileList): Promise<ArrayBuffer> {
  const files = Array.from(fileList);

  // Read all files as ArrayBuffer and store metadata
  const buffers = await Promise.all(
    files.map(async (file) => ({
      name: file.name,
      type: file.type,
      buffer: await file.arrayBuffer(),
    }))
  );

  // Create metadata JSON
  const metadata = JSON.stringify(
    buffers.map(({ name, type, buffer }) => ({
      name,
      type,
      size: buffer.byteLength, // Store size to split later
    }))
  );

  // Convert metadata to ArrayBuffer
  const encoder = new TextEncoder();
  const metadataBuffer = encoder.encode(metadata);

  // Combine metadata length, metadata, and file data
  const totalLength =
    4 + metadataBuffer.byteLength + buffers.reduce((sum, { buffer }) => sum + buffer.byteLength, 0);
  const combinedBuffer = new ArrayBuffer(totalLength);
  const combinedView = new Uint8Array(combinedBuffer);

  // Store metadata length (first 4 bytes)
  new DataView(combinedBuffer).setUint32(0, metadataBuffer.byteLength, true);

  // Store metadata
  combinedView.set(metadataBuffer, 4);

  // Store file data
  let offset = 4 + metadataBuffer.byteLength;
  for (const { buffer } of buffers) {
    combinedView.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  return combinedBuffer;
}

export const uploadToArweave = async (folder: FileList, name: any) => {
  const data = await folderToArrayBuffer(folder);
  const transaction = await arweave.createTransaction({ data });

  transaction.addTag("App", "Permabrand");
  transaction.addTag("Company/Community", name);
  await arweave.transactions.sign(transaction);
  const uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
  }
  return transaction.id;
};
