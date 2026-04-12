import { useState, useCallback } from "react";
import {
  Container, Box, Button, Typography, Divider, Grid, Breadcrumbs, Link as MuiLink,
  Accordion, AccordionSummary, AccordionDetails, Stack, Tooltip, Snackbar, Menu, MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCamera, getSimilarCameras } from "../api/cameras";
import { getReviews, voteReview } from "../api/reviews";
import CameraHeader from "../features/camera-detail/components/CameraHeader";
import CameraSpecsTabs, { type TabData } from "../features/camera-detail/components/CameraSpecsTabs";
import CameraProsCons from "../features/camera-detail/components/CameraProsCons";
import CameraLensSection from "../features/camera-detail/components/CameraLensSection";
import CameraSeriesRow from "../features/camera-detail/components/CameraSeriesRow";
import CameraRelatedSidebar from "../features/camera-detail/components/CameraRelatedSidebar";
import CameraReviewsSection from "../features/camera-detail/components/CameraReviewsSection";
import CameraReviewScoring from "../features/camera-detail/components/CameraReviewScoring";
import CameraTableOfContents from "../features/camera-detail/components/CameraTableOfContents";
import CameraPhotographyUseCases from "../features/camera-detail/components/CameraPhotographyUseCases";
import CameraAlternatives from "../features/camera-detail/components/CameraAlternatives";
import SampleGallerySection from "../features/camera-detail/components/SampleGallerySection";
import ReviewFormDialog from "../features/reviews/components/ReviewFormDialog";
import ProposalDialog from "../features/contributions/components/ProposalDialog";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { isAuthenticated } from "../api/auth";
import { formatDate, formatPrice } from "../lib/format";
import {
  getWeatherSealingInsight,
  getIBISInsight,
  getEVFInsight,
  getSensorInsight,
  getAutofocusInsight,
  getVideoInsight,
} from "../features/camera-detail/utils/specInsights";

interface BreadcrumbNavProps {
  camera: import("../types/api").CameraDetail;
}

