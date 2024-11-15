import {createSlice} from "@reduxjs/toolkit";
import {getUniqueContentItems} from "../utilities";
import {sample_data} from "../config/common";

export interface DndState {
  activeId: string | null;
  activeData: any | null;
  data: Obj;
  sidebar: any[];
  col: string;
  row: string;
  colspan: string;
  rowspan: string;
  properties: Properties;
}

interface Properties {
  columns: string;
  rows: string;
  colspan: string;
  rowspan: string;
}

export interface Obj {
  id: string;
  type: string;
  columns: string;
  rows: string;
  colspan: string;
  rowspan: string;
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
    colspan: "1",
    rowspan: "1",
    childs: [],
  },
  sidebar: getUniqueContentItems(sample_data),
  colspan: "1",
  col: "1",
  row: "1",
  rowspan: "1",
  properties: {
    columns: "1",
    rows: "1",
    colspan: "1",
    rowspan: "1",
  },
};

const updateItem = (
  data: Obj,
  id: string,
  updatedValues: Partial<Obj>
): Obj => {
  if (data.id === id) {
    // Cập nhật giá trị cho item tương ứng với id
    return {...data, ...updatedValues};
  }

  // Nếu có child, đệ quy cập nhật
  if (data.childs.length > 0) {
    data.childs = data.childs.map((child) =>
      updateItem(child, id, updatedValues)
    );
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
    setColumns: (state, action) => {
      state.col = action.payload;
      if (state.activeId) {
        // Cập nhật columns cho item trong data
        state.data = updateItem(state.data, state.activeId, {
          columns: action.payload,
        });
      }
    },
    setRows: (state, action) => {
      state.row = action.payload;
      if (state.activeId) {
        // Cập nhật rows cho item trong data
        state.data = updateItem(state.data, state.activeId, {
          rows: action.payload,
        });
      }
    },
    setColspan: (state, action) => {
      state.colspan = action.payload;
      if (state.activeId) {
        // Cập nhật colspan cho item trong data
        state.data = updateItem(state.data, state.activeId, {
          colspan: action.payload,
        });
      }
    },
    setRowspan: (state, action) => {
      state.rowspan = action.payload;
      if (state.activeId) {
        // Cập nhật rowspan cho item trong data
        state.data = updateItem(state.data, state.activeId, {
          rowspan: action.payload,
        });
      }
    },
    setProperties: (state, action) => {
      state.properties = action.payload;
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
  setProperties,
} = dndSlice.actions;

export default dndSlice.reducer;
