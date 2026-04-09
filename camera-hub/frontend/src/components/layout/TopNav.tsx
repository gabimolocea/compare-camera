import { useState, type FormEvent } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  InputBase, alpha, useTheme, Tooltip,
} from "@mui/material";
import { Search as SearchIcon, CameraAlt, Logout } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../../api/auth";

export default function TopNav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const authed = isAuthenticated();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/cameras?search=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none", color: "inherit" }}>
          <CameraAlt />
          <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
            CameraHub
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            flex: 1, maxWidth: 400,
            display: "flex", alignItems: "center",
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            borderRadius: theme.shape.borderRadius,
            px: 1.5, py: 0.5,
          }}
        >
          <SearchIcon sx={{ mr: 1, opacity: 0.7, fontSize: 20 }} />
          <InputBase
            placeholder="Search cameras…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ color: "inherit", flex: 1 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
          <Button color="inherit" component={Link} to="/cameras">Catalog</Button>
          <Button color="inherit" component={Link} to="/compare">Compare</Button>
          {authed ? (
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout}>
                <Logout />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button variant="contained" color="secondary" component={Link} to="/register">
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
