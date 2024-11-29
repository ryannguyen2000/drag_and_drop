import {createSlice} from "@reduxjs/toolkit";
import {getUniqueContentItems} from "../utilities";
import {sample_data} from "../config/common";

export interface DndState {
  activeId: string | null;
  activeData: any | null;
  data: Obj;
  sidebar: any[];
  properties: Properties;
  deepLevel: number;
  thumnail: string;
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
  thumnail?: string;
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
  childs: Obj[];
  thumnail: string;
}

const initialState: DndState = {
  thumnail: "_",
  activeId: null,
  activeData: null,
  data: {
    id: "root",
    thumnail: "_",
    type: "grid",
    columns: "1",
    gap: "1",
    rows: "1",
    colspan: "1",
    rowspan: "1",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    style: {},
    childs: [],
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
    thumnail: "_",
  },
  deepLevel: 1,
};

const updateItem = (
  data: Obj,
  id: string,
  updatedValues: Partial<Obj>
): Obj => {
  if (data.id === id) {
    return {...data, ...updatedValues};
  }

  if (!data.childs || data.childs.length === 0) {
    return data;
  }

  const updatedChilds = data.childs.map((child) =>
    updateItem(child, id, updatedValues)
  );

  if (updatedChilds !== data.childs) {
    return {...data, childs: updatedChilds};
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
    setData: (state, action) => {
      state.data = action.payload;
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
    setThumnail: (state, action) => {
      state.thumnail = action.payload;
    },
  },
});

export const {
  setActiveId,
  setActiveData,
  setSidebar,
  setData,
  setThumnail,
  setProperties,
  setDeepLevel,
} = dndSlice.actions;

export default dndSlice.reducer;
