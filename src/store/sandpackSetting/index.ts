import { createSlice } from "@reduxjs/toolkit";
// import { defaultContentWidgetElement } from "../utilities/consts";

export interface sandpackSettingState {
  activeFileSetting: string | null;
  dataEnv: any[];
  dataPackage: any;
  dataTailwind: any;
  dataContentSandpack: string;
  selectedLibs: string[];
}

const initialState: sandpackSettingState = {
  activeFileSetting: "/App.js",
  dataEnv: [],
  dataPackage: "",
  dataTailwind: "",
  dataContentSandpack: null,
  selectedLibs: [],
};

export const sandpackSetting = createSlice({
  name: "sandpackSetting",
  initialState,
  reducers: {
    setActiveFileSetting: (state, action) => {
      state.activeFileSetting = action.payload;
    },
    setDataEnv: (state, action) => {
      state.dataEnv = action.payload;
    },
    setDataPackage: (state, action) => {
      state.dataPackage = action.payload;
    },
    setDataTailwind: (state, action) => {
      state.dataTailwind = action.payload;
    },
    setDataContentSandpack: (state, action) => {
      state.dataContentSandpack = action.payload;
    },
    setSelectedLibs: (state, action) => {
      state.selectedLibs = action.payload;
    },
  },
});

export const {
  setActiveFileSetting,
  setDataPackage,
  setDataTailwind,
  setDataEnv,
  setDataContentSandpack,
  setSelectedLibs,
} = sandpackSetting.actions;

export default sandpackSetting.reducer;
