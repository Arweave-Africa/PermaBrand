import { useQuery } from "@tanstack/react-query";
import { arrayBufferToFileList } from "../lib/arweave";

const useFolder = (txid: string) => {
    const {
        isLoading,
        data: files,
        refetch,
      } = useQuery({
    queryKey: ["brandkit-folder", txid],
    queryFn: async () => {
      try {
        const request = await fetch(`https://arweave.net/${txid}`);
        console.log(request)

        if (request.redirected === true) {
            const arrayBuffer = await request.arrayBuffer()
            const files = await arrayBufferToFileList(arrayBuffer)
            console.log(files)
          //return request.url;
        }

        return "";
      } catch (error) {
        throw new Error("Error fetching brandkit folder.");
      }
    }
  });
  return {
    isLoading,
    files,
    refetch
}
};

export default useFolder;