import { Editor, HomePage } from "../pages";
import DocumentsPage from "../pages/documents";

export const Routers = [
  {
    path: "/",
    title: "Home",
    value: "home",
    icon: "ph:house-simple",
    element: <HomePage />,
  },
  {
    path: "/editor",
    title: "Editor",
    value: "editor",
    icon: "ph:house-simple",
    element: <Editor />,
  },
  {
    path: "/documents",
    title: "Documents",
    value: "docunments",
    icon: "ph:house-simple",
    element: <DocumentsPage />,
  },
];
