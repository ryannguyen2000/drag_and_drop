import LoginPage from "../components/login";
import DocumentsPage from "../pages/documents";
import Editor from "../pages/editor";
import HomePage from "../pages/home";

export const Routers = [
  {
    path: "/",
    title: "Home",
    value: "home",
    icon: "ph:house-simple",
    element: <HomePage />,
    requiresAuth: true,
  },
  {
    path: "/editor",
    title: "Editor",
    value: "editor",
    icon: "ph:house-simple",
    element: <Editor />,
    requiresAuth: true,
  },
  {
    path: "/documents",
    title: "Documents",
    value: "documents",
    icon: "ph:house-simple",
    element: <DocumentsPage />,
    requiresAuth: true,
  },
  {
    path: "/login",
    title: "Login",
    value: "login",
    icon: "ph:sign-in",
    element: <LoginPage />,
    requiresAuth: false,
  },
];
