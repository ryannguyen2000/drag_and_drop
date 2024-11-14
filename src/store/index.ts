import {configureStore} from "@reduxjs/toolkit";
import {dndSlice} from "./DndSlice";

export const store = configureStore({
  reducer: {
    dndSlice: dndSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
