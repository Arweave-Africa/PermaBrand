import { useQuery } from '@tanstack/react-query';
import { processId } from '../utils/constants';

const useBrandkits = () => {

    const { data: brandkits, isLoading:isBrandkitsLoading, error:brandkitError } = useQuery({
    queryKey: ["brandkits-fetch"],
    queryFn: async () => {
      try {
         const url = `https://push.forward.computer/${processId}~process@1.0/compute/brandkits`
        const result = await fetch(url)
        const data = await result.text()
        console.log(data)
      } catch (error) {
        console.log(error);
        console.error("Error fetching brandkits.");
      }
    },
  });

  return { brandkits, isBrandkitsLoading, brandkitError }
}

export default useBrandkits
