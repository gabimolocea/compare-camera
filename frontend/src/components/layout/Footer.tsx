import { Box, Typography, Container, Link as MuiLink } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "grey.900", color: "grey.400", py: 4, mt: "auto" }}>
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} CameraHub — Compare cameras, share knowledge.{" "}
          <MuiLink href="/docs/" color="inherit" underline="hover">API Docs</MuiLink>
        </Typography>
      </Container>
    </Box>
  );
}
