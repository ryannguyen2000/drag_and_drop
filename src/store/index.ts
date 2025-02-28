import { configureStore } from "@reduxjs/toolkit";
import { dndSlice } from "./DndSlice";
import { DocumentSlice } from "./documents/documentSlice";
import { GlobalSlice } from "./global/globalSlice";
import { projectsSlice } from "./ProjectSlice";
import { dndWidgets } from "./DndWidget";
import { sidebar } from "./sidebar";

export const store = configureStore({
  reducer: {
    dndSlice: dndSlice.reducer,
    documentSlice: DocumentSlice.reducer,
    globalSlice: GlobalSlice.reducer,
    projects: projectsSlice.reducer,
    dndWidgets: dndWidgets.reducer,
    sidebar: sidebar.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
