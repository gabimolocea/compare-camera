import { useState } from "react";
import { Container, Typography, Tabs, Tab, Alert } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getModerationProposals } from "../api/proposals";
import ModerationQueueTable from "../features/moderation/components/ModerationQueueTable";
import LoadingState from "../components/common/LoadingState";
import { isAuthenticated } from "../api/auth";

export default function ModerationPage() {
  const [tab, setTab] = useState(0);
  const status = ["pending", "approved", "rejected"][tab];

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["moderation-proposals", status],
    queryFn: () => getModerationProposals(status),
    enabled: isAuthenticated(),
  });

  if (!isAuthenticated()) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 4 }}>You must be logged in to access this page.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>Moderation Dashboard</Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Pending" />
        <Tab label="Approved" />
        <Tab label="Rejected" />
      </Tabs>

      {isLoading ? (
        <LoadingState />
      ) : (
        <ModerationQueueTable proposals={data ?? []} onRefresh={refetch} />
      )}
    </Container>
  );
}
