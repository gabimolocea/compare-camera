import {
  Box, Grid, Typography, Paper, Skeleton, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSamplePhotos, submitSamplePhoto } from "../../../api/cameras";
import type { SamplePhotoFilters } from "../../../api/cameras";
import type { SamplePhoto } from "../../../types/api";
import GalleryFilterSidebar, { type GalleryFilters } from "./GalleryFilterSidebar";
import GalleryLightbox from "./GalleryLightbox";

interface Props {
  cameraSlug: string;
  cameraId: number;
  cameraName: string;
  canUpload: boolean;
}

const EMPTY_FILTERS: GalleryFilters = {
  lens: "",
  focal_length: "",
  shutter_speed: "",
  aperture: "",
  iso: "",
};

function PhotoThumb({ photo, onClick }: { photo: SamplePhoto; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        aspectRatio: "4/3",
        overflow: "hidden",
        borderRadius: 1,
        cursor: "pointer",
        bgcolor: "grey.900",
        "&:hover img": { transform: "scale(1.05)" },
        "&:hover .overlay": { opacity: 1 },
      }}
    >
      <Box
        component="img"
        src={photo.image}
        alt={photo.title || "Sample photo"}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.2s ease",
        }}
      />
      <Box
        className="overlay"
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.4)",
          opacity: 0,
          transition: "opacity 0.2s ease",
          display: "flex",
          alignItems: "flex-end",
          p: 1,
        }}
      >
        {photo.focal_length && (
          <Typography variant="caption" sx={{ color: "white", fontSize: "0.7rem" }}>
            {[photo.focal_length, photo.aperture, photo.iso].filter(Boolean).join(" · ")}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function UploadDialog({
  open,
  cameraId,
  onClose,
  onSuccess,
}: {
  open: boolean;
  cameraId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState({
    title: "", taken_by: "", lens_name: "",
    focal_length: "", shutter_speed: "", aperture: "", iso: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) { setError("Please select an image."); return; }
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("camera", String(cameraId));
      fd.append("image", file);
      Object.entries(fields).forEach(([k, v]) => { if (v) fd.append(k, v); });
      await submitSamplePhoto(fd);
      onSuccess();
      onClose();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const f = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Submit a Sample Photo</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Photos will be reviewed before being published.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Button variant="outlined" component="label" startIcon={<AddPhotoAlternateIcon />}>
            {file ? file.name : "Select Image"}
            <input hidden accept="image/*" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </Button>
          <TextField label="Title (optional)" size="small" value={fields.title} onChange={f("title")} />
          <TextField label="Description" size="small" multiline rows={2} value={fields.description} onChange={f("description")} />
          <TextField label="Taken by (your name)" size="small" value={fields.taken_by} onChange={f("taken_by")} />
          <TextField label="Lens name" size="small" value={fields.lens_name} onChange={f("lens_name")} />
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <TextField label="Focal length" size="small" fullWidth value={fields.focal_length} onChange={f("focal_length")} placeholder="e.g. 50 mm" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField label="Shutter speed" size="small" fullWidth value={fields.shutter_speed} onChange={f("shutter_speed")} placeholder="e.g. 1/500 sec" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField label="Aperture" size="small" fullWidth value={fields.aperture} onChange={f("aperture")} placeholder="e.g. f/2.8" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField label="ISO" size="small" fullWidth value={fields.iso} onChange={f("iso")} placeholder="e.g. ISO 400" />
            </Grid>
          </Grid>
          {error && <Typography variant="body2" color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Uploading…" : "Submit Photo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function SampleGallerySection({ cameraSlug, cameraId, cameraName, canUpload }: Props) {
  const [filters, setFilters] = useState<GalleryFilters>(EMPTY_FILTERS);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const apiFilters: SamplePhotoFilters = useMemo(() => ({
    lens: filters.lens || undefined,
    focal_length: filters.focal_length || undefined,
    shutter_speed: filters.shutter_speed || undefined,
    aperture: filters.aperture || undefined,
    iso: filters.iso || undefined,
  }), [filters]);

  const { data: photos = [], isLoading, refetch } = useQuery({
    queryKey: ["sample-photos", cameraSlug, apiFilters],
    queryFn: () => getSamplePhotos(cameraSlug, apiFilters),
  });

  // We also need unfiltered for the filter sidebar choices
  const { data: allPhotos = [] } = useQuery({
    queryKey: ["sample-photos", cameraSlug, {}],
    queryFn: () => getSamplePhotos(cameraSlug, {}),
  });

  return (
    <Box id="gallery" sx={{ mt: 5 }}>
      {/* Section header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PhotoCameraIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Sample Gallery
          </Typography>
          {photos.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              ({photos.length} photo{photos.length !== 1 ? "s" : ""})
            </Typography>
          )}
        </Box>
        {canUpload && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={() => setUploadOpen(true)}
          >
            Submit Photo
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ alignItems: "flex-start" }}>
        {/* Filter sidebar */}
        {allPhotos.length > 0 && (
          <Grid size={{ xs: 12, sm: 3, md: 2 }}>
            <GalleryFilterSidebar
              photos={allPhotos}
              filters={filters}
              onChange={setFilters}
            />
          </Grid>
        )}

        {/* Photo grid */}
        <Grid size={{ xs: 12, sm: allPhotos.length > 0 ? 9 : 12, md: allPhotos.length > 0 ? 10 : 12 }}>
          {isLoading ? (
            <Grid container spacing={1}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
                  <Skeleton variant="rectangular" sx={{ aspectRatio: "4/3", borderRadius: 1 }} />
                </Grid>
              ))}
            </Grid>
          ) : photos.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                gap: 1.5,
                color: "text.disabled",
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              <Typography variant="body1">No sample photos yet</Typography>
              {canUpload && (
                <Button variant="contained" size="small" startIcon={<AddPhotoAlternateIcon />} onClick={() => setUploadOpen(true)}>
                  Be the first to submit
                </Button>
              )}
            </Paper>
          ) : (
            <Grid container spacing={1}>
              {photos.map((photo, i) => (
                <Grid key={photo.id} size={{ xs: 6, sm: 4, md: 3 }}>
                  <PhotoThumb photo={photo} onClick={() => setLightboxIndex(i)} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          photos={photos}
          initialIndex={lightboxIndex}
          cameraName={cameraName}
          open={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Upload dialog */}
      <UploadDialog
        open={uploadOpen}
        cameraId={cameraId}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => refetch()}
      />
    </Box>
  );
}
