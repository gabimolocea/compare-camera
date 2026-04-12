import { useState } from "react";
import {
  Container, Box, Typography, Autocomplete, TextField, Button, Paper, Alert, IconButton, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import { getCameras, compareCameras, getCamera } from "../api/cameras";
import CompareSummary from "../features/compare/components/CompareSummary";
import CompareTable from "../features/compare/components/CompareTable";
import CompareAdvantages from "../features/compare/components/CompareAdvantages";
import LoadingState from "../components/common/LoadingState";
import type { Camera } from "../types/api";

const MAX = 4;

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initSlugs = (): string[] => {
    const raw = searchParams.get("slugs");
    if (raw) return raw.split(",").filter(Boolean).slice(0, MAX);
    const left = searchParams.get("left");
    const right = searchParams.get("right");
    if (left && right) return [left, right];
    if (left) return [left, ""];
    return ["", ""];
  };

  const [slugs, setSlugs] = useState<string[]>(initSlugs);

  const { data: camerasData } = useQuery({
    queryKey: ["cameras", "all"],
    queryFn: () => getCameras({ page: 1 }),
  });
  const cameras = camerasData?.results ?? [];

  const filledSlugs = slugs.filter(Boolean);
  const canCompare = filledSlugs.length >= 2 && new Set(filledSlugs).size === filledSlugs.length;

  const cameraDetailQueries = useQueries({
    queries: filledSlugs.map((slug) => ({
      queryKey: ["camera", slug],
      queryFn: () => getCamera(slug),
      enabled: filledSlugs.length >= 1,
    })),
  });
  const cameraDetails = cameraDetailQueries.map((q) => q.data ?? undefined);

  // Auto-run if slugs were provided via URL (e.g. from the compare tray)
  const hasUrlSlugs = !!searchParams.get("slugs") || (!!searchParams.get("left") && !!searchParams.get("right"));

  const { data: result, isLoading, isError, refetch } = useQuery({
    queryKey: ["compare", ...filledSlugs],
    queryFn: () => compareCameras(filledSlugs),
    enabled: canCompare && hasUrlSlugs,
  });

  const findCamera = (slug: string): Camera | null =>
    cameras.find((c) => c.slug === slug) ?? null;

  const setSlug = (index: number, val: string) => {
    setSlugs((prev) => prev.map((s, i) => (i === index ? val : s)));
  };

  const addCamera = () => {
    if (slugs.length < MAX) setSlugs((prev) => [...prev, ""]);
  };

  const removeCamera = (index: number) => {
    setSlugs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompare = () => {
    setSearchParams({ slugs: filledSlugs.join(",") });
    refetch();
  };

  const takenSlugs = (currentIndex: number) =>
    slugs.filter((s, i) => i !== currentIndex && s !== "");
  const availableCameras = (currentIndex: number) =>
    cameras.filter((c) => !takenSlugs(currentIndex).includes(c.slug));

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>Compare Cameras</Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          {slugs.map((slug, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 0.5, flex: "1 1 180px", minWidth: 180, maxWidth: 300 }}>
              <Autocomplete
                fullWidth
                options={availableCameras(idx)}
                getOptionLabel={(o) => o.full_name}
                value={findCamera(slug)}
                onChange={(_, val) => setSlug(idx, val?.slug ?? "")}
                renderInput={(params) => (
                  <TextField {...params} label={`Camera ${idx + 1}`} size="small" />
                )}
              />
              {slugs.length > 2 && (
                <Tooltip title="Remove">
                  <IconButton size="small" onClick={() => removeCamera(idx)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ))}

          {slugs.length < MAX && (
            <Tooltip title="Add camera">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addCamera}
                sx={{ whiteSpace: "nowrap" }}
              >
                Add
              </Button>
            </Tooltip>
          )}

          <Button
            variant="contained"
            size="large"
            disabled={!canCompare}
            onClick={handleCompare}
            sx={{ whiteSpace: "nowrap" }}
          >
            Compare
          </Button>
        </Box>

        {filledSlugs.length >= 2 && new Set(filledSlugs).size < filledSlugs.length && (
          <Alert severity="warning" sx={{ mt: 2 }}>You have duplicate cameras selected.</Alert>
        )}
      </Paper>

      {isLoading && <LoadingState />}
      {isError && <Alert severity="error">Failed to load comparison.</Alert>}

      {result && (
        <>
          <CompareSummary result={result} cameraDetails={cameraDetails} />
          <CompareAdvantages diffs={result.field_diffs} cameras={result.cameras} />
          <CompareTable diffs={result.field_diffs} cameras={result.cameras} />
        </>
      )}
    </Container>
  );
}
