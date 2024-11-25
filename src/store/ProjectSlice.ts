import {createSlice} from "@reduxjs/toolkit";

export interface DndState {
  projectList: any[];
  showContextMenu: null | string;
}
const initialState: DndState = {
  projectList: [],
  showContextMenu: null,
};
export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setListProjects: (state, action) => {
      state.projectList = action.payload;
    },
    setShowContextMenu: (state, action) => {
      state.showContextMenu = action.payload;
    },
  },
});
export const {setListProjects, setShowContextMenu} = projectsSlice.actions;

export default projectsSlice.reducer;
asdasdasd; 
