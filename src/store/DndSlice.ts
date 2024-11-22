import {createSlice} from "@reduxjs/toolkit";
import {getUniqueContentItems} from "../utilities";
import {sample_data} from "../config/common";

export interface DndState {
  activeId: string | null;
  activeData: any | null;
  data: Obj;
  sidebar: any[];
  properties: Properties;
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
}

export interface Obj {
  id: string;
  type: string;
  columns: string;
  rows: string;
  gap: string;
  colspan: string;
  rowspan: string;
  justifyContent:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-around"
    | "space-between"
    | "space-evenly";
  alignItems: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
  childs: Obj[];
  image?: string;
}

const initialState: DndState = {
  activeId: null,
  activeData: null,
  data: {
    id: "root",
    type: "grid",
    columns: "1",
    gap: "1",
    rows: "1",
    colspan: "1",
    rowspan: "1",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    childs: [],
  },
  sidebar: sample_data.childs,
  properties: {
    columns: "1",
    rows: "1",
    colspan: "1",
    gap: "1",
    rowspan: "1",
    alignItems: "flex-start",
    justifyContent: "flex-start",
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

  const updatedChilds = data.childs.map(child =>
    updateItem(child, id, updatedValues)
  );

  return { ...data, childs: updatedChilds };
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
    setImage: (state, action) => {
      const { id, image } = action.payload;
      state.data = updateItem(state.data, id, { image });
    },
  },
});

export const {
  setActiveId,
  setActiveData,
  setSidebar,
  setData,
  setProperties,
  setImage,
} = dndSlice.actions;


export default dndSlice.reducer;
