import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { Toaster } from "react-hot-toast";
import RootProvider from "./providers/RootProvider.tsx";
import { Routers } from "./routers/index.tsx";
// import Modal from "react-modal";

// Modal.setAppElement("#root");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RootProvider routers={Routers} />
      <Toaster position="top-center" />
    </Provider>
  </StrictMode>
);
