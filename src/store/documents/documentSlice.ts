import { createSlice } from "@reduxjs/toolkit";
import { IDocument } from "./type";

interface IDocumentSlice {
  activeDocument: IDocument | null;
}

const initialState: IDocumentSlice = {
  activeDocument: null,
};

export const DocumentSlice = createSlice({
  name: "documentSlice",
  initialState,
  reducers: {
    setActiveDocument: (
      state,
      action: {
        payload: IDocument;
      }
    ) => {
      state.activeDocument = action.payload;
    },
  },
});

export const { setActiveDocument } = DocumentSlice.actions;

export default DocumentSlice.reducer;
