import axios from "axios";
import { ToastError, ToastSuccess } from "../../components/toast";
import { saveDocumentType } from "./type";

export const saveDocument = async (payload: saveDocumentType) => {
  const res = await axios.post(
    "https://serverless-tn-layout-production.up.railway.app/api/documents",
    payload
  );

  if (res.status === 200 || res.status === 201) {
    ToastSuccess({ msg: "Store document successfully" });
  } else {
    ToastError({
      msg: "Oops! Something went wrong to available store document",
    });
  }
};
