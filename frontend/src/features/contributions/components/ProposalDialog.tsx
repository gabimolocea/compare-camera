import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Grid, MenuItem, Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFieldProposal } from "../../../api/proposals";
import { useSnackbar } from "../../../app/SnackbarContext";

const schema = z.object({
  section: z.string().min(1),
  field_name: z.string().min(1),
  current_value: z.string(),
  proposed_value: z.string().min(1, "Required"),
  reason: z.string().min(10, "Explain your reason (min 10 chars)"),
  evidence_url: z.string().url().optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const SECTIONS = ["camera", "sensor", "video", "body", "autofocus", "connectivity"];

interface Props {
  open: boolean;
  cameraId: number;
  onClose: () => void;
}

export default function ProposalDialog({ open, cameraId, onClose }: Props) {
  const { showSnackbar } = useSnackbar();
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { section: "sensor", field_name: "", current_value: "", proposed_value: "", reason: "", evidence_url: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createFieldProposal({ ...data, camera: cameraId });
      showSnackbar("Proposal submitted for review!", "success");
      reset();
      onClose();
    } catch {
      showSnackbar("Failed to submit proposal.", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Propose a spec correction</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your proposal will be reviewed by a moderator before being applied.
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller name="section" control={control} render={({ field }) => (
              <TextField {...field} select label="Section" fullWidth>
                {SECTIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            )} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller name="field_name" control={control} render={({ field }) => (
              <TextField {...field} label="Field name" fullWidth
                error={!!errors.field_name} helperText={errors.field_name?.message} />
            )} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller name="current_value" control={control} render={({ field }) => (
              <TextField {...field} label="Current value" fullWidth />
            )} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller name="proposed_value" control={control} render={({ field }) => (
              <TextField {...field} label="Proposed value" fullWidth
                error={!!errors.proposed_value} helperText={errors.proposed_value?.message} />
            )} />
          </Grid>
          <Grid size={12}>
            <Controller name="reason" control={control} render={({ field }) => (
              <TextField {...field} label="Reason" multiline rows={3} fullWidth
                error={!!errors.reason} helperText={errors.reason?.message} />
            )} />
          </Grid>
          <Grid size={12}>
            <Controller name="evidence_url" control={control} render={({ field }) => (
              <TextField {...field} label="Evidence URL (optional)" fullWidth
                error={!!errors.evidence_url} helperText={errors.evidence_url?.message} />
            )} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
