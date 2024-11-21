import {lazy, StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {Provider} from "react-redux";
import {store} from "./store/index.ts";
import {Toaster} from "react-hot-toast";
import RootProvider from "./providers/RootProvider.tsx";
import {Routes} from "./config/common.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RootProvider routers={Routes} />
      <Toaster position="top-center" />
    </Provider>
  </StrictMode>
);
