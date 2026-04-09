import { useState } from "react";
import {
  Box, Typography, Paper, Chip, Button, TextField, Divider, Stack,
} from "@mui/material";
import type { EditProposal } from "../../../types/api";
import { approveProposal, rejectProposal } from "../../../api/proposals";
import { useSnackbar } from "../../../app/SnackbarContext";
import { formatDate } from "../../../lib/format";

interface Props {
  proposals: EditProposal[];
  onRefresh: () => void;
}

function ProposalRow({ proposal, onRefresh }: { proposal: EditProposal; onRefresh: () => void }) {
  const { showSnackbar } = useSnackbar();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const act = async (fn: (id: number, notes: string) => Promise<void>, label: string) => {
    setLoading(true);
    try {
      await fn(proposal.id, notes);
      showSnackbar(`Proposal ${label}`, "success");
      onRefresh();
    } catch {
      showSnackbar("Action failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", mb: 1 }}>
        <Chip label={proposal.section} size="small" />
        <Typography variant="subtitle2">{proposal.field_name}</Typography>
        <Typography variant="caption" color="text.secondary">by {proposal.proposer_username} · {formatDate(proposal.created_at)}</Typography>
      </Stack>
      <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
        <Box>
          <Typography variant="caption" color="error.main">Current</Typography>
          <Typography variant="body2">{proposal.current_value || "—"}</Typography>
        </Box>
        <Typography sx={{ alignSelf: "center" }}>→</Typography>
        <Box>
          <Typography variant="caption" color="success.main">Proposed</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{proposal.proposed_value}</Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{proposal.reason}</Typography>
      {proposal.evidence_url && (
        <Typography variant="body2">
          Evidence: <a href={proposal.evidence_url} target="_blank" rel="noopener noreferrer">{proposal.evidence_url}</a>
        </Typography>
      )}
      <Divider sx={{ my: 1 }} />
      <TextField
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Moderator notes (optional)"
        size="small"
        fullWidth
        sx={{ mb: 1 }}
      />
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="contained" color="success" disabled={loading}
          onClick={() => act(approveProposal, "approved")}>Approve</Button>
        <Button size="small" variant="outlined" color="error" disabled={loading}
          onClick={() => act(rejectProposal, "rejected")}>Reject</Button>
      </Stack>
    </Paper>
  );
}

export default function ModerationQueueTable({ proposals, onRefresh }: Props) {
  if (proposals.length === 0) {
    return <Typography color="text.secondary">No pending proposals.</Typography>;
  }
  return (
    <Box>
      {proposals.map((p) => (
        <ProposalRow key={p.id} proposal={p} onRefresh={onRefresh} />
      ))}
    </Box>
  );
}
