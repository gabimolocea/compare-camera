import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TopNav from "./TopNav";
import Footer from "./Footer";

export default function AppShell() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <TopNav />
      <Box component="main" sx={{ flex: 1, py: 4, px: { xs: 2, md: 4 } }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
