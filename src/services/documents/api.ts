import axios from "axios";
import { ToastError, ToastSuccess } from "../../components/toast";
import { saveDocumentRequest } from "./type";
import { IDocument } from "../../store/documents/type";
import { store } from "../../store";
import { setTriggerFetchListDocument } from "../../store/global/globalSlice";

const HOST_API = "https://serverless-tn-layout-production.up.railway.app";

export const saveDocument = async (payload: saveDocumentRequest) => {
  const res = await axios.post(`${HOST_API}/api/documents`, payload);

  if (res.status === 200 || res.status === 201) {
    ToastSuccess({ msg: "Store document successfully" });
  } else {
    ToastError({
      msg: "Oops! Something went wrong to available store document",
    });
  }
};

export const getAllDocument = async (): Promise<IDocument[]> => {
  const res = await axios.get(`${HOST_API}/api/documents`);

  if (res.status === 200 || res.status === 201) {
    return res.data;
  } else {
    ToastError({
      msg: "Oops! Something went wrong to available documents",
    });
    return [];
  }
};

export const deleteDocument = async (id: string): Promise<void> => {
  const res = await axios.delete(`${HOST_API}/api/documents`, {
    data: {
      id: id,
    },
  });

  if (res.status === 200 || res.status === 201) {
    ToastSuccess({
      msg: "Document deleted successfully!",
    });

    store.dispatch(setTriggerFetchListDocument(false));
  } else {
    ToastError({
      msg: "Oops! Something went wrong to available documents",
    });
  }
};
