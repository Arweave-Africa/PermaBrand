import { useQuery } from '@tanstack/react-query';
import { hb_url, processId } from '../utils/constants';

const useBrandkits = () => {

    const { data: brandkits, isLoading:isBrandkitsLoading, error:brandkitError } = useQuery({
    queryKey: ["brandkits-fetch"],
    queryFn: async () => {
      try {
         const url = `${hb_url}/${processId}~process@1.0/compute/brandkits`
        const result = await fetch(url)
        console.log(result)
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
