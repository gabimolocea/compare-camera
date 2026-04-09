import { useState } from "react";
import {
  Container, Box, Grid, Typography, Pagination, InputBase,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getCameras } from "../api/cameras";
import CameraCard from "../features/camera-catalog/components/CameraCard";
import FilterSidebar from "../features/camera-catalog/components/FilterSidebar";
import { useCameraFilters } from "../features/camera-catalog/hooks/useCameraFilters";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import type { Camera } from "../types/api";

export default function CameraListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [page, setPage] = useState(1);
  const [compareItems, setCompareItems] = useState<Camera[]>([]);
  const { filters, setFilters, reset } = useCameraFilters();

  const queryKey = ["cameras", filters, search, page];
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      getCameras({
        ...filters,
        search,
        page,
        price_min: filters.price_min || undefined,
        price_max: filters.price_max < 10000 ? filters.price_max : undefined,
        release_year_min: filters.release_year_min > 2010 ? filters.release_year_min : undefined,
        release_year_max: filters.release_year_max < new Date().getFullYear() ? filters.release_year_max : undefined,
      }),
  });

  const handleCompare = (camera: Camera) => {
    const already = compareItems.find((c) => c.id === camera.id);
    if (already) {
      setCompareItems((items) => items.filter((c) => c.id !== camera.id));
    } else if (compareItems.length < 2) {
      const updated = [...compareItems, camera];
      if (updated.length === 2) {
        navigate(`/compare?left=${updated[0].slug}&right=${updated[1].slug}`);
      } else {
        setCompareItems(updated);
      }
    }
  };

  const totalPages = data ? Math.ceil(data.count / 20) : 1;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>Camera Catalog</Typography>

      <Paper sx={{ display: "flex", alignItems: "center", px: 2, py: 0.5, mb: 3 }}>
        <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
        <InputBase
          placeholder="Search by model, brand…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
          onKeyDown={(e) => { if (e.key === "Enter") setPage(1); }}
        />
      </Paper>

      <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        <FilterSidebar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} onReset={reset} />

        <Box sx={{ flex: 1 }}>
          {compareItems.length === 1 && (
            <Paper sx={{ p: 1.5, mb: 2, bgcolor: "info.light" }}>
              <Typography variant="body2">
                Selected: <strong>{compareItems[0].full_name}</strong> — pick one more to compare.
              </Typography>
            </Paper>
          )}

          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState message="Failed to load cameras." />
          ) : data?.results.length === 0 ? (
            <EmptyState message="No cameras match your filters." />
          ) : (
            <Grid container spacing={3}>
              {data?.results.map((camera) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={camera.id}>
                  <CameraCard
                    camera={camera}
                    onCompare={handleCompare}
                    compareMode={compareItems.some((c) => c.id === camera.id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
