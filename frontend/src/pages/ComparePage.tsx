import { useState } from "react";
import {
  Container, Box, Typography, Autocomplete, TextField, Button, Paper, Alert,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCameras, compareCameras } from "../api/cameras";
import CompareSummary from "../features/compare/components/CompareSummary";
import CompareTable from "../features/compare/components/CompareTable";
import LoadingState from "../components/common/LoadingState";
import type { Camera } from "../types/api";

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [leftSlug, setLeftSlug] = useState(searchParams.get("left") ?? "");
  const [rightSlug, setRightSlug] = useState(searchParams.get("right") ?? "");

  const { data: camerasData } = useQuery({
    queryKey: ["cameras", "all"],
    queryFn: () => getCameras({ page: 1 }),
  });
  const cameras = camerasData?.results ?? [];

  const canCompare = leftSlug && rightSlug && leftSlug !== rightSlug;

  const { data: result, isLoading, isError, refetch } = useQuery({
    queryKey: ["compare", leftSlug, rightSlug],
    queryFn: () => compareCameras(leftSlug, rightSlug),
    enabled: !!canCompare,
  });

  const findCamera = (slug: string): Camera | null =>
    cameras.find((c) => c.slug === slug) ?? null;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>Compare Cameras</Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <Autocomplete
            sx={{ flex: 1, minWidth: 200 }}
            options={cameras}
            getOptionLabel={(o) => o.full_name}
            value={findCamera(leftSlug)}
            onChange={(_, val) => setLeftSlug(val?.slug ?? "")}
            renderInput={(params) => <TextField {...params} label="Camera 1 (left)" />}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, px: 1 }}>VS</Typography>
          <Autocomplete
            sx={{ flex: 1, minWidth: 200 }}
            options={cameras}
            getOptionLabel={(o) => o.full_name}
            value={findCamera(rightSlug)}
            onChange={(_, val) => setRightSlug(val?.slug ?? "")}
            renderInput={(params) => <TextField {...params} label="Camera 2 (right)" />}
          />
          <Button
            variant="contained"
            size="large"
            disabled={!canCompare}
            onClick={() => {
              setSearchParams({ left: leftSlug, right: rightSlug });
              refetch();
            }}
          >
            Compare
          </Button>
        </Box>
      </Paper>

      {isLoading && <LoadingState />}
      {isError && <Alert severity="error">Failed to load comparison.</Alert>}

      {result && (
        <>
          <CompareSummary result={result} />
          <CompareTable
            diffs={result.field_diffs}
            leftName={result.overview.left.name}
            rightName={result.overview.right.name}
          />
        </>
      )}
    </Container>
  );
}
