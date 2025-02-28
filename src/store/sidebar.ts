import { createSlice } from "@reduxjs/toolkit";

export interface SidebarState {
  menuSelected: number | null;
}

const initialState: SidebarState = {
  menuSelected: 4,
};

export const sidebar = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setMenuSelected: (state, action) => {
      state.menuSelected = action.payload;
    },
  },
});

export const { setMenuSelected } = sidebar.actions;

export default sidebar.reducer;
