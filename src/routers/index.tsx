import {Icon} from "@iconify/react/dist/iconify.js";
import {Editor, HomePage} from "../pages";

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
    element: <Editor />,
  },
];
