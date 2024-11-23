import { createSlice } from "@reduxjs/toolkit";

interface IGlobalSlice {
  trigger: {
    isTriggerFetchListDocument: boolean;
  };
}

const initialState: IGlobalSlice = {
  trigger: {
    isTriggerFetchListDocument: false,
  },
};

export const GlobalSlice = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    setTriggerFetchListDocument: (
      state,
      action: {
        payload: boolean;
      }
    ) => {
      state.trigger.isTriggerFetchListDocument = action.payload;
    },
  },
});

export const { setTriggerFetchListDocument } = GlobalSlice.actions;

export default GlobalSlice.reducer;
