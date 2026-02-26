import { useQuery } from '@tanstack/react-query';
import { get_state_module_id, hb_url, processId } from '../utils/constants';
import { TBrandkit } from '../types';

const toBrandkits = (data: Record<string, unknown>): TBrandkit[] => {
  const byIndex: Record<string, Partial<TBrandkit>> = {};
  const keyRegex = /^brandkit_(\d+)_(id|name|url|description|folder_id|creator)$/;

  for (const [key, value] of Object.entries(data)) {
    const match = key.match(keyRegex);
    if (!match) continue;

    const [, index, field] = match;
    const entry = byIndex[index] ?? {};
    const textValue = String(value ?? '');

    if (field === 'folder_id') entry.folderId = textValue;
    if (field === 'creator') entry.creator = textValue;
    if (field === 'id') entry.id = textValue;
    if (field === 'name') entry.name = textValue;
    if (field === 'url') entry.url = textValue;
    if (field === 'description') entry.description = textValue;

    byIndex[index] = entry;
  }

  return Object.entries(byIndex)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([, brandkit]) => ({
      creator: brandkit.creator ?? '',
      description: brandkit.description ?? '',
      folderId: brandkit.folderId ?? '',
      id: brandkit.id ?? '',
      name: brandkit.name ?? '',
      url: brandkit.url ?? '',
    }));
};

const useBrandkits = () => {

    const { data: brandkits, isLoading:isBrandkitsLoading, error:brandkitError } = useQuery<TBrandkit[]>({
    queryKey: ["brandkits-fetch"],
    queryFn: async () => {
      const url = `${hb_url}/${processId}/now/~lua@5.3a&module=${get_state_module_id}/get_state/serialize~json@1.0`;
      const result = await fetch(url);

      if (!result.ok) {
        throw new Error(`Failed to fetch brandkits: ${result.status}`);
      }

      const data = (await result.json()) as Record<string, unknown>;
      return toBrandkits(data);
    },
  });

  return { brandkits, isBrandkitsLoading, brandkitError }
}

export default useBrandkits
