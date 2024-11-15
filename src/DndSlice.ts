import {createSlice} from "@reduxjs/toolkit";
import {sample_data} from "./config/common";
import {getUniqueContentItems} from "./utilities";

export interface DndState {
  activeId: string | null;
  activeData: any | null;
  data: Obj;
  sidebar: any[];
  col: string;
  row: string;
  colspan: string;
  rowspan: string;
}

export interface Obj {
  id: string;
  type: string;
  columns: string;
  rows: string;
  childs: Obj[];
}

const initialState: DndState = {
  activeId: null,
  activeData: null,
  data: {
    id: "root",
    type: "layout",
    columns: "2",
    rows: "2",
    childs: [],
  },
  sidebar: getUniqueContentItems(sample_data),
  colspan: "1",
  col: "1",
  row: "1",
  rowspan: "1",
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
    setColumns: (state, action) => {
      state.col = action.payload;
    },
    setRows: (state, action) => {
      state.row = action.payload;
    },
    setColspan: (state, action) => {
      state.colspan = action.payload;
    },
    setRowspan: (state, action) => {
      state.rowspan = action.payload;
    },
  },
});

export const {
  setActiveId,
  setActiveData,
  setSidebar,
  setData,
  setColspan,
  setColumns,
  setRows,
  setRowspan,
} = dndSlice.actions;

export default dndSlice.reducer;
