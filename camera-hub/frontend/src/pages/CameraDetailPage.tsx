import { useState } from "react";
import {
  Container, Box, Button, Typography, Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCamera } from "../api/cameras";
import { getReviews, voteReview } from "../api/reviews";
import CameraHeader from "../features/camera-detail/components/CameraHeader";
import CameraSpecsTabs from "../features/camera-detail/components/CameraSpecsTabs";
import ReviewCard from "../features/reviews/components/ReviewCard";
import ReviewFormDialog from "../features/reviews/components/ReviewFormDialog";
import ProposalDialog from "../features/contributions/components/ProposalDialog";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import { isAuthenticated } from "../api/auth";

export default function CameraDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);

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

  if (isLoading) return <LoadingState />;
  if (isError || !camera) return <ErrorState message="Camera not found." />;

  const buildSpecTabs = () => {
    const tabs = [];

    const s = camera.sensor_spec;
    if (s) {
      tabs.push({
        label: "Sensor",
        rows: [
          { label: "Sensor type", value: s.sensor_type },
          { label: "Sensor format", value: s.sensor_format },
          { label: "Effective MP", value: s.effective_mp },
          { label: "Max resolution", value: s.max_photo_resolution },
          { label: "Native ISO", value: s.native_iso_min && s.native_iso_max ? `${s.native_iso_min}–${s.native_iso_max}` : null },
          { label: "IBIS", value: s.ibis },
        ],
      });
    }

    const v = camera.video_spec;
    if (v) {
      tabs.push({
        label: "Video",
        rows: [
          { label: "Max resolution", value: v.max_video_resolution },
          { label: "Max 4K FPS", value: v.max_4k_fps },
          { label: "RAW video", value: v.raw_video },
          { label: "10-bit internal", value: v.internal_10bit },
          { label: "Log profiles", value: v.log_profiles },
          { label: "Mic input", value: v.mic_in },
          { label: "Headphone out", value: v.headphone_out },
        ],
      });
    }

    const b = camera.body_spec;
    if (b) {
      tabs.push({
        label: "Body",
        rows: [
          { label: "Weight", value: b.weight_g ? `${b.weight_g}g` : null },
          { label: "Dimensions", value: b.width_mm ? `${b.width_mm} × ${b.height_mm} × ${b.depth_mm} mm` : null },
          { label: "Weather sealed", value: b.weather_sealed },
          { label: "Battery (CIPA)", value: b.battery_shots_cipa },
          { label: "Articulating screen", value: b.articulating_screen },
          { label: "Touchscreen", value: b.touchscreen },
          { label: "EVF", value: b.evf },
          { label: "Dual card slots", value: b.dual_card_slots },
        ],
      });
    }

    const af = camera.autofocus_spec;
    if (af) {
      tabs.push({
        label: "Autofocus",
        rows: [
          { label: "Phase detect", value: af.phase_detect },
          { label: "AF points", value: af.af_points },
          { label: "Eye AF (human)", value: af.eye_af_human },
          { label: "Eye AF (animal)", value: af.eye_af_animal },
          { label: "Burst FPS (mech)", value: af.burst_fps_mech },
          { label: "Burst FPS (electronic)", value: af.burst_fps_electronic },
        ],
      });
    }

    const conn = camera.connectivity_spec;
    if (conn) {
      tabs.push({
        label: "Connectivity",
        rows: [
          { label: "WiFi", value: conn.wifi },
          { label: "Bluetooth", value: conn.bluetooth },
          { label: "USB-C", value: conn.usb_c },
          { label: "USB charging", value: conn.usb_charging },
          { label: "Webcam mode", value: conn.webcam_mode },
        ],
      });
    }

    return tabs;
  };

  const reviews = reviewsData?.results ?? [];

  return (
    <Container maxWidth="lg">
      <CameraHeader camera={camera} />

      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {isAuthenticated() && (
          <>
            <Button variant="outlined" onClick={() => setReviewOpen(true)}>
              Write a review
            </Button>
            <Button variant="text" color="warning" onClick={() => setProposalOpen(true)}>
              Propose correction
            </Button>
          </>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <CameraSpecsTabs tabs={buildSpecTabs()} />

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
          Reviews ({reviews.length})
        </Typography>
        {reviews.length === 0 ? (
          <EmptyState message="No reviews yet. Be the first!" />
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onVote={async (id) => {
                await voteReview(id);
                refetchReviews();
              }}
            />
          ))
        )}
      </Box>

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
    </Container>
  );
}
