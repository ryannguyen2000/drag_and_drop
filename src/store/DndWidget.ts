import { createSlice } from "@reduxjs/toolkit";
import { defaultContentWidgetElement } from "../utilities/consts";

export interface DndWidgetsState {
  data: any[];
  listWidgetElements: any[];
  loading: boolean;
  isCustomElement: boolean;
  dataCustomWidget: {
    data: string;
    name: string;
  };
  activeWidgetId: string | null;
  dataEnv: any[];
}

const initialState: DndWidgetsState = {
  data: [],
  listWidgetElements: [],
  loading: false,
  isCustomElement: false,
  dataCustomWidget: {
    data: defaultContentWidgetElement,
    name: "",
  },
  activeWidgetId: null,
  dataEnv: [],
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
      state.dataCustomWidget = { ...state.dataCustomWidget, ...action.payload };
    },
    setListWidgetElements: (state, action) => {
      state.listWidgetElements = action.payload;
    },
    setActiveWidgetId: (state, action) => {
      state.activeWidgetId = action.payload;
    },
    setDataEnv: (state, action) => {
      state.dataEnv = action.payload;
    },
  },
});

export const {
  setDataElements,
  setIsCustomElement,
  setDataCustomWidget,
  setListWidgetElements,
  setActiveWidgetId,
  setDataEnv,
} = dndWidgets.actions;

export default dndWidgets.reducer;
