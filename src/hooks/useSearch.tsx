import { useEffect, useMemo, useState } from "react";
import { TBrandkit } from "../types";

const useSearch = (brandkits: TBrandkit[] = [], delay = 500) => {
  const [searchNameKey, setSearchNameKey] = useState("");
  const [debouncedName, setDebouncedName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(searchNameKey);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchNameKey, delay]);

  const filteredBrandkits = useMemo(() => {
    if (debouncedName.trim().length === 0) {
      return brandkits;
    }

    return brandkits.filter((brandkit) =>
      String(brandkit.name)
        .toLocaleLowerCase()
        .includes(debouncedName.toLocaleLowerCase()),
    );
  }, [brandkits, debouncedName]);

  return { searchNameKey, setSearchNameKey, filteredBrandkits };
};

export default useSearch;
