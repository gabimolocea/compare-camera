import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TopNav from "./TopNav";
import Footer from "./Footer";
import CompareTray from "./CompareTray";

export default function AppShell() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <TopNav />
      <Box component="main" sx={{ flex: 1, py: 4, px: { xs: 2, md: 4 }, pb: { xs: 10, md: 10 } }}>
        <Outlet />
      </Box>
      <Footer />
      <CompareTray />
    </Box>
  );
}
