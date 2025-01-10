import _ from "lodash";
import axios from "axios";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import { Input } from "../commom/input";
import { ToastDismiss, ToastError, ToastSuccess } from "../toast";
import { PutData } from "../../apis";
import { setActiveData } from "../../store/DndSlice";

const DataSlice = ({ activeData, activeId, dataSlice, setDataSlice }) => {
  const dispatch = useDispatch();

  const debouncedDispatch = useCallback(
    _.debounce((newDataSlice) => {
      dispatch(setActiveData({ ...activeData, dataSlice: newDataSlice }));
    }, 1000),
    []
  );

  const handleInputChange = (title: any) => {
    setDataSlice((prev) => ({ ...prev, title }));
    debouncedDispatch({ ...dataSlice, title });
  };

  const uploadMediaToServer = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("media", file); // The key must match "media" in the backend

      const response = await axios.post(
        `${import.meta.env.VITE__API_HOST}/api/uploadMedia`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        return response.data?.mediaUrl; // Adjusted to match the updated backend response
      }
    } catch (error) {
      ToastError({ msg: "Error uploading media to server." });
      return null;
    }
  };

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      ToastError({ msg: "Please upload a valid image or video file." });
      return;
    }

    if (activeId) {
      const idCopy = activeId;
      const reader = new FileReader();
      reader.onload = async () => {
        // const base64Media = reader.result as string;
        // Upload media (image or video) to the server
        const uploadedMediaUrl = await uploadMediaToServer(file);

        if (uploadedMediaUrl) {
          const newdataSlice = {
            ...dataSlice,
            url: uploadedMediaUrl,
          };
          setDataSlice((prev) => ({ ...prev, url: uploadedMediaUrl }));
          dispatch(setActiveData({ ...activeData, dataSlice: newdataSlice }));
          ToastDismiss();
          ToastSuccess({
            msg: `${isImage ? "Image" : "Video"} uploaded successfully!`,
          });
          e.target.value = "";

          // await PutData(`${import.meta.env.VITE__API_HOST}/api/slices`, {
          //   sliceId: idCopy,
          //   dataSlice: newdataSlice,
          // });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <details>
      <summary className="flex cursor-pointer w-full items-center justify-between gap-1.5 rounded-lg bg-white p-4 text-gray-900">
        <span className="font-semibold text-gray-800 capitalize">Data</span>
        <svg
          className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>

      <ul className="flexgap-3 w-full mt-2 p-4 bg-white shadow-lg rounded-b-xl">
        <li>
          <div className="flex items-center justify-start p-4 gap-1.5">
            <div className="">Title:</div>
            <Input
              onChange={handleInputChange}
              defaultValue={_.get(dataSlice, "title", "")}
            />
          </div>
        </li>
        <li>
          <div className="flex flex-col mt-3 mb-4 p-4  animate-fade-up ">
            <label className="text-sm font-medium text-gray-400">
              Upload Image/Videos
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="h-10 w-full border rounded-lg px-3 mt-2"
            />
            {!_.isEmpty(activeData.dataSlice) && (
              <div className="mt-2">
                {_.get(activeData, "dataSlice.url")?.startsWith(
                  "data:image/"
                ) ? (
                  <img
                    src={_.get(activeData, "dataSlice.url")}
                    alt="Preview"
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <video
                    src={_.get(activeData, "dataSlice.url")}
                    controls
                    className="w-full h-auto rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
        </li>
      </ul>
    </details>
  );
};

export default DataSlice;
