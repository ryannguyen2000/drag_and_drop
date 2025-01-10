import axios from "axios";
import React from "react";
import { transformData } from "../../utilities/formatData";
import { DecryptBasic } from "../../utilities/hash_aes";
import { GetACookie } from "../../utilities/cookies";
import { Enum } from "../../config/common";
import { ToastError, ToastSuccess } from "../toast";
import { RootState } from "../../store";
import { shallowEqual, useSelector } from "react-redux";

const BtnPublish = () => {
  const [dndSlice, documentSlice] = useSelector(
    (state: RootState) => [state.dndSlice, state.documentSlice],
    shallowEqual
  );

  const { data, activeId, dataComponent } = dndSlice as any;
  const { documentName } = documentSlice as any;

  const handlePublishJsonData = async () => {
    // const layoutJSON = await getCachedDataFromIndexedDB(
    //   DecryptBasic(GetACookie("did"), Enum.srkey)
    // );
    // console.log(JSON.stringify(data));

    const getDoc = await axios.get(
      `${import.meta.env.VITE__API_HOST}/api/documents?dId=${DecryptBasic(
        GetACookie("did"),
        Enum.srkey
      )}`
    );
    const documentData = {
      projectId: DecryptBasic(GetACookie("pid"), Enum.srkey),
      documentId: DecryptBasic(GetACookie("did"), Enum.srkey),
      layoutJson: data,
      documentName:
        (getDoc.status === 200 || getDoc.status === 201) &&
        getDoc.data?.documentName,
      thumbnail: "",
    };

    try {
      const finalData = transformData(
        data,
        DecryptBasic(GetACookie("pid"), Enum.srkey),
        DecryptBasic(GetACookie("did"), Enum.srkey)
      );

      if (finalData) {
        const saveDocResponse = await axios.post(
          `${import.meta.env.VITE__API_HOST}/api/documents`,
          documentData
        );

        const response = await axios.post(
          `${import.meta.env.VITE__API_HOST}/publish`,
          {
            name: documentName || "",
            layout: data,
            component: dataComponent,
          }
        );

        const saveComponent = await axios.post(
          `${import.meta.env.VITE__API_HOST}/api/components-config`,
          {
            sliceId: activeId,
            component: dataComponent,
          }
        );

        if (response.status === 200 || response.status === 201) {
          ToastSuccess({ msg: "Published successfully" });
        } else {
          ToastError({
            msg: "Oops! Something went wrong to available publish",
          });
        }
      }
    } catch (error) {
      //
    }
  };

  return (
    <button
      onClick={() => handlePublishJsonData()}
      className="h-10 px-4 text-sm bg-[#444] text-white rounded-full"
    >
      Publish
    </button>
  );
};

export default BtnPublish;
