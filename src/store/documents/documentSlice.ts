import { createSlice } from "@reduxjs/toolkit";
import { IDocument } from "./type";

interface IDocumentSlice {
  activeDocument: IDocument | null;
  documentName: string;
}

const initialState: IDocumentSlice = {
  activeDocument: null,
  documentName: "",
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
    setDocumentName: (state, action) => {
      state.documentName = action.payload;
    },
  },
});

export const { setActiveDocument, setDocumentName } = DocumentSlice.actions;

export default DocumentSlice.reducer;
