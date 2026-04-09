import { useState, useCallback } from "react";
import type { Filters } from "../components/FilterSidebar";

const DEFAULT_FILTERS: Filters = {
  category: "",
  brand: "",
  price_min: 0,
  price_max: 10000,
  release_year_min: 2010,
  release_year_max: new Date().getFullYear(),
};

export function useCameraFilters() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const reset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return { filters, setFilters, reset };
}
