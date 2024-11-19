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
    columns: "1",
    rows: "1",
    colspan: "1",
    rowspan: "1",
    childs: [],
  },
  sidebar: sample_data.childs,
  properties: {
    columns: "1",
    rows: "1",
    colspan: "1",
    rowspan: "1",
  },
};

// const updateItem = (
//   data: Obj,
//   id: string,
//   updatedValues: Partial<Obj>
// ): Obj => {
//   if (data.id === id) {
//     // Cập nhật giá trị cho item tương ứng với id
//     return {...data, ...updatedValues};
//   }

//   // Nếu có child, đệ quy cập nhật
//   if (data.childs.length > 0) {
//     data.childs = data.childs.map((child) =>
//       updateItem(child, id, updatedValues)
//     );
//   }

//   return data;
// };

const updateItem = (
  data: Obj,
  id: string,
  updatedValues: Partial<Obj>
): Obj => {
  if (data.id === id) {
    // Cập nhật trực tiếp khi tìm thấy item
    return { ...data, ...updatedValues };
  }

  // Nếu không có childs, không cần tiếp tục
  if (!data.childs || data.childs.length === 0) {
    return data;
  }

  // Cập nhật đệ quy cho các childs (nếu cần)
  const updatedChilds = data.childs.map(child =>
    updateItem(child, id, updatedValues)
  );

  // Chỉ cập nhật childs nếu có thay đổi
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
    setData: (state, action) => {
      state.data = action.payload;
    },
    setSidebar: (state, action) => {
      state.sidebar = action.payload;
    },
    setProperties: (state, action) => {
      state.properties = action.payload;
    },
  },
});

export const {setActiveId, setActiveData, setSidebar, setData, setProperties} =
  dndSlice.actions;

export default dndSlice.reducer;
