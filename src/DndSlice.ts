import {createSlice} from "@reduxjs/toolkit";
import {sample_data} from "./config/common";
import {getUniqueContentItems} from "./utilities";

export interface DndState {
  activeId: string | null;
  activeData: any | null;
  data: Obj;
  sidebar: any[];
}

export interface Obj {
  id: string;
  type: string;
  columns: string;
  colspan: string;
  rowspan: string;
  rows: string;
  childs: Obj[];
}

const initialState: DndState = {
  activeId: null,
  activeData: null,
  data: {
    id: "root",
    type: "layout",
    columns: "1",
    rows: "1",
    colspan: "1",
    rowspan: "1",
    childs: [],
  },
  sidebar: sample_data.childs,
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
  },
});

export const {setActiveId, setActiveData, setSidebar, setData} =
  dndSlice.actions;

export default dndSlice.reducer;
