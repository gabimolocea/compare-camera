import {
  Box, Dialog, IconButton, Typography, Tab, Tabs, Link,
  Divider,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useState, useEffect, useCallback } from "react";
import type { SamplePhoto } from "../../../types/api";

interface Props {
  photos: SamplePhoto[];
  initialIndex: number;
  cameraName: string;
  open: boolean;
  onClose: () => void;
}

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

function DetailRow({ label, value }: DetailRowProps) {
  if (!value && value !== 0) return null;
  return (
    <Box sx={{ display: "flex", gap: 1, py: 0.3 }}>
      <Typography variant="caption" sx={{ color: "grey.500", minWidth: 80, flexShrink: 0 }}>
        {label}:
      </Typography>
      <Typography variant="caption" sx={{ color: "grey.200" }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function GalleryLightbox({ photos, initialIndex, cameraName, open, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [tab, setTab] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [filmRef, setFilmRef] = useState<HTMLDivElement | null>(null);

  const photo = photos[index];

  // Scroll filmstrip to keep active thumb visible
  useEffect(() => {
    if (!filmRef) return;
    const thumb = filmRef.querySelector(`[data-idx="${index}"]`) as HTMLElement | null;
    if (thumb) thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index, filmRef]);

  const prev = useCallback(() => { setIndex((i) => (i > 0 ? i - 1 : photos.length - 1)); setTab(0); }, [photos.length]);
  const next = useCallback(() => { setIndex((i) => (i < photos.length - 1 ? i + 1 : 0)); setTab(0); }, [photos.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next, onClose]);

  if (!photo) return null;

  const dimensions =
    photo.width_px && photo.height_px
      ? `${photo.width_px.toLocaleString()} × ${photo.height_px.toLocaleString()} (${((photo.width_px * photo.height_px) / 1_000_000).toFixed(1)} MP)`
      : null;

  const exifLine = [photo.focal_length, photo.shutter_speed, photo.aperture, photo.iso]
    .filter(Boolean)
    .join(", ");

  return (
    <Dialog
      key={initialIndex}
      open={open}
      onClose={onClose}
      fullScreen
      slotProps={{ paper: { sx: { bgcolor: "#111", color: "white" } } }}
    >
      {/* ── Top bar ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          bgcolor: "#1a1a1a",
          flexShrink: 0,
        }}
      >
        <Typography variant="body2" sx={{ color: "grey.300" }}>
          {cameraName} sample gallery
          <Box component="span" sx={{ mx: 1.5, color: "grey.600" }}>|</Box>
          Image {index + 1} / {photos.length}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => setFullscreen((f) => !f)}
            sx={{ color: "grey.400" }}
          >
            {fullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
          </IconButton>
          <Typography
            component="span"
            variant="body2"
            onClick={onClose}
            sx={{ color: "grey.400", cursor: "pointer", userSelect: "none", lineHeight: "32px", "&:hover": { color: "white" } }}
          >
            Close gallery
          </Typography>
        </Box>
      </Box>

      {/* ── Main content: image + sidebar ── */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Image area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Main image */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              bgcolor: "#000",
            }}
          >
            <Box
              component="img"
              src={photo.image}
              alt={photo.title || photo.description || cameraName}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
            {/* Prev / Next arrows */}
            <IconButton
              onClick={prev}
              sx={{
                position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.5)", color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={next}
              sx={{
                position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.5)", color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>

          {/* Filmstrip */}
          <Box
            ref={(el: HTMLDivElement | null) => setFilmRef(el)}
            sx={{
              display: "flex",
              gap: 0.5,
              overflowX: "auto",
              bgcolor: "#1a1a1a",
              px: 1,
              py: 0.75,
              flexShrink: 0,
              scrollbarWidth: "thin",
              scrollbarColor: "#444 transparent",
            }}
          >
            {photos.map((p, i) => (
              <Box
                key={p.id}
                data-idx={i}
                component="img"
                src={p.image}
                alt=""
                onClick={() => { setIndex(i); setTab(0); }}
                sx={{
                  width: 72,
                  height: 48,
                  objectFit: "cover",
                  cursor: "pointer",
                  flexShrink: 0,
                  borderRadius: 0.5,
                  opacity: i === index ? 1 : 0.5,
                  border: i === index ? "2px solid" : "2px solid transparent",
                  borderColor: i === index ? "primary.main" : "transparent",
                  "&:hover": { opacity: 0.8 },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Details sidebar */}
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            bgcolor: "#1a1a1a",
            borderLeft: "1px solid #333",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{
              borderBottom: "1px solid #333",
              minHeight: 40,
              "& .MuiTab-root": { color: "grey.500", minHeight: 40, fontSize: "0.75rem" },
              "& .Mui-selected": { color: "white" },
              "& .MuiTabs-indicator": { bgcolor: "primary.main" },
            }}
          >
            <Tab label="Details" />
            <Tab label="Comments (0)" />
          </Tabs>

          {/* Tab content */}
          <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5 }}>
            {tab === 0 && (
              <Box>
                {(photo.title || photo.description) && (
                  <Box sx={{ mb: 1.5 }}>
                    {photo.title && (
                      <Typography variant="body2" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
                        {photo.title}
                      </Typography>
                    )}
                    {photo.description && (
                      <Typography variant="caption" sx={{ color: "grey.400" }}>
                        {photo.description}
                      </Typography>
                    )}
                  </Box>
                )}

                <Divider sx={{ borderColor: "#333", mb: 1.5 }} />

                <DetailRow label="Taken by" value={photo.taken_by} />
                <DetailRow label="Camera" value={cameraName} />
                <DetailRow label="Lens" value={photo.lens_name} />
                {exifLine && <DetailRow label="Details" value={exifLine} />}
                <DetailRow label="Dimensions" value={dimensions} />

                {photo.image && (
                  <Box sx={{ mt: 1.5 }}>
                    <Box sx={{ display: "flex", gap: 1, py: 0.3, alignItems: "baseline" }}>
                      <Typography variant="caption" sx={{ color: "grey.500", minWidth: 80, flexShrink: 0 }}>
                        Original:
                      </Typography>
                      <Link
                        href={photo.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="caption"
                        sx={{ color: "primary.light" }}
                      >
                        Full size
                      </Link>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {tab === 1 && (
              <Typography variant="body2" sx={{ color: "grey.500", textAlign: "center", mt: 3 }}>
                No comments yet.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
