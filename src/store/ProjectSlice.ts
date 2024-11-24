import {createSlice} from "@reduxjs/toolkit";

export interface DndState {
  projectList: any[];
}
const initialState: DndState = {
  projectList: [],
};
export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setListProjects: (state, action) => {
      state.projectList = action.payload;
    },
  },
});
export const {setListProjects} = projectsSlice.actions;

export default projectsSlice.reducer;
