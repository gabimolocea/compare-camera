import { createBrowserRouter } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import HomePage from "../pages/HomePage";
import CameraListPage from "../pages/CameraListPage";
import CameraDetailPage from "../pages/CameraDetailPage";
import ComparePage from "../pages/ComparePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UserProfilePage from "../pages/UserProfilePage";
import ModerationPage from "../pages/ModerationPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "cameras", element: <CameraListPage /> },
      { path: "cameras/:slug", element: <CameraDetailPage /> },
      { path: "compare", element: <ComparePage /> },
      { path: "profile/:username", element: <UserProfilePage /> },
      { path: "moderation", element: <ModerationPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);

export default router;
