import { useQuery } from "@tanstack/react-query";

const useFolder = (txid: string) => {
    const {
        isLoading,
        data: files,
        refetch,
      } = useQuery({
    queryKey: ["brandkit-folder", txid],
    queryFn: async () => {
      try {
        const result = await fetch(`https://arweave.net/raw/${txid}`);
        const { paths } = await result.json()

        return paths;
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