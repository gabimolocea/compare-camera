import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, TextField, MenuItem, Typography, Slider, Box,
} from "@mui/material";
import { useForm, Controller, type Control } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReview } from "../../../api/reviews";
import { useSnackbar } from "../../../app/SnackbarContext";

const schema = z.object({
  title: z.string().min(5, "Min 5 chars"),
  body: z.string().min(200, "Min 200 characters"),
  pros: z.string().min(1, "Required"),
  cons: z.string().min(1, "Required"),
  rating_overall: z.number().min(1).max(10),
  rating_photo: z.number().min(1).max(10),
  rating_video: z.number().min(1).max(10),
  rating_value: z.number().min(1).max(10),
  usage_type: z.string(),
  experience_level: z.string(),
  ownership_status: z.string(),
});

type FormData = z.infer<typeof schema>;

function RatingField({ name, label, control }: { name: keyof FormData; label: string; control: Control<FormData> }) {
  return (
    <Controller name={name} control={control} render={({ field }) => (
      <Box>
        <Typography variant="body2">{label}: <strong>{field.value as number}</strong>/10</Typography>
        <Slider
          value={field.value as number}
          onChange={(_, v) => field.onChange(v)}
          min={1} max={10} step={1}
          marks valueLabelDisplay="auto"
        />
      </Box>
    )} />
  );
}

interface Props {
  open: boolean;
  cameraId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewFormDialog({ open, cameraId, onClose, onSuccess }: Props) {
  const { showSnackbar } = useSnackbar();
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating_overall: 7, rating_photo: 7, rating_video: 7, rating_value: 7,
      usage_type: "general", experience_level: "enthusiast", ownership_status: "owned",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createReview({ ...data, camera: cameraId });
      showSnackbar("Review submitted!", "success");
      reset();
      onSuccess();
      onClose();
    } catch {
      showSnackbar("Failed to submit review.", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Write a Review</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid size={12}>
            <Controller name="title" control={control} render={({ field }) => (
              <TextField {...field} label="Title" fullWidth error={!!errors.title} helperText={errors.title?.message} />
            )} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller name="usage_type" control={control} render={({ field }) => (
              <TextField {...field} select label="Usage" fullWidth>
                {["travel","wedding","studio","wildlife","vlogging","cinema","general"].map(v => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </TextField>
            )} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller name="experience_level" control={control} render={({ field }) => (
              <TextField {...field} select label="Experience" fullWidth>
                {["beginner","enthusiast","pro"].map(v => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </TextField>
            )} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller name="ownership_status" control={control} render={({ field }) => (
              <TextField {...field} select label="Ownership" fullWidth>
                {["owned","tested","rented"].map(v => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </TextField>
            )} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}><RatingField name="rating_overall" label="Overall" control={control} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><RatingField name="rating_photo" label="Photo" control={control} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><RatingField name="rating_video" label="Video" control={control} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><RatingField name="rating_value" label="Value" control={control} /></Grid>
          <Grid size={12}>
            <Controller name="body" control={control} render={({ field }) => (
              <TextField {...field} label="Review (min 200 chars)" multiline rows={5} fullWidth
                error={!!errors.body} helperText={errors.body?.message} />
            )} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller name="pros" control={control} render={({ field }) => (
              <TextField {...field} label="Pros" multiline rows={3} fullWidth
                error={!!errors.pros} helperText={errors.pros?.message} />
            )} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller name="cons" control={control} render={({ field }) => (
              <TextField {...field} label="Cons" multiline rows={3} fullWidth
                error={!!errors.cons} helperText={errors.cons?.message} />
            )} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
}