function BreadcrumbNav({ camera }: BreadcrumbNavProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const hiddenItems: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
    { label: `${camera.brand.name} Cameras`, href: `/cameras?brand=${encodeURIComponent(camera.brand.name)}` },
    ...(camera.category ? [{ label: `${camera.category.charAt(0).toUpperCase() + camera.category.slice(1)} Cameras`, href: `/cameras?category=${camera.category}` }] : []),
    ...(camera.mount && camera.mount !== "Fixed Lens" ? [{ label: `${camera.mount} Cameras`, href: `/cameras?mount=${encodeURIComponent(camera.mount)}` }] : []),
  ];

  return (
    <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.85rem" }}>
      <Typography
        component="span"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          fontSize: "0.85rem", color: "text.secondary", cursor: "pointer",
          px: 0.5, borderRadius: 1,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        &hellip;
      </Typography>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { elevation: 2, sx: { minWidth: 180 } } }}
      >
        {hiddenItems.map((item) => (
          <MenuItem
            key={item.href}
            component="a"
            href={item.href}
            onClick={() => setAnchorEl(null)}
            sx={{ fontSize: "0.85rem", color: "text.primary" }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
      <Typography color="text.secondary" sx={{ fontSize: "0.85rem" }}>/</Typography>
      <Typography color="text.primary" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
        {camera.full_name}
      </Typography>
    </Box>
  );
}

export default function CameraDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const scrollTo = useCallback((anchor: string) => {
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const { data: camera, isLoading, isError } = useQuery({
    queryKey: ["camera", slug],
    queryFn: () => getCamera(slug!),
    enabled: !!slug,
  });

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", camera?.id],
    queryFn: () => getReviews(camera?.id),
    enabled: !!camera?.id,
  });

  const { data: alternatives = [] } = useQuery({
    queryKey: ["similar", slug],
    queryFn: () => getSimilarCameras(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <LoadingState />;
  if (isError || !camera) return <ErrorState message="Camera not found." />;

  const buildSpecTabs = (): TabData[] => {
    const tabs: TabData[] = [];

    // General
    tabs.push({
      label: "General",
      anchor: "general",
      rows: [
        { label: "Brand", value: camera.brand.name },
        { label: "Full name", value: camera.full_name },
        { label: "Category", value: camera.category },
        { label: "Mount", value: camera.mount },
        { label: "Status", value: camera.status },
        { label: "Announced", value: formatDate(camera.announcement_date) },
        { label: "Released", value: formatDate(camera.release_date) },
        { label: "MSRP", value: formatPrice(camera.msrp) },
        { label: "Current price estimate", value: formatPrice(camera.current_price_estimate) },
        { label: "Summary", value: camera.short_summary },
      ],
    });

    // Sensor
    const s = camera.sensor_spec;
    if (s) {
      tabs.push({
        label: "Sensor",
        anchor: "sensor",
        description: getSensorInsight(camera) ?? undefined,
        rows: [
          { label: "Sensor Type", value: s.sensor_type },
          { label: "Sensor Format", value: s.sensor_format },
          { label: "Megapixels", value: s.effective_mp },
          { label: "Max Resolution", value: s.max_photo_resolution },
          { label: "Native ISO (Min)", value: s.native_iso_min },
          { label: "Native ISO (Max)", value: s.native_iso_max },
          { label: "Boosted ISO (Max)", value: s.extended_iso_max },
          { label: "Image Stabilization (IBIS)", value: s.ibis },
          { label: "IS Effectiveness (stops)", value: s.ibis_stops },
        ],
      });
    }

    const b = camera.body_spec;
    if (b) {
      // Screen & Viewfinder
      tabs.push({
        label: "Screen & Viewfinder",
        anchor: "screen",
        description: getEVFInsight(camera) ?? undefined,
        rows: [
          { label: 'LCD Screen Size (")', value: b.screen_size_inches },
          { label: "LCD Resolution (k dots)", value: b.screen_resolution_kdots },
          { label: "Touch Screen", value: b.touchscreen },
          { label: "Adjustable / Articulating Screen", value: b.articulating_screen },
          { label: "Electronic Viewfinder", value: b.evf },
          { label: "EVF Resolution", value: b.evf_resolution },
          { label: "EVF Coverage (%)", value: b.evf_coverage_pct },
          { label: "EVF Magnification", value: b.evf_magnification },
        ],
      });
    }

    // Autofocus
    const af = camera.autofocus_spec;
    if (af) {
      tabs.push({
        label: "Autofocus",
        anchor: "autofocus",
        description: getAutofocusInsight(camera) ?? undefined,
        rows: [
          { label: "Phase Detection AF", value: af.phase_detect },
          { label: "Contrast Detection AF", value: af.af_contrast_detect },
          { label: "AF Touch", value: af.af_touch },
          { label: "Number of AF Points", value: af.af_points },
          { label: "AF Coverage (%)", value: af.af_coverage_pct },
          { label: "Eye AF (Human)", value: af.eye_af_human },
          { label: "Face Detection Focus", value: af.face_detection },
          { label: "Eye AF (Animal)", value: af.eye_af_animal },
          { label: "Subject Tracking", value: af.subject_tracking },
          { label: "Vehicle Tracking Focus", value: af.vehicle_tracking },
          { label: "Insect Tracking Focus", value: af.insect_tracking },
          { label: "Min Focus Sensitivity (EV)", value: af.min_focus_ev },
          { label: "Continuous Shooting — Mechanical (fps)", value: af.burst_fps_mech },
          { label: "Continuous Shooting — Electronic (fps)", value: af.burst_fps_electronic },
        ],
      });
    }

    // Shooting
    if (b) {
      tabs.push({
        label: "Shooting",
        anchor: "shooting",
        description: getIBISInsight(camera) ?? undefined,
        rows: [
          { label: "Max Mechanical Shutter", value: b.max_shutter_mech },
          { label: "Max Electronic Shutter", value: b.max_shutter_electronic },
          { label: "Max Flash Sync Speed", value: b.max_flash_sync },
          { label: "Multi-Segment Metering", value: b.metering_multi_segment },
          { label: "Spot Metering", value: b.metering_spot },
          { label: "Center-Weighted Metering", value: b.metering_center_weighted },
          { label: "Partial Metering", value: b.metering_partial },
          { label: "AE Bracketing", value: b.ae_bracketing },
          { label: "WB Bracketing", value: b.wb_bracketing },
          { label: "Built-in Flash", value: b.built_in_flash },
          { label: "Timelapse Recording", value: b.timelapse },
          { label: "GPS", value: b.gps },
        ],
      });
    }

    // Video
    const v = camera.video_spec;
    if (v) {
      tabs.push({
        label: "Video",
        anchor: "video",
        description: getVideoInsight(camera) ?? undefined,
        rows: [
          { label: "Max Video Resolution", value: v.max_video_resolution },
          { label: "Max 4K FPS", value: v.max_4k_fps },
          { label: "Max FHD FPS", value: v.max_fhd_fps },
          { label: "High-Speed Video (fps)", value: v.high_speed_video_fps },
          { label: "RAW Video Output", value: v.raw_video },
          { label: "10-bit Internal Recording", value: v.internal_10bit },
          { label: "Unlimited Recording", value: v.unlimited_recording },
          { label: "Digital Video Stabilization", value: v.digital_is },
          { label: "Lens Breathing Correction", value: v.lens_breathing_correction },
          { label: "Log Profiles", value: v.log_profiles },
          { label: "HDMI Type", value: v.hdmi_type },
          { label: "Microphone Port", value: v.mic_in },
          { label: "Headphone Port", value: v.headphone_out },
          { label: "USB Streaming", value: v.usb_streaming },
        ],
      });
    }

    // Connectivity
    const conn = camera.connectivity_spec;
    if (conn) {
      tabs.push({
        label: "Connectivity",
        anchor: "connectivity",
        rows: [
          { label: "Wi-Fi", value: conn.wifi },
          { label: "Bluetooth", value: conn.bluetooth },
          { label: "USB-C", value: conn.usb_c },
          { label: "USB Charging", value: conn.usb_charging },
          { label: "Webcam Mode", value: conn.webcam_mode },
          { label: "Ethernet Port", value: conn.ethernet },
          { label: "Flash Sync Port", value: conn.flash_sync_port },
          { label: "Full-Size HDMI", value: conn.full_size_hdmi },
        ],
      });
    }

    // Physical
    if (b) {
      tabs.push({
        label: "Physical",
        anchor: "physical",
        description: getWeatherSealingInsight(camera) ?? undefined,
        rows: [
          { label: "Weight (g)", value: b.weight_g },
          { label: "Width (mm)", value: b.width_mm },
          { label: "Height (mm)", value: b.height_mm },
          { label: "Depth / Thickness (mm)", value: b.depth_mm },
          { label: "Environmental Sealing", value: b.weather_sealed },
          { label: "Battery Life (CIPA shots)", value: b.battery_shots_cipa },
          { label: "Dual Card Slots", value: b.dual_card_slots },
        ],
      });
    }

    return tabs;
  };

  const specTabs = buildSpecTabs();

  const showLensSection = !!camera.mount && camera.mount !== "Fixed Lens";
  const showSeriesSection = camera.series_cameras.length > 0;
  const showProsConsSection = camera.pros.trim().length > 0 || camera.cons.trim().length > 0;

  const tocAnchors = [
    { anchor: "overview", label: "Overview" },
    ...specTabs.filter((t) => !!t.anchor).map((t) => ({ anchor: t.anchor!, label: t.label })),
    { anchor: "review-scoring", label: "Our Review" },
    ...(showProsConsSection ? [{ anchor: "pros-cons", label: "Pros & Cons" }] : []),
    { anchor: "photography-use-cases", label: "Good For" },
    ...(alternatives.length > 0 ? [{ anchor: "alternatives", label: "Alternatives" }] : []),
    ...(showLensSection ? [{ anchor: "lenses", label: `${camera.mount} Lenses` }] : []),
    ...(showSeriesSection ? [{ anchor: "series", label: "Series History" }] : []),
    { anchor: "gallery", label: "Sample Gallery" },
  ];

  const reviews = reviewsData?.results ?? [];

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Breadcrumbs — collapsed with ... dropdown */}
      <BreadcrumbNav camera={camera} />

      <Grid container spacing={3} alignItems="flex-start">

        {/* ──── Left / Center column ──── */}
        <Grid size={{ xs: 12, lg: 9 }}>
          {/* Header: image + info + main features */}
          <CameraHeader camera={camera} onWriteReview={() => setReviewOpen(true)} />

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            {isAuthenticated() && (
              <Button variant="text" color="warning" onClick={() => setProposalOpen(true)}>
                Propose correction
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {/* Overview section */}
            <Box id="overview">
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                Last updated: {formatDate(camera.updated_at)}
              </Typography>
              {camera.short_summary && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {camera.short_summary}
                </Typography>
              )}
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                <Tooltip title={copied ? "Copied!" : "Copy link"}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                    onClick={handleCopy}
                  >
                    Copy link
                  </Button>
                </Tooltip>
                <Button
                  size="small"
                  variant="outlined"
                  component="a"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(camera.full_name)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on X
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  component="a"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on Facebook
                </Button>
              </Stack>

              {/* Table of Contents — collapsed button, always visible */}
              <Accordion
                disableGutters
                elevation={0}
                sx={{
                  background: "transparent",
                  "&:before": { display: "none" },
                  "& .MuiAccordionSummary-root": {
                    display: "inline-flex",
                    border: "1px solid",
                    borderColor: "secondary.main",
                    borderRadius: 1,
                    color: "secondary.main",
                    px: 2,
                    py: 0.5,
                    minHeight: 0,
                    width: "auto",
                    "&.Mui-expanded": { minHeight: 0 },
                  },
                  "& .MuiAccordionSummary-content": { margin: 0 },
                  "& .MuiAccordionSummary-expandIconWrapper": { color: "secondary.main" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="button" sx={{ fontWeight: 600, fontSize: "0.8125rem", lineHeight: 1.6 }}>
                    Table of Contents
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 1, px: 0 }}>
                  <CameraTableOfContents sections={tocAnchors} />
                </AccordionDetails>
              </Accordion>
            </Box>

            <CameraSpecsTabs tabs={specTabs} />

            <Box id="review-scoring">
              <CameraReviewScoring camera={camera} />
            </Box>

            {showProsConsSection && (
              <Box id="pros-cons">
                <CameraProsCons
                  pros={camera.pros}
                  cons={camera.cons}
                  cameraName={camera.full_name}
                />
              </Box>
            )}

            {/* Photography Use Cases */}
            <Box id="photography-use-cases">
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                What type of Photography is {camera.full_name} Good for?
              </Typography>
              <CameraPhotographyUseCases camera={camera} />
            </Box>

            {/* Alternatives */}
            {alternatives.length > 0 && (
              <Box id="alternatives">
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {camera.full_name} Alternatives
                </Typography>
                <CameraAlternatives camera={camera} alternatives={alternatives} />
              </Box>
            )}

            {showLensSection && (
              <Box id="lenses">
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {camera.mount} Mount &amp; Popular Lenses
                </Typography>
                <CameraLensSection
                  mount={camera.mount}
                  lenses={camera.popular_lenses}
                />
              </Box>
            )}

            {showSeriesSection && (
              <Box id="series">
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {camera.series} Series History
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Other cameras in the {camera.series} series.
                </Typography>
                <CameraSeriesRow
                  cameras={camera.series_cameras}
                  currentId={camera.id}
                />
              </Box>
            )}

            <SampleGallerySection
              cameraSlug={camera.slug}
              cameraId={camera.id}
              cameraName={camera.full_name}
              canUpload={isAuthenticated()}
            />
          </Box>
        </Grid>

        {/* ──── Right sidebar ──── */}
        <Grid
          size={{ xs: 12, lg: 3 }}
        >
          {/* Related cameras + recommended lenses */}
          <CameraRelatedSidebar
            seriesCameras={camera.series_cameras}
            lenses={camera.popular_lenses}
            mount={camera.mount}
            currentId={camera.id}
          />
        </Grid>
      </Grid>

      {/* Reviews — full-width at the bottom */}
      <CameraReviewsSection
        reviews={reviews}
        onVote={async (id) => {
          await voteReview(id);
          refetchReviews();
        }}
        canWrite={isAuthenticated()}
        onWriteReview={() => setReviewOpen(true)}
        cameraName={camera.full_name}
      />

      <ReviewFormDialog
        open={reviewOpen}
        cameraId={camera.id}
        onClose={() => setReviewOpen(false)}
        onSuccess={() => refetchReviews()}
      />
      <ProposalDialog
        open={proposalOpen}
        cameraId={camera.id}
        onClose={() => setProposalOpen(false)}
      />
      <Snackbar
        open={copied}
        message="Link copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={2000}
      />
    </Container>
  );
}

