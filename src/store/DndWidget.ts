import { createSlice } from "@reduxjs/toolkit";

export interface DndWidgetsState {
  data: any[];
  listWidgetElements: any[];
  loading: boolean;
  isCustomElement: boolean;
  dataCustomWidget: {
    data: string;
    name: string;
  };
}

const initialState: DndWidgetsState = {
  data: [],
  listWidgetElements: [],
  loading: false,
  isCustomElement: false,
  dataCustomWidget: {
    data: "",
    name: "",
  },
};

export const dndWidgets = createSlice({
  name: "dndWidgets",
  initialState,
  reducers: {
    setDataElements: (state, action) => {
      state.data = action.payload;
    },
    setIsCustomElement: (state, action) => {
      state.isCustomElement = action.payload;
    },
    setDataCustomWidget: (state, action) => {
      state.dataCustomWidget = action.payload;
    },
    setListWidgetElements: (state, action) => {
      state.listWidgetElements = action.payload;
    },
  },
});

export const {
  setDataElements,
  setIsCustomElement,
  setDataCustomWidget,
  setListWidgetElements,
} = dndWidgets.actions;

export default dndWidgets.reducer;
