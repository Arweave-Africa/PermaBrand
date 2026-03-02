import { useQuery } from "@tanstack/react-query";
import { wayfinder } from "../lib/wayfinder";

const useFolder = (txid: string) => {
  const {
    isLoading,
    data: files,
    refetch,
  } = useQuery<Record<string, { id: string }>>({
    queryKey: ["brandkit-folder", txid],
    enabled: !!txid,
    queryFn: async () => {
      try {
        const result = await wayfinder.request(`ar://${txid}`);
        if (!result.ok) {
          throw new Error(`Failed to fetch folder: ${result.status}`);
        }
        const data = (await result.json()) as { paths?: Record<string, { id: string }> };

        return data.paths ?? {};
      } catch {
        throw new Error("Error fetching brandkit folder.");
      }
    },
  });
  return {
    isLoading,
    files: files ?? {},
    refetch,
  };
};

export default useFolder;
