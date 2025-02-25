import { createSlice } from "@reduxjs/toolkit";
import { getUniqueContentItems } from "../utilities";
import { sample_data } from "../config/common";
import { defaultCode } from "../components/monacoEditor/const";
import { BREAKPOINTS } from "../utilities/const/common";

export interface DndState {
  activeId: string | null;
  activeData: any | null;
  data: {
    mobile: Obj;
    desktop: Obj;
  };
  sidebar: any[];
  properties: Properties;
  deepLevel: number;
  thumbnail: string;
  lockScroll: boolean;
  activeCreateFunction: boolean;
  dataComponent: string;
  loadingMonacoEditor: boolean;
  typeScreen: string;
  breakpoint: string;
  moveSliceParent: boolean;
  viewport: ViewportSettings;
}

interface ViewportSettings {
  dimensions: string;
  width: number;
  height: number;
  zoomMode: string;
}

interface Properties {
  columns: string;
  rows: string;
  colspan: string;
  rowspan: string;
  gap: string;
  justifyContent:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-around"
    | "space-between"
    | "space-evenly";
  alignItems: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
  style?: React.CSSProperties;
  style_mobile?: React.CSSProperties;
  style_tablet?: React.CSSProperties;
  style_laptop?: React.CSSProperties;
  style_pc?: React.CSSProperties;
  thumbnail?: string;
  dataSlice: {
    title?: string;
    url?: string;
  };
}

export interface Obj {
  id: string;
  type: string;
  columns: string;
  rows: string;
  gap: string;
  colspan: string;
  rowspan: string;
  justifyContent: string;
  alignItems: string;
  style?: React.CSSProperties;
  style_mobile?: React.CSSProperties;
  style_tablet?: React.CSSProperties;
  style_laptop?: React.CSSProperties;
  style_pc?: React.CSSProperties;
  childs: Obj[];
  thumbnail?: string;
  dataSlice: {
    title?: string;
    url?: string;
  };
}

const initialData = {
  id: "root",
  thumbnail: "",
  type: "grid",
  columns: "1",
  gap: "1",
  rows: "1",
  colspan: "1",
  rowspan: "1",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  style: {},
  style_mobile: {},
  style_tablet: {},
  style_laptop: {},
  style_pc: {},
  childs: [],
  dataSlice: {
    title: "",
    url: "",
  },
  typeScreen: "mobile",
  breakpoint: BREAKPOINTS.laptop.style,
};

const initialState: DndState = {
  thumbnail: "",
  lockScroll: false,
  activeId: null,
  activeData: null,
  data: {
    mobile: initialData,
    desktop: initialData,
  },
  // sidebar: sample_data.childs,
  sidebar: [],
  properties: {
    columns: "1",
    rows: "1",
    colspan: "1",
    gap: "1",
    rowspan: "1",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    style: {},
    thumbnail: "",
    dataSlice: {},
  },
  deepLevel: 1,
  activeCreateFunction: false,
  dataComponent: defaultCode,
  loadingMonacoEditor: false,
  typeScreen: "mobile",
  // breakpoint:  BREAKPOINTS.laptop.style,
  breakpoint: BREAKPOINTS.mobile.style,
  moveSliceParent: false,
  viewport: {
    dimensions: "Responsive",
    width: 1400,
    height: 513,
    zoomMode: "100%",
  },
};

const updateItem = (
  data: Obj,
  id: string,
  updatedValues: Partial<Obj>
): Obj => {
  if (data.id === id) {
    return { ...data, ...updatedValues };
  }

  if (!data.childs || data.childs.length === 0) {
    return data;
  }

  const updatedChilds = data.childs.map((child) =>
    updateItem(child, id, updatedValues)
  );

  if (updatedChilds !== data.childs) {
    return { ...data, childs: updatedChilds };
  }

  return data;
};

export const dndSlice = createSlice({
  name: "dnd",
  initialState,
  reducers: {
    setActiveId: (state, action) => {
      state.activeId = action.payload;
    },
    setActiveData: (state, action) => {
      state.activeData = action.payload;
    },
    setDataFetchData: (state, action) => {
      state.data = action.payload;
    },
    setData: (state, action) => {
      const layoutType = state.typeScreen || "desktop";
      state.data[layoutType] = action.payload;
    },
    setSidebar: (state, action) => {
      state.sidebar = action.payload;
    },
    setProperties: (state, action) => {
      state.properties = action.payload;
    },
    setDeepLevel: (state, action) => {
      state.deepLevel = action.payload;
    },
    setthumbnail: (state, action) => {
      state.thumbnail = action.payload;
    },
    setScrollLock: (state, action) => {
      state.lockScroll = action.payload;
    },
    setLoadingMonacoEditor: (state, action) => {
      state.loadingMonacoEditor = action.payload;
    },
    setDataComponent: (state, action) => {
      state.dataComponent = action.payload;
    },
    setActiveCreateFunction: (state, action) => {
      state.activeCreateFunction = action.payload;
    },
    setTypeScreen: (state, action) => {
      state.typeScreen = action.payload;
    },
    setBreakpoint: (state, action) => {
      state.breakpoint = action.payload;
    },
    setMoveSliceParent: (state, action) => {
      state.moveSliceParent = action.payload;
    },
    setViewport: (state, action) => {
      state.viewport = action.payload;
    },
  },
});

export const {
  setActiveId,
  setActiveData,
  setSidebar,
  setData,
  setthumbnail,
  setProperties,
  setDeepLevel,
  setScrollLock,
  setDataComponent,
  setActiveCreateFunction,
  setLoadingMonacoEditor,
  setTypeScreen,
  setDataFetchData,
  setBreakpoint,
  setMoveSliceParent,
  setViewport,
} = dndSlice.actions;

export default dndSlice.reducer;
