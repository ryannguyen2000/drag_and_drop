import { createSlice } from "@reduxjs/toolkit";
import { IDocument } from "./type";

type DocumentType = {
  [key: string]: any; // Allows any key-value pairs
};

interface IDocumentSlice {
  activeDocument: IDocument | null;
  documentName: string;
  uid: string;
  listDocument: DocumentType[]
}

const initialState: IDocumentSlice = {
  activeDocument: null,
  documentName: "",
  uid: "",
  listDocument: []
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
    setUID: (state, action) => {
      state.uid = action.payload;
    },
    setListDocumnetStore: (state, action) => {
      state.listDocument = action.payload
    }
  },
});

export const { setActiveDocument, setDocumentName, setUID, setListDocumnetStore } = DocumentSlice.actions;

export default DocumentSlice.reducer;
